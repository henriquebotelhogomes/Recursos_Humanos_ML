from __future__ import annotations

import pandas as pd
import pytest

from analysis.hr_analytics.features import split_features_target
from analysis.hr_analytics import score
from analysis.hr_analytics.train import build_models


pytestmark = pytest.mark.skipif(
    score.shap is None,
    reason=f"SHAP indisponível no ambiente: {score.SHAP_IMPORT_ERROR}",
)


def _sample_df() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "EmployeeNumber": [1, 2, 3, 4, 5, 6],
            "Attrition": ["Yes", "No", "Yes", "No", "No", "Yes"],
            "Age": [25, 40, 31, 45, 29, 38],
            "MonthlyIncome": [2000, 6000, 3500, 7000, 2800, 5000],
            "Department": [
                "Sales",
                "Research & Development",
                "Sales",
                "Human Resources",
                "Research & Development",
                "Sales",
            ],
            "OverTime": ["Yes", "No", "Yes", "No", "No", "Yes"],
            "JobRole": [
                "Sales Executive",
                "Research Scientist",
                "Sales Representative",
                "Manager",
                "Laboratory Technician",
                "Sales Executive",
            ],
        }
    )


def test_explain_with_shap_logistic_returns_expected_shapes() -> None:
    x, y = split_features_target(_sample_df())
    model = build_models(x)["LogisticRegression"]
    model.fit(x, y)

    shap_values, feature_names, transformed_df = score.explain_with_shap(model, x)

    assert shap_values.shape[0] == len(x)
    assert shap_values.shape[1] == len(feature_names)
    assert transformed_df.shape == shap_values.shape


def test_explain_with_shap_gradient_boosting_returns_expected_shapes() -> None:
    x, y = split_features_target(_sample_df())
    model = build_models(x)["GradientBoosting"]
    model.fit(x, y)

    shap_values, feature_names, transformed_df = score.explain_with_shap(model, x)

    assert shap_values.shape[0] == len(x)
    assert shap_values.shape[1] == len(feature_names)
    assert transformed_df.shape == shap_values.shape


def test_top_risk_factors_from_shap_has_expected_schema() -> None:
    x, y = split_features_target(_sample_df())
    model = build_models(x)["LogisticRegression"]
    model.fit(x, y)

    shap_values, feature_names, _ = score.explain_with_shap(model, x)
    factors = score.top_risk_factors_from_shap(shap_values, feature_names, top_n=3)

    assert len(factors) == len(x)
    first = factors[0]
    assert len(first) <= 3
    if first:
        assert "feature" in first[0]
        assert "impact" in first[0]
        assert first[0]["direction"] in {"aumenta", "reduz"}
