"""Avaliação do modelo: métricas para problema desbalanceado."""

from __future__ import annotations

from dataclasses import asdict, dataclass

import numpy as np
from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


@dataclass
class EvaluationResult:
    roc_auc: float
    pr_auc: float
    precision: float
    recall: float
    f1: float
    accuracy: float
    threshold: float
    confusion: list[list[int]]

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


def choose_threshold(y_true: np.ndarray, y_proba: np.ndarray) -> float:
    """Escolhe o threshold que maximiza o F1 (bom para classes desbalanceadas)."""
    candidates = np.linspace(0.1, 0.9, 81)
    best_thr = 0.5
    best_f1 = -1.0
    for thr in candidates:
        preds = (y_proba >= thr).astype(int)
        score = f1_score(y_true, preds, zero_division=0)
        if score > best_f1:
            best_f1 = score
            best_thr = float(thr)
    return best_thr


def evaluate(y_true: np.ndarray, y_proba: np.ndarray, threshold: float) -> EvaluationResult:
    preds = (y_proba >= threshold).astype(int)
    cm = confusion_matrix(y_true, preds)
    accuracy = float((preds == y_true).mean())
    return EvaluationResult(
        roc_auc=float(roc_auc_score(y_true, y_proba)),
        pr_auc=float(average_precision_score(y_true, y_proba)),
        precision=float(precision_score(y_true, preds, zero_division=0)),
        recall=float(recall_score(y_true, preds, zero_division=0)),
        f1=float(f1_score(y_true, preds, zero_division=0)),
        accuracy=accuracy,
        threshold=float(threshold),
        confusion=cm.tolist(),
    )
