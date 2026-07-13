# Fluxo de dados

## Do CSV ao dashboard

```
data/Human_Resources.csv ──┐
                           ├──▶ analysis/scripts/generate_predictions.py
                           │       ├──▶ analysis/models/model_v1.joblib
                           │       ├──▶ analysis/models/metrics_v1.json
                           │       └──▶ data/predictions.csv
                           │
                           └──▶ prisma/seed.ts ──▶ SQLite (dev.db)
                                                        │
                                                        ▼
                                                    Next.js APIs
                                                        │
                                                        ▼
                                                Dashboard / Employees /
                                                Insights / Dataset
```

## 1. CSV fonte

- **Arquivo**: `data/Human_Resources.csv`
- **Origem**: IBM HR Analytics (público)
- **Volume**: 1.470 linhas × 35 colunas
- **Sem upload manual**: nenhuma rota da UI aceita arquivos do usuário

## 2. Camada de ML

Comando:

```bash
python -m analysis.scripts.generate_predictions
```

Fluxo interno:

1. `load_dataset(DATA_CSV)` — lê o CSV com pandas.
2. `clean_dataset(df)` — remove colunas constantes.
3. `split_features_target(df)` — separa X (sem `EmployeeNumber` e `Attrition`) e y.
4. `train_test_split(..., stratify=y, test_size=0.2, random_state=42)`.
5. `select_best_model(x_train, y_train)` — compara modelos por ROC-AUC via CV.
6. Ajusta o melhor modelo no treino inteiro.
7. `evaluate(y_test, proba_test, threshold)` — métricas no holdout.
8. `build_explainer(X, y)` — modelo linear surrogate para explicações locais.
9. `top_risk_factors(explainer, feature_names, X)` — top-N fatores por linha.
10. Salva `predictions.csv`, `.joblib` e `metrics_v1.json`.

## 3. Seed do Prisma

Comando:

```bash
npx prisma db seed        # ou npx prisma migrate dev (roda tudo)
```

Arquivo: `prisma/seed.ts`

Passos:

1. **Usuário demo**: `upsert` com `email=demo123` e senha bcrypt.
2. **Employees**: lê `Human_Resources.csv` via PapaParse.
3. **Predictions**: se `data/predictions.csv` existir, carrega em memória (`Map<employeeNumber, Prediction>`).
4. Para cada linha:
   - `deleteMany()` inicial garante idempotência.
   - `create()` com todos os campos originais + `isActive = (Attrition !== "Yes")`.
   - Se houver predição correspondente: preenche `attritionProbability`, `predictedAttrition`, `riskScore`, `riskLevel`, `topRiskFactors`, `modelVersion`, `scoredAt`.
5. **ModelRun**: lê `analysis/models/metrics_v1.json` e cria o registro correspondente.
6. **RiskConfig**: `upsert` com thresholds padrão (35 / 60 / 80) e `activeModelVersion`.

## 4. Consumo no app

- **Todas as leituras** passam pelo Prisma.
- **KPIs de risco** consideram apenas `isActive = true`.
- **Métricas históricas** (rotatividade) usam a base completa e são rotuladas como "histórico".
- **`/dataset`** exibe a base crua com paginação server-side (`skip/take` do Prisma).
- **`/api/dataset/download`** serializa em CSV com `Content-Disposition: attachment`.

## Reclassificação sem re-treino

Ao alterar thresholds em `/settings` (`POST /api/settings`), o app:

1. Valida com Zod (`mediumRiskThreshold < highRiskThreshold < criticalRiskThreshold`).
2. `upsert` em `RiskConfig`.
3. Busca `Employee` com `riskScore` não nulo.
4. Para cada um, recalcula `riskLevel = scoreToLevel(riskScore, thresholds)` e faz `update`.

O modelo **não é re-treinado**; apenas o **corte** sobre a probabilidade muda.

## Idempotência e robustez

- **Seed idempotente**: pode rodar quantas vezes for necessário (usa `deleteMany` + `create`).
- **Robustez**: se `predictions.csv` não existir, o seed carrega o CSV mesmo assim; o dashboard mostra um aviso pedindo para rodar o pipeline de ML.
- **Predictions.csv versionado**: garante que o app funcione em CI/produção sem executar Python.
- **`.joblib` não versionado**: gerado localmente conforme necessário (ver `.gitignore`).

## Formato de `predictions.csv`

| Coluna                | Tipo    | Exemplo                                                        |
| --------------------- | ------- | -------------------------------------------------------------- |
| `EmployeeNumber`      | int     | `1`                                                            |
| `attritionProbability`| float   | `0.7423`                                                       |
| `predictedAttrition`  | int 0/1 | `1`                                                            |
| `modelVersion`        | str     | `v1`                                                           |
| `topRiskFactors`      | JSON    | `[{"feature":"Faz horas extras","impact":0.51,"direction":"aumenta"}, ...]` |

Os `topRiskFactors` são armazenados como string JSON no SQLite e parseados no client.
