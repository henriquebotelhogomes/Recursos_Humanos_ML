from __future__ import annotations

import pandas as pd

from analysis.hr_analytics.features import (
    build_preprocessor,
    get_feature_lists,
    split_features_target,
)


def _sample_df() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "EmployeeNumber": [1, 2],
            "Attrition": ["Yes", "No"],
            "Age": [25, 40],
            "MonthlyIncome": [2000, 6000],
            "Department": ["Sales", "Research & Development"],
            "OverTime": ["Yes", "No"],
        }
    )


def test_split_features_target() -> None:
    x, y = split_features_target(_sample_df())

    assert "Attrition" not in x.columns
    assert "EmployeeNumber" not in x.columns
    assert y.tolist() == [1, 0]


def test_get_feature_lists() -> None:
    x, _ = split_features_target(_sample_df())
    numeric, categorical = get_feature_lists(x)

    assert "Age" in numeric
    assert "MonthlyIncome" in numeric
    assert "Department" in categorical
    assert "OverTime" in categorical


def test_build_preprocessor_has_expected_transformers() -> None:
    x, _ = split_features_target(_sample_df())
    pre = build_preprocessor(x)

    transformed = pre.fit_transform(x)
    assert transformed is not None
    assert len(pre.transformers_) == 2
