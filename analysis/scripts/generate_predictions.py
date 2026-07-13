"""Pipeline completo: treina, avalia, explica e gera predições.

Uso:
    python -m analysis.scripts.generate_predictions

Gera:
    - data/predictions.csv                (consumido pelo seed do Prisma)
    - analysis/models/model_v1.joblib     (pipeline treinado)
    - analysis/models/metrics_v1.json     (métricas + metadados do treino)
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split

from analysis.hr_analytics import MODEL_VERSION, RANDOM_STATE
from analysis.hr_analytics.evaluate import choose_threshold, evaluate
from analysis.hr_analytics.features import split_features_target
from analysis.hr_analytics.loading import clean_dataset, load_dataset
from analysis.hr_analytics.score import build_explainer, top_risk_factors
from analysis.hr_analytics.train import select_best_model

ROOT = Path(__file__).resolve().parents[2]
DATA_CSV = ROOT / "data" / "Human_Resources.csv"
PREDICTIONS_CSV = ROOT / "data" / "predictions.csv"
MODELS_DIR = ROOT / "analysis" / "models"


def main() -> None:
    print(">> Carregando dataset:", DATA_CSV)
    raw = load_dataset(DATA_CSV)
    df = clean_dataset(raw)
    x, y = split_features_target(df)

    print(">> Split treino/teste estratificado (80/20)")
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE
    )

    print(">> Treinando e selecionando o melhor modelo (ROC-AUC / CV)...")
    best_name, best_pipe, cv_scores = select_best_model(x_train, y_train)
    print("   CV ROC-AUC:", {k: round(v, 4) for k, v in cv_scores.items()})
    print("   Modelo selecionado:", best_name)

    print(">> Avaliando no holdout...")
    proba_test = best_pipe.predict_proba(x_test)[:, 1]
    threshold = choose_threshold(y_test.to_numpy(), proba_test)
    result = evaluate(y_test.to_numpy(), proba_test, threshold)
    print(
        "   ROC-AUC={:.4f} PR-AUC={:.4f} P={:.3f} R={:.3f} F1={:.3f} thr={:.2f}".format(
            result.roc_auc, result.pr_auc, result.precision, result.recall, result.f1, threshold
        )
    )

    print(">> Ajustando explicador (fatores locais) em toda a base...")
    explainer, feature_names = build_explainer(x, y)
    factors = top_risk_factors(explainer, feature_names, x)

    print(">> Gerando predições para todos os profissionais...")
    proba_all = best_pipe.predict_proba(x)[:, 1]
    predictions = pd.DataFrame(
        {
            "EmployeeNumber": df["EmployeeNumber"].to_numpy(),
            "attritionProbability": proba_all.round(6),
            "predictedAttrition": (proba_all >= threshold).astype(int),
            "modelVersion": MODEL_VERSION,
            "topRiskFactors": [json.dumps(f, ensure_ascii=False) for f in factors],
        }
    )
    PREDICTIONS_CSV.parent.mkdir(parents=True, exist_ok=True)
    predictions.to_csv(PREDICTIONS_CSV, index=False)
    print("   Predições salvas em:", PREDICTIONS_CSV)

    print(">> Salvando artefatos do modelo...")
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipe, MODELS_DIR / f"model_{MODEL_VERSION}.joblib")

    metrics = {
        "modelVersion": MODEL_VERSION,
        "algorithm": best_name,
        "cvRocAuc": cv_scores,
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "threshold": threshold,
        **result.to_dict(),
    }
    (MODELS_DIR / f"metrics_{MODEL_VERSION}.json").write_text(
        json.dumps(metrics, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print("   Métricas salvas em:", MODELS_DIR / f"metrics_{MODEL_VERSION}.json")
    print(">> Concluído.")


if __name__ == "__main__":
    main()
