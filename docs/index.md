# PeopleRisk

**Plataforma de People Analytics com Machine Learning para prever attrition e priorizar retenção de talentos.**

Este site documenta a arquitetura, o pipeline de ML, o fluxo de dados e as APIs do projeto.

## O problema

Rotatividade gera custos altos: recrutamento, treinamento, perda de conhecimento e queda de produtividade. Normalmente, a empresa só descobre uma saída **depois** que o profissional já pediu demissão — tarde demais para reter.

## A solução

Um sistema que:

1. **Aprende com o histórico** de attrition via aprendizado supervisionado.
2. **Prediz a probabilidade** de saída de cada profissional ativo.
3. **Explica** os fatores que puxam o risco de cada pessoa.
4. **Prioriza** ações de retenção com um dashboard executivo.

## Público-alvo (personas)

- **Analista de RH / People Analytics** — explora padrões e monitora indicadores.
- **Gestor / Líder de time** — consulta o risco do time e age.
- **Diretoria** — visão executiva de rotatividade e risco.

O produto **não usa papéis/permissões**; qualquer usuário autenticado tem acesso completo, para simplificar a demonstração.

## Escopo do MVP

- Autenticação por email/senha com cadastro, auto-login e usuário demo.
- Carga do dataset via seed (sem upload manual).
- Pipeline de ML em Python (treino, avaliação, explicabilidade) gerando predições.
- Dashboard, insights, lista de profissionais, detalhe individual, dataset completo, configurações.
- Tema claro/escuro, responsividade, documentação MkDocs.

## Fora do escopo (por enquanto)

- Multi-tenant, papéis, RBAC.
- Upload manual de arquivos.
- Serviço de inferência online.
- Dados reais/produção — a base é **sintética e estática** (IBM HR Analytics).

## Métricas do modelo v1

| Métrica       | Valor  |
| ------------- | ------ |
| Algoritmo     | Regressão Logística (`class_weight='balanced'`) |
| CV ROC-AUC    | 0.827 |
| Holdout ROC-AUC | 0.803 |
| Holdout PR-AUC | 0.561 |
| Recall (saída) | 0.596 |
| Threshold F1-ótimo | 0.58 |

Detalhes em [Model card](risk-model.md) e [Pipeline de ML](ml-pipeline.md).

## Uso responsável

O PeopleRisk é uma **ferramenta de apoio à decisão**. Não deve ser usado de forma isolada para decisões de desligamento. Correlação não implica causalidade — o modelo indica risco, não a causa.
