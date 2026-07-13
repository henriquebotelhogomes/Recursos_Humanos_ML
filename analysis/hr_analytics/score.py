"""Scoring e explicação local (fatores de risco por profissional)."""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from analysis.hr_analytics import RANDOM_STATE
from analysis.hr_analytics.features import build_preprocessor

# Rótulos amigáveis (pt-BR) para exibição dos fatores.
FEATURE_LABELS: dict[str, str] = {
    "OverTime_Yes": "Faz horas extras",
    "OverTime_No": "Não faz horas extras",
    "MonthlyIncome": "Renda mensal",
    "Age": "Idade",
    "TotalWorkingYears": "Tempo total de carreira",
    "YearsAtCompany": "Tempo de empresa",
    "YearsInCurrentRole": "Tempo no cargo atual",
    "YearsWithCurrManager": "Tempo com o gestor atual",
    "YearsSinceLastPromotion": "Tempo desde a última promoção",
    "JobSatisfaction": "Satisfação no trabalho",
    "EnvironmentSatisfaction": "Satisfação com o ambiente",
    "JobInvolvement": "Envolvimento no trabalho",
    "WorkLifeBalance": "Equilíbrio vida/trabalho",
    "DistanceFromHome": "Distância de casa",
    "StockOptionLevel": "Nível de stock options",
    "JobLevel": "Nível do cargo",
    "NumCompaniesWorked": "Empresas anteriores",
    "TrainingTimesLastYear": "Treinamentos no último ano",
    "MaritalStatus_Single": "Estado civil: solteiro(a)",
    "BusinessTravel_Travel_Frequently": "Viaja com frequência",
}


def _clean_feature_name(raw: str) -> str:
    label = FEATURE_LABELS.get(raw)
    if label:
        return label
    # remove prefixos do ColumnTransformer (num__ / cat__)
    name = raw.split("__")[-1]
    return FEATURE_LABELS.get(name, name.replace("_", ": "))


def build_explainer(x: pd.DataFrame, y: pd.Series) -> tuple[Pipeline, list[str]]:
    """Ajusta um modelo linear interpretável (surrogate) e retorna nomes de features."""
    pre = build_preprocessor(x)
    explainer = Pipeline(
        [
            ("pre", pre),
            (
                "clf",
                LogisticRegression(
                    max_iter=1000, class_weight="balanced", random_state=RANDOM_STATE
                ),
            ),
        ]
    )
    explainer.fit(x, y)
    feature_names = list(explainer.named_steps["pre"].get_feature_names_out())
    return explainer, feature_names


def top_risk_factors(
    explainer: Pipeline,
    feature_names: list[str],
    x: pd.DataFrame,
    top_n: int = 4,
) -> list[list[dict[str, object]]]:
    """Calcula os principais fatores que aumentam o risco para cada linha."""
    pre = explainer.named_steps["pre"]
    clf: LogisticRegression = explainer.named_steps["clf"]
    transformed = pre.transform(x)
    if hasattr(transformed, "toarray"):
        transformed = transformed.toarray()
    coefs = clf.coef_[0]
    contributions = transformed * coefs  # (n_amostras, n_features)

    results: list[list[dict[str, object]]] = []
    for row in contributions:
        order = np.argsort(row)[::-1]  # maior contribuição positiva primeiro
        factors: list[dict[str, object]] = []
        for idx in order[:top_n]:
            contrib = float(row[idx])
            if contrib <= 0:
                continue
            factors.append(
                {
                    "feature": _clean_feature_name(feature_names[idx]),
                    "impact": round(contrib, 4),
                    "direction": "aumenta",
                }
            )
        results.append(factors)
    return results
