"""Pré-processamento de features (ColumnTransformer/Pipeline)."""

from __future__ import annotations

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from analysis.hr_analytics import CATEGORICAL_FEATURES, ID_COLUMN, TARGET_COLUMN


def split_features_target(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Separa X (features) e y (target binário 0/1)."""
    y = (df[TARGET_COLUMN] == "Yes").astype(int)
    x = df.drop(columns=[TARGET_COLUMN, ID_COLUMN], errors="ignore")
    return x, y


def get_feature_lists(x: pd.DataFrame) -> tuple[list[str], list[str]]:
    """Retorna (numéricas, categóricas) presentes em X."""
    categorical = [c for c in CATEGORICAL_FEATURES if c in x.columns]
    numeric = [c for c in x.columns if c not in categorical]
    return numeric, categorical


def build_preprocessor(x: pd.DataFrame) -> ColumnTransformer:
    """Cria o ColumnTransformer com One-Hot para categóricas e scaler para numéricas."""
    numeric, categorical = get_feature_lists(x)
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
        ]
    )
