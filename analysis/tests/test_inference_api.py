from __future__ import annotations

import numpy as np
from fastapi.testclient import TestClient

from analysis.inference.main import app


class _DummyModel:
    def predict_proba(self, x):
        return np.array([[0.2, 0.8] for _ in range(len(x))])


def _sample_employee() -> dict[str, object]:
    return {
        "age": 35,
        "businessTravel": "Travel_Rarely",
        "dailyRate": 1000,
        "department": "Sales",
        "distanceFromHome": 5,
        "education": 3,
        "educationField": "Life Sciences",
        "environmentSatisfaction": 3,
        "gender": "Male",
        "hourlyRate": 60,
        "jobInvolvement": 3,
        "jobLevel": 2,
        "jobRole": "Sales Executive",
        "jobSatisfaction": 3,
        "maritalStatus": "Single",
        "monthlyIncome": 5000,
        "monthlyRate": 12000,
        "numCompaniesWorked": 2,
        "overTime": "Yes",
        "percentSalaryHike": 15,
        "performanceRating": 3,
        "relationshipSatisfaction": 3,
        "stockOptionLevel": 1,
        "totalWorkingYears": 10,
        "trainingTimesLastYear": 3,
        "workLifeBalance": 3,
        "yearsAtCompany": 6,
        "yearsInCurrentRole": 4,
        "yearsSinceLastPromotion": 2,
        "yearsWithCurrManager": 3,
    }


def test_health() -> None:
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_predict_and_batch() -> None:
    app.state.model = _DummyModel()
    client = TestClient(app)

    single = client.post("/predict", json={"employee": _sample_employee()})
    assert single.status_code == 200
    data = single.json()
    assert data["attritionProbability"] == 0.8
    assert data["riskScore"] == 80
    assert data["riskLevel"] == "CRITICAL"

    batch = client.post(
        "/predict/batch",
        json={"employees": [_sample_employee(), _sample_employee()]},
    )
    assert batch.status_code == 200
    assert len(batch.json()["data"]) == 2
