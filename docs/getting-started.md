# Como começar

Guia rápido para rodar o PeopleRisk localmente.

## Pré-requisitos

- **Node.js 20+** e **npm**
- **Python 3.11+**
- Pacotes Python: `pandas`, `numpy`, `scikit-learn`, `joblib`

## Instalação

```bash
git clone <URL_DO_REPO> Recursos_Humanos
cd Recursos_Humanos
```

## Passo 1 — Gerar predições (Python)

O app **não treina o modelo**. Antes de subir o Next.js, rode a camada de ML para gerar `data/predictions.csv` e os artefatos do modelo:

```bash
python -m analysis.scripts.generate_predictions
```

Saídas:

- `data/predictions.csv` — consumido pelo seed do Prisma
- `analysis/models/model_v1.joblib` — pipeline treinado
- `analysis/models/metrics_v1.json` — métricas + metadados

!!! tip "O app funciona sem predições"
    Se você pular o passo 1, o seed carrega os dados mesmo assim (campos de risco ficam `null`) e o dashboard exibe um aviso pedindo para rodar o ML. Isso é útil para testar a UI rapidamente.

## Passo 2 — Preparar o banco (Prisma)

```bash
npm install
npx prisma migrate dev
```

O `migrate dev` cria o SQLite (`prisma/dev.db`) e **executa o seed automaticamente** (via `prisma.seed` no `package.json`):

- Cria o usuário demo (`demo123` / `demo123`).
- Carrega os 1.470 profissionais do CSV.
- Cruza com `predictions.csv` e persiste risco e fatores.
- Registra a `ModelRun` (métricas do modelo) e a `RiskConfig` (thresholds).

Para rodar o seed manualmente depois:

```bash
npx prisma db seed
```

## Passo 3 — Subir o app

```bash
npm run dev
```

Acesse <http://localhost:3000>.

## Acesso demo

- Email: `demo123`
- Senha: `demo123`

Na tela de login há o botão **Preencher automaticamente**.

## Variáveis de ambiente

Crie o `.env` (já incluso no projeto para desenvolvimento):

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="troque-este-secret-em-producao"
NEXTAUTH_URL="http://localhost:3000"
```

## Comandos úteis

| Comando                                             | O que faz                                           |
| --------------------------------------------------- | --------------------------------------------------- |
| `npm run dev`                                       | Sobe o app em desenvolvimento                       |
| `npm run build && npm start`                        | Build de produção                                   |
| `npx prisma db seed`                                | Re-carrega o banco                                  |
| `npx prisma studio`                                 | GUI para inspecionar o SQLite                       |
| `python -m analysis.scripts.generate_predictions`   | Re-treina o modelo e regenera predições             |
| `mkdocs serve`                                      | Serve esta documentação em <http://127.0.0.1:8765>  |
| `mkdocs build`                                      | Gera o site estático em `site/`                     |
