# API

Referência das rotas HTTP do PeopleRisk. Todas as rotas de negócio exigem sessão autenticada (via NextAuth).

## Convenções

- Respostas de erro seguem o formato:

  ```json
  { "error": { "message": "...", "code": "..." } }
  ```

- Códigos comuns:

| Status | Quando                                     |
| ------ | ------------------------------------------ |
| 200    | Sucesso                                    |
| 201    | Recurso criado (registro)                  |
| 401    | Sem sessão                                 |
| 422    | Falha de validação (Zod)                   |
| 500    | Erro interno                               |

## Autenticação

### `GET /api/auth/session`

Retorna a sessão atual (ou `{}` se não autenticado). Provido pelo NextAuth.

### `GET /api/auth/csrf`

Retorna o token CSRF necessário para o login por credentials.

### `POST /api/auth/callback/credentials`

Fluxo de login do NextAuth (usado internamente pela tela `/login`).

Body (form-urlencoded ou JSON, com `json: true`):

- `csrfToken` (obrigatório)
- `email` (obrigatório) — aceita `demo123` para a conta demo
- `password` (obrigatório)

## Registro

### `POST /api/register`

Cria uma nova conta.

**Body (JSON):**

```json
{
  "name": "Maria Silva",
  "email": "maria@empresa.com",
  "password": "senhaForte123",
  "confirmPassword": "senhaForte123"
}
```

**Respostas:**

- `201 { "ok": true }` — usuário criado (a UI faz auto-login em seguida).
- `422 { "error": { "message": "…", "code": "VALIDATION" } }` — dados inválidos.
- `400 { "error": { "code": "EMAIL_TAKEN" } }` — email já cadastrado.

## Dataset

### `GET /api/dataset/download`

Retorna o CSV completo (todas as colunas + campos de risco).

**Headers de resposta:**

```
content-type: text/csv; charset=utf-8
content-disposition: attachment; filename="people_dataset.csv"
```

**Exige sessão** (401 se não autenticado).

## Métricas

### `GET /api/metrics`

Retorna os KPIs e agregações usados no dashboard.

**Resposta (exemplo resumido):**

```json
{
  "total": 1470,
  "totalActive": 1233,
  "attritionCount": 237,
  "attritionRate": 16.12,
  "atRiskActive": 184,
  "byDepartment": [{ "name": "Sales", "saiu": 92, "ficou": 354 }]
}
```

**Exige sessão** (401 se não autenticado).

## Profissionais

### `GET /api/employees`

Lista profissionais com filtros e paginação.

**Query params opcionais:**

- `page` (default: `1`)
- `pageSize` (default: `20`, max: `100`)
- `status`: `active` | `former` | `all` (default: `active`)
- `dept` (departamento)
- `risk`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- `q` (número do profissional)

**Resposta (exemplo resumido):**

```json
{
  "page": 1,
  "pageSize": 20,
  "total": 312,
  "totalPages": 16,
  "data": [{ "id": 10, "employeeNumber": 1001, "riskLevel": "HIGH" }]
}
```

**Exige sessão** (401 se não autenticado).

## Configurações

### `GET /api/settings`

Retorna os thresholds atuais de risco.

**Resposta (exemplo):**

```json
{
  "mediumRiskThreshold": 35,
  "highRiskThreshold": 60,
  "criticalRiskThreshold": 80
}
```

### `PUT /api/settings`

Atualiza os thresholds de risco e **reclassifica** todos os profissionais com score existente (sem re-treinar o modelo).

**Body (JSON):**

```json
{
  "mediumRiskThreshold": 35,
  "highRiskThreshold": 60,
  "criticalRiskThreshold": 80
}
```

**Validações (Zod):**

- Cada threshold: inteiro entre 1 e 100.
- Restrição: `medium < high < critical`.

**Resposta:**

```json
{ "ok": true, "updated": 1470 }
```

O campo `updated` indica quantos `Employee` tiveram `riskLevel` reclassificado.

> Compatibilidade: `POST /api/settings` também é aceito com o mesmo contrato do `PUT`.

## Rotas de página (server-rendered)

As páginas do App Router (`/dashboard`, `/employees`, `/employees/[id]`, `/insights`, `/dataset`, `/settings`) fazem as consultas diretamente no Prisma via `getServerSession`. Não são "API públicas", mas usam suporte a `searchParams` para paginação/filtragem:

| Página          | Parâmetros de query                                                 |
| --------------- | ------------------------------------------------------------------- |
| `/employees`    | `page`, `dept`, `risk`, `status` (`active`/`former`/`all`), `q`     |
| `/dataset`      | `page`, `size` (25 / 50 / 100 / 200 / 500 / 1000)                   |
