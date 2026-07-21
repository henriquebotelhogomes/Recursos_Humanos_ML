from __future__ import annotations

import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import Depends, FastAPI, Header, HTTPException

from analysis.hr_analytics import MODEL_VERSION
from analysis.inference.schemas import (
    EmployeeFeatures,
    ModelInfoResponse,
    PredictBatchRequest,
    PredictBatchResponse,
    PredictRequest,
    PredictResponse,
)

ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = Path(
    os.getenv(
        "MODEL_PATH",
        str(ROOT / "analysis" / "models" / f"model_{MODEL_VERSION}.joblib"),
    )
)
INFERENCE_API_KEY = os.getenv("INFERENCE_API_KEY", "")

APP_TO_MODEL_COLUMNS = {
    "age": "Age",
    "businessTravel": "BusinessTravel",
    "dailyRate": "DailyRate",
    "department": "Department",
    "distanceFromHome": "DistanceFromHome",
    "education": "Education",
    "educationField": "EducationField",
    "environmentSatisfaction": "EnvironmentSatisfaction",
    "gender": "Gender",
    "hourlyRate": "HourlyRate",
    "jobInvolvement": "JobInvolvement",
    "jobLevel": "JobLevel",
    "jobRole": "JobRole",
    "jobSatisfaction": "JobSatisfaction",
    "maritalStatus": "MaritalStatus",
    "monthlyIncome": "MonthlyIncome",
    "monthlyRate": "MonthlyRate",
    "numCompaniesWorked": "NumCompaniesWorked",
    "overTime": "OverTime",
    "percentSalaryHike": "PercentSalaryHike",
    "performanceRating": "PerformanceRating",
    "relationshipSatisfaction": "RelationshipSatisfaction",
    "stockOptionLevel": "StockOptionLevel",
    "totalWorkingYears": "TotalWorkingYears",
    "trainingTimesLastYear": "TrainingTimesLastYear",
    "workLifeBalance": "WorkLifeBalance",
    "yearsAtCompany": "YearsAtCompany",
    "yearsInCurrentRole": "YearsInCurrentRole",
    "yearsSinceLastPromotion": "YearsSinceLastPromotion",
    "yearsWithCurrManager": "YearsWithCurrManager",
}


def _score_to_level(score: int) -> str:
    medium = int(os.getenv("RISK_THRESHOLD_MEDIUM", "35"))
    high = int(os.getenv("RISK_THRESHOLD_HIGH", "60"))
    critical = int(os.getenv("RISK_THRESHOLD_CRITICAL", "80"))
    if score >= critical:
        return "CRITICAL"
    if score >= high:
        return "HIGH"
    if score >= medium:
        return "MEDIUM"
    return "LOW"


def _require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    if not INFERENCE_API_KEY:
        return
    if x_api_key != INFERENCE_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


def _to_dataframe(employees: list[EmployeeFeatures]) -> pd.DataFrame:
    rows = []
    for e in employees:
        payload = e.model_dump()
        rows.append({APP_TO_MODEL_COLUMNS[k]: payload[k] for k in APP_TO_MODEL_COLUMNS})
    return pd.DataFrame(rows)


app = FastAPI(title="PeopleRisk Inference API", version=MODEL_VERSION)


@app.on_event("startup")
def _load_model() -> None:
    if MODEL_PATH.exists():
        app.state.model = joblib.load(MODEL_PATH)
    else:
        app.state.model = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get(
    "/model-info",
    response_model=ModelInfoResponse,
    dependencies=[Depends(_require_api_key)],
)
def model_info() -> ModelInfoResponse:
    return ModelInfoResponse(modelVersion=MODEL_VERSION, modelPath=str(MODEL_PATH))


def _predict(employees: list[EmployeeFeatures]) -> list[PredictResponse]:
    model = app.state.model
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model file not found: {MODEL_PATH}")
    x = _to_dataframe(employees)
    proba = np.asarray(model.predict_proba(x))[:, 1]
    data: list[PredictResponse] = []
    for p in proba:
        probability = float(round(float(p), 6))
        score = int(round(probability * 100))
        data.append(
            PredictResponse(
                attritionProbability=probability,
                riskScore=score,
                riskLevel=_score_to_level(score),
                modelVersion=MODEL_VERSION,
            )
        )
    return data


@app.post(
    "/predict",
    response_model=PredictResponse,
    dependencies=[Depends(_require_api_key)],
)
def predict(payload: PredictRequest) -> PredictResponse:
    return _predict([payload.employee])[0]


@app.post(
    "/predict/batch",
    response_model=PredictBatchResponse,
    dependencies=[Depends(_require_api_key)],
)
def predict_batch(payload: PredictBatchRequest) -> PredictBatchResponse:
    if not payload.employees:
        raise HTTPException(status_code=422, detail="employees cannot be empty")
    return PredictBatchResponse(data=_predict(payload.employees))
