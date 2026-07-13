"""Carga e limpeza do dataset de RH."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from analysis.hr_analytics import CONSTANT_COLUMNS


def load_dataset(csv_path: str | Path) -> pd.DataFrame:
    """Carrega o CSV de RH em um DataFrame."""
    df = pd.read_csv(csv_path)
    return df


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Remove colunas constantes/sem informação preditiva."""
    to_drop = [col for col in CONSTANT_COLUMNS if col in df.columns]
    return df.drop(columns=to_drop)
