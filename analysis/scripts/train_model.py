"""Alias de treino do modelo.

Uso:
    python -m analysis.scripts.train_model

Atualmente o treino e a geração de predições são feitos em um único fluxo
reprodutível em generate_predictions.py.
"""

from __future__ import annotations

from analysis.scripts.generate_predictions import main

if __name__ == "__main__":
    main()
