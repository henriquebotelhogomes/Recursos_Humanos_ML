"""Scoring e explicação local (fatores de risco por profissional) com SHAP."""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

try:
    import shap

    SHAP_IMPORT_ERROR: Exception | None = None
except Exception as exc:  # pragma: no cover - depende do ambiente Python
    shap = None
    SHAP_IMPORT_ERROR = exc

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


def _to_dense_matrix(values: object) -> np.ndarray:
    if hasattr(values, "toarray"):
        return values.toarray()
    return np.asarray(values)


def _normalize_shap_values(raw: object) -> np.ndarray:
    """Normaliza saídas heterogêneas do SHAP para (n_amostras, n_features)."""
    if isinstance(raw, list):
        # Em classificação binária alguns explainers retornam [classe_0, classe_1].
        raw = raw[-1]

    if hasattr(raw, "values") and not isinstance(raw, np.ndarray):
        raw = raw.values

    arr = np.asarray(raw)

    if arr.ndim == 3:
        # (n_amostras, n_features, n_classes) -> usa classe positiva.
        arr = arr[:, :, -1]
    elif arr.ndim == 1:
        arr = arr.reshape(1, -1)

    return arr


def _build_shap_explainer(
    clf: LogisticRegression | GradientBoostingClassifier, background: np.ndarray
) -> object:
    if shap is None:
        raise RuntimeError("Pacote 'shap' indisponível") from SHAP_IMPORT_ERROR
    if isinstance(clf, LogisticRegression):
        return shap.LinearExplainer(clf, background)
    if isinstance(clf, GradientBoostingClassifier):
        return shap.TreeExplainer(clf)
    return shap.Explainer(clf, background)


def explain_with_shap(
    model: Pipeline, x: pd.DataFrame
) -> tuple[np.ndarray, list[str], pd.DataFrame]:
    """Calcula SHAP values do pipeline final e retorna matriz + nomes das features."""
    if shap is None:
        raise RuntimeError("Pacote 'shap' indisponível") from SHAP_IMPORT_ERROR

    pre = model.named_steps["pre"]
    clf = model.named_steps["clf"]
    transformed = _to_dense_matrix(pre.transform(x))
    feature_names = list(pre.get_feature_names_out())

    explainer = _build_shap_explainer(clf, transformed)
    shap_values = _normalize_shap_values(explainer.shap_values(transformed))

    transformed_df = pd.DataFrame(
        transformed,
        columns=[_clean_feature_name(name) for name in feature_names],
    )
    return shap_values, feature_names, transformed_df


def top_risk_factors_from_shap(
    shap_values: np.ndarray, feature_names: list[str], top_n: int = 4
) -> list[list[dict[str, object]]]:
    """Extrai top fatores locais a partir de SHAP values."""
    results: list[list[dict[str, object]]] = []
    for row in shap_values:
        order = np.argsort(row)[::-1]
        factors: list[dict[str, object]] = []
        for idx in order[:top_n]:
            contrib = float(row[idx])
            factors.append(
                {
                    "feature": _clean_feature_name(feature_names[idx]),
                    "impact": round(abs(contrib), 4),
                    "direction": "aumenta" if contrib >= 0 else "reduz",
                }
            )
        results.append(factors)
    return results


def save_shap_reports(
    shap_values: np.ndarray,
    transformed_df: pd.DataFrame,
    reports_dir: str,
    model_version: str,
) -> tuple[str, str]:
    """Gera gráficos SHAP nativos (bar + beeswarm) em PNG."""
    if shap is None:
        raise RuntimeError("Pacote 'shap' indisponível") from SHAP_IMPORT_ERROR

    import matplotlib.pyplot as plt

    bar_path = f"{reports_dir}/shap_summary_bar_{model_version}.png"
    beeswarm_path = f"{reports_dir}/shap_beeswarm_{model_version}.png"

    shap.summary_plot(
        shap_values,
        transformed_df,
        plot_type="bar",
        show=False,
        max_display=15,
    )
    plt.tight_layout()
    plt.savefig(bar_path, dpi=160)
    plt.close()

    shap.summary_plot(shap_values, transformed_df, show=False, max_display=15)
    plt.tight_layout()
    plt.savefig(beeswarm_path, dpi=160)
    plt.close()

    return bar_path, beeswarm_path
