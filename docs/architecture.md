# Arquitetura

## Visão geral

O sistema é dividido em **duas camadas separadas**, comunicando-se por arquivo (batch scoring):

```
┌──────────────────────────┐              ┌────────────────────────────┐
│ Camada de ML (Python)    │──gera──▶     │ App Web (Next.js)          │
│  analysis/hr_analytics   │              │ prisma/seed.ts             │
│  scikit-learn            │              │ ↓                          │
│  train → evaluate → SHAP │              │ SQLite (Prisma)            │
│                          │              │ ↓                          │
│  data/predictions.csv    │              │ App Router / API           │
│  models/model_v1.joblib  │              │ ↓                          │
│  models/metrics_v1.json  │              │ Dashboard / Employees /    │
└──────────────────────────┘              │ Insights / Dataset         │
                                          └────────────────────────────┘
```

### Por que batch?

- **Independência de runtime**: o app roda sem depender de Python em produção.
- **Reprodutibilidade**: o snapshot de predições é versionável (`predictions.csv`).
- **Simplicidade**: sem serviço de inferência para operar.

Se você precisar de inferência online no futuro, basta adicionar um microserviço FastAPI que carrega o `.joblib` e responde `/predict`.

## Camadas do app

```
src/
├── app/                     # Rotas (App Router)
│   ├── (marketing)/         # Landing pública
│   ├── (auth)/              # login e register
│   ├── (dashboard)/         # área autenticada
│   └── api/                 # Route Handlers
├── components/              # UI, layout, charts, settings
├── config/                  # site.ts, constants
├── lib/                     # regras puras (isoladas do framework)
│   ├── prisma.ts            # cliente Prisma singleton
│   ├── auth/                # opções NextAuth + helpers de sessão
│   ├── risk/                # probability→score, score→level, recomendações
│   ├── validations/         # schemas Zod
│   └── utils.ts             # formatCurrency, formatDate, cn
├── server/services/         # regras de negócio (agregações, model)
└── middleware.ts            # proteção de rotas autenticadas
```

### Princípios

1. **Componentes visuais são puros** — recebem dados via props.
2. **Regras de negócio ficam em `lib/` e `server/services/`** — nunca dentro de páginas.
3. **API Routes são a única ponte** entre client e banco.
4. **`src/lib/risk`** contém somente a **derivação** de risco (probabilidade → score → nível); o treino é exclusivo do Python.

## Route groups

- `(marketing)` — landing pública
- `(auth)` — telas de autenticação
- `(dashboard)` — área autenticada (com layout de sidebar/topbar)

## Modelos de dados

| Modelo        | Descrição                                                         |
| ------------- | ----------------------------------------------------------------- |
| `User`        | Contas de acesso (bcrypt).                                        |
| `Employee`    | Profissional + campos de risco (`riskScore`, `riskLevel`, etc.).  |
| `RiskConfig`  | Thresholds (LOW/MEDIUM/HIGH/CRITICAL) + `activeModelVersion`.     |
| `ModelRun`    | Registro de um treino do modelo (métricas + metadados).           |

## Segurança e sessão

- Autenticação por **NextAuth** com estratégia de **Credentials** e senhas em **bcrypt**.
- Sessão JWT persistente (30 dias por padrão).
- Middleware protege as rotas `/dashboard`, `/employees`, `/insights`, `/dataset`, `/settings`.
- Rotas de API autenticadas retornam **401** sem sessão.

## Design system

- Tokens em `tailwind.config.ts` + CSS variables em `globals.css`.
- Paleta de risco padronizada: verde (LOW), âmbar (MEDIUM), laranja (HIGH), vermelho (CRITICAL).
- **Tema claro/escuro** com alternância persistida (localStorage) e respeito ao `prefers-color-scheme`.
- Layout responsivo mobile-first; sidebar vira drawer no mobile.
