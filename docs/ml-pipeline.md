# Pipeline de Machine Learning

## Definição do problema

- **Tarefa:** classificação binária supervisionada.
- **Alvo:** `Attrition` (Yes = 1, No = 0).
- **Saída principal do modelo:** `attritionProbability` (0–1).
- **Derivadas exibidas na UI:**
  - `riskScore = round(probability × 100)`
  - `riskLevel ∈ {LOW, MEDIUM, HIGH, CRITICAL}` a partir de thresholds em `RiskConfig`.
- **Escopo de scoring:** o modelo é treinado com **todos** os registros (para aprender com ambas as classes), mas o produto exibe risco **apenas para ativos** (`isActive = true`).

## Estrutura do pacote

```
analysis/hr_analytics/
├── __init__.py          # RANDOM_STATE, MODEL_VERSION, CONSTANT_COLUMNS
├── loading.py           # load_dataset + clean_dataset
├── features.py          # split_features_target, build_preprocessor
├── train.py             # build_models + select_best_model
├── evaluate.py          # choose_threshold + evaluate
└── score.py             # explicações SHAP + top_risk_factors (fatores locais)
```

Scripts CLI em `analysis/scripts/`:

- `generate_predictions.py` — pipeline completo (treino → avaliação → scoring → artefatos)
- `train_model.py` — alias do anterior

## Etapas do pipeline

### 1. Carga e limpeza (`loading.py`)

```python
raw = load_dataset(DATA_CSV)
df = clean_dataset(raw)   # remove EmployeeCount, Over18, StandardHours
```

- Colunas constantes são removidas — não contribuem para o modelo.
- `EmployeeNumber` **não é feature**, apenas identificador.

### 2. Split target/features (`features.py`)

```python
y = (df["Attrition"] == "Yes").astype(int)
X = df.drop(columns=["Attrition", "EmployeeNumber"])
```

### 3. Pré-processamento (`features.py`)

Um único `ColumnTransformer` encapsula:

| Tipo         | Transformação                                       |
| ------------ | --------------------------------------------------- |
| Numéricas    | `StandardScaler()`                                  |
| Categóricas  | `OneHotEncoder(handle_unknown="ignore")`            |

Categóricas: `BusinessTravel`, `Department`, `EducationField`, `Gender`, `JobRole`, `MaritalStatus`, `OverTime`.

O `ColumnTransformer` vive dentro do `Pipeline` do sklearn — assim o `fit` só vê o treino e evita **data leakage**.

### 4. Split treino/teste

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
```

- **Estratificado** preserva a proporção ~16% de saídas.
- `random_state=42` garante reprodutibilidade.

### 5. Seleção de modelo (`train.py`)

Comparação via **StratifiedKFold(5)** otimizando **ROC-AUC**:

| Modelo                | Estratégia p/ desbalanceamento    |
| --------------------- | --------------------------------- |
| `LogisticRegression`  | `class_weight='balanced'`         |
| `GradientBoostingClassifier` | (implícito por otimização) |

O melhor por CV é ajustado no conjunto de treino inteiro (`fit`) e vira o modelo final.

### 6. Avaliação (`evaluate.py`)

Métricas obrigatórias para problema **desbalanceado**:

- **ROC-AUC** — principal, mede ranqueamento.
- **PR-AUC** — average precision, mais informativa que accuracy.
- **Precision / Recall / F1** para a classe positiva (saída).
- **Matriz de confusão**.

Threshold: `choose_threshold` varre valores de 0.1 a 0.9 e escolhe o que **maximiza F1** no holdout.

### 7. Explicabilidade local (`score.py`)

As explicações são calculadas com **SHAP nativo** sobre o pipeline final treinado:

- `shap.LinearExplainer` quando o modelo selecionado é `LogisticRegression`
- `shap.TreeExplainer` quando o modelo selecionado é `GradientBoostingClassifier`

Para cada profissional, extraímos os SHAP values de maior magnitude e geramos `topRiskFactors` em formato:

```json
[{"feature": "Faz horas extras", "impact": 0.2314, "direction": "aumenta"}]
```

Rótulos exibidos são amigáveis (pt-BR), definidos em `FEATURE_LABELS`.

### 8. Artefatos

- `analysis/models/model_v1.joblib` — pipeline completo (`joblib.dump`).
- `analysis/models/metrics_v1.json` — métricas + metadados (`modelVersion`, `algorithm`, `trainedAt`, `threshold`, ...).
- `data/predictions.csv` — colunas `EmployeeNumber`, `attritionProbability`, `predictedAttrition`, `modelVersion`, `topRiskFactors` (JSON).
- `analysis/reports/shap_summary_bar_v1.png` — importância global média (bar plot).
- `analysis/reports/shap_beeswarm_v1.png` — distribuição de impacto por feature (beeswarm).

## Prevenção de data leakage

- **Fit apenas no treino**: nada de calcular escala/categorias no dataset inteiro antes do split.
- **`EmployeeNumber` nunca é feature.**
- Não há features derivadas do próprio desligamento (o dataset é sintético e não contém colunas pós-fato).

## Reprodutibilidade

- `random_state=42` fixado em split e modelos.
- Métricas versionadas em JSON.
- `predictions.csv` e `metrics_v1.json` são versionáveis no Git (o `.joblib` fica fora — ver `.gitignore`).

## Como re-treinar

```bash
python -m analysis.scripts.generate_predictions
npx prisma db seed
```

O `ModelRun` atualiza no banco automaticamente e o dashboard passa a refletir o novo modelo.
