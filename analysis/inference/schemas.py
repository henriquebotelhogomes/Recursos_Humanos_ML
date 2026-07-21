from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class EmployeeFeatures(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: int
    businessTravel: str
    dailyRate: int
    department: str
    distanceFromHome: int
    education: int
    educationField: str
    environmentSatisfaction: int
    gender: str
    hourlyRate: int
    jobInvolvement: int
    jobLevel: int
    jobRole: str
    jobSatisfaction: int
    maritalStatus: str
    monthlyIncome: int
    monthlyRate: int
    numCompaniesWorked: int
    overTime: str
    percentSalaryHike: int
    performanceRating: int
    relationshipSatisfaction: int
    stockOptionLevel: int
    totalWorkingYears: int
    trainingTimesLastYear: int
    workLifeBalance: int
    yearsAtCompany: int
    yearsInCurrentRole: int
    yearsSinceLastPromotion: int
    yearsWithCurrManager: int


class PredictRequest(BaseModel):
    employee: EmployeeFeatures


class PredictBatchRequest(BaseModel):
    employees: list[EmployeeFeatures]


class PredictResponse(BaseModel):
    attritionProbability: float
    riskScore: int
    riskLevel: str
    modelVersion: str


class PredictBatchResponse(BaseModel):
    data: list[PredictResponse]


class ModelInfoResponse(BaseModel):
    modelVersion: str
    modelPath: str
