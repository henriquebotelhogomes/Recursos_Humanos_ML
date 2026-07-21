from __future__ import annotations

import pandas as pd

from analysis.hr_analytics.loading import clean_dataset


def test_clean_dataset_removes_only_constant_columns() -> None:
    df = pd.DataFrame(
        {
            "EmployeeCount": [1, 1],
            "Over18": ["Y", "Y"],
            "StandardHours": [80, 80],
            "Age": [30, 40],
        }
    )

    cleaned = clean_dataset(df)

    assert "EmployeeCount" not in cleaned.columns
    assert "Over18" not in cleaned.columns
    assert "StandardHours" not in cleaned.columns
    assert list(cleaned.columns) == ["Age"]
