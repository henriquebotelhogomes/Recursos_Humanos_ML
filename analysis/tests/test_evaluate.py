from __future__ import annotations

import numpy as np

from analysis.hr_analytics.evaluate import choose_threshold, evaluate


def test_choose_threshold_returns_expected_range() -> None:
    y_true = np.array([0, 0, 0, 1, 1, 1])
    y_proba = np.array([0.1, 0.2, 0.4, 0.6, 0.8, 0.9])

    thr = choose_threshold(y_true, y_proba)

    assert 0.1 <= thr <= 0.9


def test_evaluate_returns_metrics_and_confusion_matrix() -> None:
    y_true = np.array([0, 0, 1, 1])
    y_proba = np.array([0.1, 0.7, 0.8, 0.2])

    result = evaluate(y_true, y_proba, threshold=0.5)

    assert 0.0 <= result.roc_auc <= 1.0
    assert 0.0 <= result.pr_auc <= 1.0
    assert 0.0 <= result.precision <= 1.0
    assert 0.0 <= result.recall <= 1.0
    assert 0.0 <= result.f1 <= 1.0
    assert result.confusion == [[1, 1], [1, 1]]
