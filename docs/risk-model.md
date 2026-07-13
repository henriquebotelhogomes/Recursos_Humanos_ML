# Model Card — Risk of Attrition v1

Documento de referência do modelo, seguindo a estrutura de *model cards* para ML responsável.

## Identificação

| Campo              | Valor                                       |
| ------------------ | ------------------------------------------- |
| Nome               | `people-risk`                               |
| Versão             | `v1`                                        |
| Algoritmo          | Regressão Logística (`class_weight='balanced'`) |
| Framework          | scikit-learn 1.x                            |
| Data do treino     | Ver `analysis/models/metrics_v1.json`       |
| Random state       | 42                                          |

## Uso pretendido

- **Cenário**: apoio à decisão de RH sobre retenção de talentos.
- **Usuários**: analistas de RH, gestores de time, diretoria.
- **Decisões suportadas**: priorização de conversas de retenção; leitura de padrões de risco.

**Fora de escopo**: não usar isoladamente para decisões de desligamento; não usar em contextos em que decisões sensíveis (remuneração, contratação) sejam automatizadas.

## Dados

- **Fonte**: IBM HR Analytics Employee Attrition & Performance (público, sintético).
- **Volume**: 1.470 registros.
- **Distribuição do alvo**: 237 saídas (16,12%) / 1.233 permaneceram (83,88%) — **desbalanceado**.

### Colunas removidas (sem valor preditivo)

- `EmployeeCount` — valor único.
- `Over18` — valor único (`Y`).
- `StandardHours` — valor único (`80`).

### Identificador (não é feature)

- `EmployeeNumber` — usado apenas para juntar predições ao registro.

### Features utilizadas

**Numéricas** (padronização com `StandardScaler`):
`Age`, `DailyRate`, `DistanceFromHome`, `Education`, `EnvironmentSatisfaction`, `HourlyRate`, `JobInvolvement`, `JobLevel`, `JobSatisfaction`, `MonthlyIncome`, `MonthlyRate`, `NumCompaniesWorked`, `PercentSalaryHike`, `PerformanceRating`, `RelationshipSatisfaction`, `StockOptionLevel`, `TotalWorkingYears`, `TrainingTimesLastYear`, `WorkLifeBalance`, `YearsAtCompany`, `YearsInCurrentRole`, `YearsSinceLastPromotion`, `YearsWithCurrManager`.

**Categóricas** (One-Hot Encoding):
`BusinessTravel`, `Department`, `EducationField`, `Gender`, `JobRole`, `MaritalStatus`, `OverTime`.

## Métricas (holdout 20%)

| Métrica       | Valor  |
| ------------- | ------ |
| ROC-AUC       | 0.803  |
| PR-AUC (AP)   | 0.561  |
| Precision     | 0.431  |
| Recall        | 0.596  |
| F1            | 0.500  |
| Accuracy      | 0.810  |
| Threshold     | 0.58   |

**CV (StratifiedKFold=5), ROC-AUC:**

- LogisticRegression: **0.827**
- GradientBoosting: 0.813

Selecionado: **LogisticRegression** por melhor CV e interpretabilidade.

### Análise do threshold

Threshold de 0.58 escolhido por maximizar F1 no holdout. Isso prioriza **recall razoável** (0.596) sem sacrificar precisão excessivamente. Para o contexto de negócio, é aceitável alertar demais e conversar do que perder um talento silenciosamente.

## Explicabilidade

- **Global**: coeficientes da regressão sinalizam quais features mais empurram a probabilidade de saída para cima ou para baixo (ex.: `OverTime=Yes`, `MaritalStatus=Single`).
- **Local**: por profissional, a contribuição = `valor_transformado × coeficiente`. Os fatores positivos de maior magnitude formam o `topRiskFactors` exibido na tela de detalhe.

## Limitações

- **Dataset sintético e estático**: as predições são demonstrativas; não refletem o comportamento de uma empresa real.
- **Correlação ≠ causalidade**: as features apenas se correlacionam com attrition; não causam saída.
- **Modelo linear**: capta relações lineares e efeitos aditivos; não modela interações complexas (poderia ser substituído por gradient boosting em bases maiores).
- **Threshold único**: um único ponto de corte para toda a empresa; poderia variar por departamento em cenário real.

## Análise de viés (o que verificar)

Recomenda-se avaliar disparidades de:

- **Gênero** (`Gender`): a taxa de "predito como risco" diverge entre grupos?
- **Estado civil** (`MaritalStatus`).
- **Departamento**.

Métricas típicas: **Statistical Parity**, **Equal Opportunity**, **Disparate Impact**. A base IBM HR não é adequada para conclusões éticas reais (é sintética), mas o exercício é obrigatório em ambiente produtivo.

## Uso responsável

- Ferramenta de **apoio à decisão**, nunca automação.
- Combinar com contexto humano: conversas 1:1, feedback do gestor, contexto de mercado.
- Registrar decisões relevantes e revisitar periodicamente as métricas do modelo.
- Respeitar princípios de **LGPD**: minimização, finalidade, transparência.

## Governança

- Cada treino cria um `ModelRun` no banco com métricas + `trainedAt`.
- `RiskConfig.activeModelVersion` aponta a versão ativa.
- Thresholds ajustáveis em `/settings` **sem re-treinar**.

## Reprodutibilidade

Com o mesmo `random_state=42`, mesma versão de scikit-learn e mesmo dataset, os artefatos são bit a bit reproduzíveis. Métricas são versionadas em `analysis/models/metrics_v1.json`.
