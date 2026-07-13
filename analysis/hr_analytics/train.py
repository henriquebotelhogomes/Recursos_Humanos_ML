"""Treino e seleção de modelos de classificação de attrition."""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline

from analysis.hr_analytics import RANDOM_STATE
from analysis.hr_analytics.features import build_preprocessor


def build_models(x: pd.DataFrame) -> dict[str, Pipeline]:
    """Cria pipelines (pré-processamento + modelo) para cada algoritmo."""
    pre = build_preprocessor(x)
    return {
        "LogisticRegression": Pipeline(
            [
                ("pre", pre),
                (
                    "clf",
                    LogisticRegression(
                        max_iter=1000,
                        class_weight="balanced",
                        random_state=RANDOM_STATE,
                    ),
                ),
            ]
        ),
        "GradientBoosting": Pipeline(
            [
                ("pre", build_preprocessor(x)),
                (
                    "clf",
                    GradientBoostingClassifier(random_state=RANDOM_STATE),
                ),
            ]
        ),
    }


def select_best_model(
    x_train: pd.DataFrame, y_train: pd.Series
) -> tuple[str, Pipeline, dict[str, float]]:
    """Seleciona o melhor pipeline por ROC-AUC em validação cruzada estratificada."""
    models = build_models(x_train)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores: dict[str, float] = {}
    for name, pipe in models.items():
        scores = cross_val_score(pipe, x_train, y_train, cv=cv, scoring="roc_auc")
        cv_scores[name] = float(np.mean(scores))

    best_name = max(cv_scores, key=lambda k: cv_scores[k])
    best_pipe = models[best_name]
    best_pipe.fit(x_train, y_train)
    return best_name, best_pipe, cv_scores
