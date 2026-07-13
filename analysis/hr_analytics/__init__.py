"""Pacote de análise e modelagem de risco de attrition."""

from __future__ import annotations

RANDOM_STATE = 42
MODEL_VERSION = "v1"

# Colunas constantes / sem valor preditivo (removidas das features).
CONSTANT_COLUMNS = ["EmployeeCount", "Over18", "StandardHours"]
ID_COLUMN = "EmployeeNumber"
TARGET_COLUMN = "Attrition"

CATEGORICAL_FEATURES = [
    "BusinessTravel",
    "Department",
    "EducationField",
    "Gender",
    "JobRole",
    "MaritalStatus",
    "OverTime",
]
