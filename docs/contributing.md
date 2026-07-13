# Contribuindo

Este é um projeto de portfólio, mas segue padrões de projeto profissional.

## Padrões de código

### TypeScript

- **Strict mode** habilitado no `tsconfig.json`.
- **ESLint** com `next/core-web-vitals`.
- **Prettier** para formatação (config padrão).
- Componentes visuais **puros**: recebem dados via props, não fazem consulta ao banco.
- Regras de negócio ficam em `src/lib/` e `src/server/services/`.

Comandos:

```bash
npm run lint          # ESLint
npx tsc --noEmit      # type-check
```

### Python

- **Ruff** para lint e format (regras `E, F, I, N, UP, B, SIM`, `line-length = 100`).
- **Pyright** com `typeCheckingMode = "strict"` — todas as funções públicas com type hints.
- Estruturar novo código dentro de `analysis/hr_analytics/` (módulos pequenos e testáveis).

Comandos:

```bash
ruff check .
ruff format .
pyright
```

## Testes

### Vitest (TypeScript)

Alvo mínimo de cobertura em:

- `src/lib/risk/` — `probabilityToScore`, `scoreToLevel`, `buildRecommendations`.
- `src/lib/validations/` — schemas Zod.
- `src/server/services/metrics.ts` — agregações.

Rodar:

```bash
npm run test
npm run test:cov
```

### pytest (Python)

Sugestões de módulos de teste:

- `test_loading.py` — carga e limpeza determinística.
- `test_features.py` — split X/y e preprocessor.
- `test_train.py` — smoke test do treino com `random_state` fixo.
- `test_evaluate.py` — métricas em cenário controlado.
- `test_score.py` — top-N fatores.

Rodar:

```bash
pytest
```

## Convenções de commit

Recomenda-se **Conventional Commits**:

```
feat: adiciona painel de desempenho do modelo no dashboard
fix: corrige data leakage no pré-processamento
docs: atualiza model card com nova versão
refactor: extrai lógica de risco para src/lib/risk
test: adiciona testes de scoreToLevel
```

## Fluxo sugerido

1. Criar branch a partir de `main`: `git checkout -b feat/nova-tela`.
2. Rodar lint + testes localmente antes de commitar.
3. Atualizar a documentação (`docs/`) se a mudança afeta arquitetura, modelo, dados ou API.
4. Abrir Pull Request com descrição clara e checklist.

## Governança do modelo

Ao re-treinar o modelo:

1. Incrementar `MODEL_VERSION` em `analysis/hr_analytics/__init__.py` (ex.: `v2`).
2. Rodar `python -m analysis.scripts.generate_predictions`.
3. Rodar `npx prisma db seed` para atualizar `ModelRun` e `RiskConfig.activeModelVersion`.
4. Atualizar `docs/risk-model.md` com as novas métricas e decisões.
5. Commit incluindo `metrics_v2.json` (o `.joblib` fica fora do Git).

## Roadmap

- [ ] CI/CD com GitHub Actions (lint + testes + build).
- [ ] Cobertura de testes em Vitest e pytest.
- [ ] Substituir explicador linear por SHAP (`shap.LinearExplainer` ou `TreeExplainer`).
- [ ] Análise de viés e fairness com Fairlearn.
- [ ] Serviço de inferência online (FastAPI).
