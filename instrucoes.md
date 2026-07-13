Você é um desenvolvedor Full Stack Sênior especializado em Next.js, dashboards analíticos e aplicações de People Analytics.
Seu objetivo é gerar um projeto COMPLETO, FUNCIONAL e PRONTO PARA EXECUÇÃO sem depender de implementações posteriores.
Não entregue apenas estrutura, wireframe ou exemplos. Gere um sistema real, com dados carregados do arquivo CSV e dashboard dinâmico.

====================================================================
PARTE 1 — PRD (PRODUCT REQUIREMENTS DOCUMENT)
====================================================================
Esta parte descreve o PORQUÊ e o O QUÊ do produto (visão, objetivos, personas, escopo e critérios).
A PARTE 2 (mais abaixo) descreve o COMO técnico (stack, modelos, ML, rotas, arquitetura).
Em caso de dúvida de implementação, a Parte 2 prevalece; em caso de dúvida de intenção/produto, a Parte 1 prevalece.

VISÃO DO PRODUTO
Uma plataforma de People Analytics que usa Machine Learning para prever, com antecedência, quais profissionais ativos têm maior risco de deixar a empresa, permitindo que RH e lideranças ajam preventivamente na retenção de talentos.
Este é também um PROJETO DE PORTFÓLIO: deve demonstrar competência ponta a ponta em ciência de dados/ML e engenharia de software (full stack), sendo defensável em entrevistas técnicas.

PROBLEMA E CONTEXTO DE NEGÓCIO
* A rotatividade (attrition) gera custos altos: recrutamento, treinamento, perda de conhecimento e queda de produtividade.
* Normalmente a empresa só descobre a saída quando o profissional já pediu desligamento — tarde demais para reter.
* Faltam ferramentas que transformem os dados de RH em sinais acionáveis e priorizáveis de risco.
* A base histórica (IBM HR Analytics, 1470 registros) permite treinar um modelo que aprende os padrões de quem saiu para estimar o risco de quem permanece.

OBJETIVOS (OUTCOMES)
* Antecipar risco de saída de profissionais ativos antes que o desligamento ocorra.
* Priorizar ações de retenção nos casos de maior risco e maior impacto.
* Explicar o porquê do risco (fatores) para gerar ação, não apenas um número.
* Demonstrar um pipeline de ML sério (dados, treino, avaliação, explicabilidade) integrado a um produto real.

MÉTRICAS DE SUCESSO
Do produto (demonstração/portfólio):
* Dashboard funcional que ranqueia profissionais ativos por probabilidade de saída.
* Cada caso de alto risco acompanhado dos principais fatores (SHAP) e de recomendações de retenção.
* Experiência premium, responsiva e navegável em qualquer dispositivo.
Do modelo (qualidade técnica):
* ROC-AUC como métrica principal, reportada no dashboard e no model card.
* PR-AUC, precision, recall e F1 para a classe de saída, dado o desbalanceamento.
* Threshold de decisão escolhido de forma justificada.

PÚBLICO-ALVO E PERSONAS
Embora o sistema não use papéis/permissões (qualquer usuário autenticado vê tudo), o produto é desenhado para estas personas:
* Analista de RH / People Analytics: explora dados, identifica padrões e monitora indicadores.
* Gestor / Líder de time: consulta o risco do seu time e age na retenção.
* Diretoria / RH estratégico: visão executiva de rotatividade e risco agregado.

JOBS-TO-BE-DONE
* "Quando reviso meu time, quero ver quem está em maior risco de sair, para agir antes que peçam demissão."
* "Quando um profissional aparece como risco alto, quero entender os fatores, para ter uma conversa direcionada."
* "Quando apresento à diretoria, quero indicadores claros de rotatividade e risco, para embasar decisões."
* "Quando exploro os dados, quero ver a base completa e poder exportá-la, para análises próprias."

USER STORIES E CRITÉRIOS DE ACEITAÇÃO
US1 — Acesso
* Como visitante, quero me cadastrar e entrar, para acessar o dashboard.
* Aceitação: cadastro válido cria usuário (bcrypt) e faz auto-login; login válido redireciona ao dashboard; rotas protegidas sem sessão redirecionam para /login; existe usuário demo (demo123/demo123).

US2 — Visão executiva (dashboard)
* Como usuário, quero ver KPIs e gráficos de rotatividade e risco, para entender a situação geral.
* Aceitação: KPIs e gráficos refletem o banco; indicadores de risco consideram só ativos; métricas históricas são rotuladas como tais; filtros globais funcionam.

US3 — Predição de risco (ML)
* Como usuário, quero ver a probabilidade de saída de cada profissional ativo, para priorizar retenção.
* Aceitação: cada ativo tem attritionProbability, riskScore e riskLevel derivados de um modelo treinado; a lista pode ser ordenada por risco; desligados não aparecem como "em risco".

US4 — Explicabilidade
* Como usuário, quero entender por que alguém é risco, para agir.
* Aceitação: tela de detalhe mostra os principais fatores (SHAP) do profissional e recomendações de retenção coerentes com esses fatores.

US5 — Desempenho do modelo
* Como avaliador técnico, quero ver as métricas do modelo, para confiar nas predições.
* Aceitação: painel com algoritmo, versão, ROC-AUC, PR-AUC, precision/recall/F1, matriz de confusão e importância global (SHAP).

US6 — Exploração e exportação de dados
* Como usuário, quero ver a base completa e baixá-la, para análises próprias.
* Aceitação: /dataset mostra todas as colunas com paginação (25/50/100/200/500/1000) e permite baixar o CSV completo.

US7 — Configuração de risco
* Como usuário, quero ajustar os limiares de risco, para adequar a classificação à realidade.
* Aceitação: /settings altera thresholds e reclassifica riskLevel sem re-treinar o modelo.

ESCOPO
Dentro do escopo (MVP):
* Autenticação por email/senha com cadastro e auto-login; usuário demo.
* Carga de dados via seed/scripts a partir do CSV do projeto (sem upload manual).
* Pipeline de ML em Python (treino, avaliação, SHAP) gerando predições consumidas pelo app.
* Dashboard, insights, lista de profissionais, detalhe individual, dataset completo e configurações.
* Tema claro/escuro, responsividade completa, documentação MkDocs e testes.
Fora do escopo (agora):
* Multi-tenant, papéis/permissões e RBAC.
* Upload manual de arquivos ou integração com sistemas de RH externos.
* Serviço de inferência online (o scoring é em batch).
* Dados reais/produção — a base é sintética e estática.
Futuro (planejado):
* CI/CD com GitHub Actions (quando o repositório existir).
* Possível microserviço de inferência (FastAPI) e re-treino agendado.

REQUISITOS NÃO-FUNCIONAIS
* Desempenho: telas e consultas responsivas para a base de ~1470 registros; paginação no servidor.
* Usabilidade/acessibilidade: contraste AA, navegação por teclado, estados de loading/erro/vazio.
* Responsividade: mobile-first, sem overflow horizontal nas larguras-alvo.
* Qualidade: ESLint/Prettier, tsc, Ruff, Pyright sem erros; testes passando.
* Reprodutibilidade: pipeline de ML determinístico (random_state), execução documentada.
* Privacidade: uso responsável de People Analytics; ferramenta de apoio à decisão (ver seção LGPD).
* Manutenibilidade: separação de camadas (app, lib, server) e componentização.

PREMISSAS
* A base de dados é o CSV fixo do projeto (IBM HR Analytics), sintético e estático.
* Valores monetários estão em dólar (USD).
* Interface e conteúdo em português (locale pt-BR).
* Todos os usuários autenticados têm o mesmo nível de acesso.

RISCOS E MITIGAÇÕES
* Classes desbalanceadas (~16% de saída) -> usar métricas adequadas (ROC-AUC/PR-AUC) e técnicas de balanceamento.
* Data leakage -> pré-processamento só ajustado no treino; features justificadas.
* Interpretação equivocada (correlação x causalidade) -> comunicar limitações; ferramenta de apoio, não decisão automática.
* Confundir base histórica com população ativa -> separar claramente risco (ativos) de métricas históricas.

GLOSSÁRIO
* Attrition: desligamento/rotatividade; alvo do modelo (Yes = saiu).
* attritionProbability: probabilidade prevista de saída (0 a 1).
* riskScore: attritionProbability reescalada para 0–100.
* riskLevel: faixa de risco (LOW/MEDIUM/HIGH/CRITICAL) definida por thresholds.
* isActive: indica profissional ativo (Attrition = No).
* topRiskFactors: principais fatores SHAP que explicam o risco individual.
* ModelRun: registro de um treino do modelo e suas métricas.
* Holdout: conjunto de teste separado para avaliação final.
* SHAP: método de explicabilidade que atribui contribuição de cada feature à predição.

====================================================================
PARTE 2 — ESPECIFICAÇÃO TÉCNICA DE IMPLEMENTAÇÃO
====================================================================

CONTEXTO DO PROJETO
Este projeto é uma aplicação de Recursos Humanos focada em prever e monitorar risco de desligamento de profissionais da empresa.
A base de referência está em:
* C:\Projetos\Recursos_Humanos\Human_Resources.csv
* C:\Projetos\Recursos_Humanos\analise_rh.ipynb

A variável central do problema é Attrition.
Attrition = Yes indica que o profissional saiu da empresa.
Attrition = No indica que o profissional permaneceu.

O dataset possui 1470 profissionais e 35 colunas, incluindo idade, departamento, cargo, renda, satisfação, horas extras, viagens, tempo de empresa, promoções, equilíbrio vida/trabalho e outros indicadores relevantes.

STACK OBRIGATÓRIA
* Next.js 15+
* App Router
* TypeScript
* Tailwind CSS
* Prisma ORM
* SQLite
* NextAuth/Auth.js
* bcrypt
* React Hook Form
* Zod
* Lucide Icons
* Recharts ou biblioteca equivalente para gráficos interativos
* PapaParse ou parser equivalente para importação de CSV

FERRAMENTAS DE QUALIDADE E DOCUMENTAÇÃO
* Vitest + Testing Library (testes TypeScript)
* pytest (testes Python da camada de análise)
* Ruff (lint e format Python)
* Pyright (type checking Python, modo strict)
* ESLint + Prettier (qualidade TypeScript)
* MkDocs + Material for MkDocs (documentação)

OBJETIVO DO SISTEMA
Criar uma landing page premium com dashboard executivo de People Analytics.
O dashboard deve ajudar RH, lideranças e diretoria a identificar profissionais com maior tendência de saída da empresa, visualizar padrões de rotatividade e priorizar ações de retenção.

O sistema deve responder visualmente a perguntas como:
* Qual é a taxa geral de rotatividade?
* Quais departamentos concentram maior risco?
* Quais cargos têm mais desligamentos?
* Quais profissionais parecem estar mais próximos de sair?
* Quais fatores contribuem mais para o risco?
* Como idade, renda, tempo de empresa, satisfação, horas extras e distância de casa se relacionam com attrition?

COMPORTAMENTO INICIAL
O sistema NÃO possui papéis/roles nem usuário administrador.
Qualquer usuário válido e autenticado tem acesso completo ao sistema (dashboard, insights, profissionais e configurações).

Ao acessar o sistema:
* Se o usuário NÃO estiver autenticado, exibir a tela de login.
* A tela de login deve conter a opção de cadastrar um novo usuário.
* Rotas protegidas devem redirecionar para /login quando não houver sessão.

Após autenticação:
* Redirecionar para o dashboard.
* Permitir navegação para dashboard analítico, insights, lista de profissionais, dataset completo e configurações.

AUTENTICAÇÃO
Utilizar Auth.js (NextAuth) com estratégia de credenciais.
Login por:
* Email
* Senha

Requisitos:
* Senhas criptografadas com bcrypt.
* Sessão persistente.
* Middleware de proteção das rotas autenticadas.
* Sem controle por roles: todo usuário autenticado tem os mesmos acessos.

LOGIN
Tela /login deve conter:
* Campo de email.
* Campo de senha.
* Botão de entrar.
* Link/opção para cadastrar novo usuário (/register).
Comportamento:
* Se o email e a senha forem válidos, autenticar e redirecionar para /dashboard.
* Se inválidos, exibir mensagem de erro amigável.

CADASTRO DE USUÁRIO
Tela /register deve conter:
* Nome
* Email
* Senha
* Confirmar senha
Comportamento:
* Validar dados com Zod (email válido, senha mínima, confirmação igual).
* Impedir cadastro de email já existente.
* Criar o usuário com senha criptografada via bcrypt.
* Após o cadastro, autenticar automaticamente o usuário e redirecionar para /dashboard.
* Não exigir aprovação nem etapas adicionais.

USUÁRIO DEMO
Para facilitar avaliação (portfólio/entrevista), o seed deve criar um usuário demo pré-cadastrado:
* login (email): demo123
* senha: demo123
Requisitos:
* Criar via seed, com senha criptografada em bcrypt (não armazenar em texto puro).
* A tela de login deve exibir essas credenciais de demonstração de forma visível (ex.: um aviso "Acesso demo: demo123 / demo123") e/ou botão "Entrar como demo" que preenche o formulário.
* Como o login é por email, aceitar "demo123" como identificador da conta demo (o schema Zod de login deve permitir o valor demo123 especificamente para essa conta demo; demais cadastros seguem validação de email normal).

INTERNACIONALIZAÇÃO E FORMATAÇÃO
* Locale padrão: pt-BR.
* Toda a interface, textos e mensagens em português.
* Datas formatadas em pt-BR (ex.: dd/MM/yyyy).
* Números formatados em pt-BR (separador de milhar e decimal).
* MOEDA: os valores monetários do dataset (MonthlyIncome, DailyRate, HourlyRate, MonthlyRate) são em DÓLAR (USD). Exibir com prefixo/rótulo USD (ex.: US$ 5.993 ou $5,993 conforme padrão adotado, de forma consistente em todo o app).
* Centralizar formatadores em src/lib/utils (formatCurrency, formatDate, formatNumber, formatPercent).

BANCO DE DADOS
Utilizar exclusivamente SQLite.
Não utilizar dados mockados.
Não utilizar arrays hardcoded para simular dados do dashboard.
Todos os indicadores devem ser derivados do banco após importação do CSV.

O CSV Human_Resources.csv deve ser usado como fonte inicial de dados.
Criar seed ou rotina de importação que leia o CSV real e grave os registros no SQLite.

MODELOS MÍNIMOS

User
* id
* name
* email
* password
* createdAt
* updatedAt

Employee
* id
* employeeNumber
* age
* attrition
* businessTravel
* dailyRate
* department
* distanceFromHome
* education
* educationField
* environmentSatisfaction
* gender
* hourlyRate
* jobInvolvement
* jobLevel
* jobRole
* jobSatisfaction
* maritalStatus
* monthlyIncome
* monthlyRate
* numCompaniesWorked
* over18
* overTime
* percentSalaryHike
* performanceRating
* relationshipSatisfaction
* standardHours
* stockOptionLevel
* totalWorkingYears
* trainingTimesLastYear
* workLifeBalance
* yearsAtCompany
* yearsInCurrentRole
* yearsSinceLastPromotion
* yearsWithCurrManager
* isActive
* riskScore
* riskLevel
* attritionProbability
* predictedAttrition
* topRiskFactors
* modelVersion
* scoredAt
* createdAt
* updatedAt

RiskConfig
* id
* highRiskThreshold
* mediumRiskThreshold
* activeModelVersion
* updatedAt

ModelRun
* id
* modelVersion
* algorithm
* rocAuc
* prAuc
* precision
* recall
* f1
* accuracy
* threshold
* trainedAt
* notes

RISK LEVEL
Criar enum:
* LOW
* MEDIUM
* HIGH
* CRITICAL

ABORDAGEM DE MACHINE LEARNING
Este é o núcleo do projeto (projeto de portfólio). O risco de saída NÃO é calculado por regras fixas, e sim por um modelo de Machine Learning supervisionado treinado com o histórico de Attrition.

Definição do problema:
* Tarefa: classificação binária supervisionada.
* Alvo (target): Attrition (Yes = 1 = saiu; No = 0 = permaneceu).
* Saída principal do modelo: attritionProbability (probabilidade prevista de saída, 0 a 1).
* riskScore = attritionProbability * 100 (0 a 100), apenas uma reescala para exibição.
* riskLevel é derivado de riskScore pelos thresholds configuráveis (LOW/MEDIUM/HIGH/CRITICAL).
* predictedAttrition = 1 quando attritionProbability >= threshold de decisão do modelo.

Onde o ML roda:
* Todo o treinamento e avaliação ficam na camada Python, em analysis/hr_analytics (scikit-learn e afins).
* O app Next.js NÃO treina modelo. Ele consome as predições já calculadas e persistidas no banco.
* Fluxo: Python treina -> gera artefato do modelo -> script de scoring gera predições -> predições são gravadas no SQLite -> dashboard lê do banco.

Bibliotecas Python:
* pandas, numpy (manipulação de dados)
* scikit-learn (pipeline, pré-processamento, modelos, avaliação)
* xgboost ou lightgbm (modelo de gradient boosting)
* imbalanced-learn (tratamento de desbalanceamento)
* shap (explicabilidade)
* joblib (serialização do modelo)
* matplotlib/seaborn (gráficos de avaliação)

PIPELINE DE DADOS E FEATURES
* Remover colunas constantes/sem informação: EmployeeCount, Over18, StandardHours (valor único) e usar EmployeeNumber apenas como identificador (não como feature).
* Separar features numéricas e categóricas.
* Categóricas (ex.: BusinessTravel, Department, EducationField, Gender, JobRole, MaritalStatus, OverTime): One-Hot Encoding.
* Numéricas: padronização (StandardScaler) quando o modelo exigir (ex.: Regressão Logística).
* Encapsular todo o pré-processamento em um ColumnTransformer + Pipeline do scikit-learn, evitando data leakage.
* O mesmo pipeline usado no treino deve ser reutilizado no scoring.

SELEÇÃO DE FEATURES E PREVENÇÃO DE DATA LEAKAGE
* Documentar a lista final de features usadas no modelo e justificar cada exclusão (no model card / docs/risk-model.md).
* Prevenção de vazamento por pré-processamento: qualquer estatística (média, escala, categorias do One-Hot) deve ser aprendida APENAS no conjunto de treino (fit no treino, transform no teste). Nunca fazer fit no dataset inteiro antes do split.
* Prevenção de vazamento por features: não incluir variáveis que só existiriam após a decisão de saída. No dataset atual não há coluna de vazamento óbvia, mas a decisão deve ser explícita e registrada.
* EmployeeNumber nunca é feature (apenas chave/identificador).

TREINO E VALIDAÇÃO
* Split treino/teste estratificado (ex.: 80/20) preservando a proporção de Attrition (holdout).
* O conjunto de teste (holdout) é usado apenas para avaliação final e simula profissionais "não vistos".
* Validação cruzada estratificada (StratifiedKFold) para seleção/tuning.
* Tuning de hiperparâmetros (GridSearchCV ou RandomizedSearchCV) otimizando ROC-AUC ou PR-AUC.
* Fixar random_state para reprodutibilidade.

ESCOPO DE SCORING (ATIVOS vs. DESLIGADOS)
Ponto conceitual central: o objetivo é prever quem, ENTRE OS FUNCIONÁRIOS ATIVOS, está prestes a sair.
* O modelo é TREINADO e AVALIADO com o histórico completo (ativos e desligados), pois precisa das duas classes para aprender.
* Porém, o risco exibido no produto (dashboard, lista, detalhe, insights, /employees) deve considerar SOMENTE profissionais ativos (Attrition = No).
* Profissionais já desligados (Attrition = Yes) NÃO aparecem como "em risco de sair" (não faz sentido) — eles servem apenas como base histórica.
* Marcar cada Employee com um campo status/isActive (derivado de Attrition) para permitir esse filtro.
* KPIs de risco (ex.: "profissionais em alto risco") consideram apenas ativos.
* A taxa histórica de rotatividade (16,12%) continua sendo exibida como métrica descritiva da base completa, deixando claro que é histórica.
* A rota /dataset continua mostrando a base completa e crua (ativos e desligados), pois é a visão do CSV original.

TRATAMENTO DE DESBALANCEAMENTO
As classes são desbalanceadas (~16% de saída). Aplicar e comparar ao menos uma estratégia:
* class_weight='balanced' (Regressão Logística / árvores), e/ou
* scale_pos_weight (XGBoost), e/ou
* SMOTE (via imbalanced-learn), aplicado somente dentro do fold de treino.

MODELOS
Treinar e comparar pelo menos:
* Baseline interpretável: Regressão Logística.
* Modelo principal: Gradient Boosting (XGBoost ou LightGBM).
* Opcional: Random Forest como comparação.
Selecionar o modelo final com base nas métricas de avaliação e registrar a decisão.

AVALIAÇÃO (MÉTRICAS OBRIGATÓRIAS)
Como o problema é desbalanceado, não usar accuracy como métrica principal.
Calcular e reportar:
* ROC-AUC (métrica principal de ranqueamento).
* PR-AUC (average precision).
* Precision, Recall e F1 para a classe positiva (saída).
* Matriz de confusão.
* Curva ROC e curva Precision-Recall.
* Análise de threshold: escolher o ponto de corte de forma justificada (ex.: maximizar F1 ou atender a um recall mínimo de retenção).
Cada treino registra suas métricas na tabela ModelRun.

EXPLICABILIDADE (SHAP)
* Usar SHAP para explicar o modelo global e individualmente.
* Importância global de features (summary plot) para a seção de fatores de risco do dashboard.
* Explicação local por profissional: os principais fatores que empurraram a probabilidade para cima/baixo.
* O campo topRiskFactors de cada Employee deve ser preenchido com os principais fatores SHAP daquele profissional (nome do fator + contribuição/direção), alimentando a tela de detalhe e as recomendações de retenção.

ARTEFATOS DO MODELO
* Salvar o pipeline treinado (pré-processamento + modelo) como artefato versionado (ex.: models/model_vX.joblib).
* Salvar metadados do treino (métricas, data, versão, algoritmo) e as figuras de avaliação.
* Definir modelVersion e registrar em ModelRun; RiskConfig.activeModelVersion aponta o modelo em produção.

SCORING E INTEGRAÇÃO COM O BANCO
* Um script de scoring (Python) carrega o artefato ativo, gera attritionProbability para todos os profissionais e escreve no banco: attritionProbability, predictedAttrition, riskScore, riskLevel, topRiskFactors, modelVersion, scoredAt.
* Alternativamente, o scoring pode exportar um arquivo (ex.: data/predictions.csv) que o seed do Prisma consome ao popular o SQLite.
* Recalcular riskLevel no app quando os thresholds mudarem (não requer re-treino, apenas reclassificação sobre a probabilidade existente).
* A função de derivação riskLevel(probabilidade, thresholds) fica em src/lib/risk e é testada.

HONESTIDADE E LIMITAÇÕES (documentar)
* O dataset é estático e sintético (IBM HR Analytics); as predições são demonstrativas.
* Correlação não implica causalidade; o modelo indica risco, não a causa.
* Documentar premissas, limitações e possíveis vieses em docs/risk-model.md (model card).

RECLASSIFICAÇÃO NO APP
O usuário pode ajustar os thresholds em /settings, alterando a fronteira LOW/MEDIUM/HIGH/CRITICAL sobre a probabilidade já prevista.
A probabilidade em si só muda com um novo treino/scoring na camada Python.

CARGA DE DADOS
NÃO existe importação manual de arquivos pelos usuários.
Não deve haver tela de upload nem qualquer forma de o usuário enviar CSV pela interface.

A única fonte de dados é o arquivo CSV já existente no projeto:
* data/Human_Resources.csv

Requisitos:
* A carga deve ocorrer exclusivamente via seed do Prisma (prisma/seed.ts) e/ou scripts (scripts/import-csv.ts).
* O seed lê data/Human_Resources.csv e as predições geradas pela camada de ML (ex.: data/predictions.csv) e grava tudo no SQLite.
* Cada Employee é persistido com seus dados originais + attritionProbability, riskScore, riskLevel, predictedAttrition, topRiskFactors e modelVersion.
* Evitar duplicidade por EmployeeNumber (carga idempotente).
* Um script de recálculo (scripts/recalculate-risk.ts) reclassifica riskLevel quando os thresholds mudarem (sem re-treinar; apenas reaplica os cortes sobre attritionProbability).
* A interface é somente leitura sobre os dados: nenhuma rota ou componente deve aceitar arquivos do usuário.

LANDING PAGE
A rota / deve ser uma landing page premium de produto analítico para RH.
Ela deve funcionar como apresentação executiva e entrada para o dashboard.

Conteúdo obrigatório:
* Hero com proposta de valor clara: prever risco de desligamento antes que ele aconteça.
* Indicadores principais do dataset: total de profissionais, taxa de rotatividade, profissionais em alto risco, renda média, tempo médio de empresa.
* Seção visual mostrando cards de insights.
* Seção explicando os principais fatores de risco (importância global de features via SHAP).
* Seção destacando o modelo: algoritmo usado e métrica principal (ex.: ROC-AUC).
* CTA para acessar dashboard.

A landing page deve parecer produto SaaS premium de People Analytics, não um CRUD.

DASHBOARD PRINCIPAL
Criar rota /dashboard.

O dashboard deve ser dinâmico e recalculado com os dados do banco.
Importante: os indicadores de RISCO (score, nível, profissionais em risco) consideram SOMENTE profissionais ativos (isActive = true). Métricas históricas descritivas (ex.: taxa de rotatividade) usam a base completa e devem ser rotuladas como "histórico".
Deve conter filtros globais:
* Departamento
* Cargo
* Gênero
* Faixa etária
* OverTime
* BusinessTravel
* RiskLevel

KPIs obrigatórios:
* Total de profissionais (base completa) e total de ativos.
* Quantidade e percentual histórico com Attrition = Yes (rotulado como histórico).
* Taxa de rotatividade histórica: 16.12% como referência quando usando o CSV fornecido (rotulada como histórica).
* Profissionais ATIVOS em risco HIGH ou CRITICAL.
* Idade média.
* Renda mensal média (em USD).
* Tempo médio na empresa.
* Satisfação média no trabalho.
* Satisfação média com ambiente.
* Equilíbrio vida/trabalho médio.

GRÁFICOS OBRIGATÓRIOS
Implementar gráficos interativos, responsivos e filtráveis:
* Rotatividade por departamento.
* Rotatividade por cargo.
* Distribuição de risco por departamento.
* Distribuição de risco por nível de cargo.
* Histograma de idade.
* Histograma de renda mensal.
* Scatter plot idade vs renda mensal, colorido por Attrition ou RiskLevel.
* Barras de OverTime vs Attrition.
* Barras de satisfação vs risco.
* Heatmap ou matriz simplificada de correlações entre variáveis numéricas relevantes.

DESEMPENHO DO MODELO (NO DASHBOARD)
Exibir um bloco/painel dedicado ao modelo de ML (lido de ModelRun / RiskConfig.activeModelVersion):
* Algoritmo do modelo ativo e versão (modelVersion).
* Métrica principal em destaque: ROC-AUC.
* Métricas complementares: PR-AUC, precision, recall, F1.
* Matriz de confusão (imagem ou componente).
* Curva ROC e curva Precision-Recall (podem ser imagens geradas em analysis/reports).
* Importância global de features (SHAP summary).
* Data do último treino (trainedAt) e threshold de decisão adotado.
Esse painel demonstra a competência de ML e é peça central para a defesa em entrevista.

INSIGHTS EXECUTIVOS
Criar uma seção /insights ou bloco dentro do dashboard com textos gerados a partir dos dados reais.
Os insights devem destacar automaticamente:
* Departamento com maior quantidade de attrition.
* Cargo com maior quantidade de attrition.
* Perfil médio de quem saiu.
* Diferença de idade média entre quem saiu e quem ficou.
* Diferença de renda média entre quem saiu e quem ficou.
* Relação entre horas extras e risco.
* Relação entre satisfação baixa e risco.

Os textos não devem ser hardcoded com números fixos.
Os números devem ser calculados a partir do banco.

LISTA DE PROFISSIONAIS
Criar rota /employees.

Deve conter tabela avançada com:
* EmployeeNumber
* Departamento
* Cargo
* Idade
* Gênero
* Renda mensal
* Tempo de empresa
* OverTime
* JobSatisfaction
* EnvironmentSatisfaction
* WorkLifeBalance
* Attrition
* RiskScore
* RiskLevel

Funcionalidades:
* Por padrão, listar apenas profissionais ATIVOS (isActive = true), com filtro opcional para incluir/isolar desligados.
* Busca textual.
* Filtro por departamento.
* Filtro por cargo.
* Filtro por risco.
* Filtro por status (ativo/desligado).
* Ordenação por score de risco.
* Paginação.
* Exportação CSV dos resultados filtrados.
* Destaque visual para HIGH e CRITICAL.

DETALHE DO PROFISSIONAL
Criar rota /employees/[id].

Deve conter:
* Resumo do perfil.
* Probabilidade de saída prevista pelo modelo e riskScore em visual radial ou progress bar premium.
* Fatores que mais contribuíram para o risco (top fatores SHAP de topRiskFactors, com direção/impacto).
* Comparação com médias da empresa.
* Dados de satisfação.
* Dados de remuneração.
* Dados de carreira e tempo de empresa.
* Recomendações de ação de retenção.

RECOMENDAÇÕES DE RETENÇÃO
Para profissionais HIGH ou CRITICAL, gerar recomendações baseadas em regras:
* Se OverTime = Yes, recomendar revisão de carga e priorização de equilíbrio.
* Se JobSatisfaction <= 2, recomendar conversa estruturada sobre motivadores e plano de desenvolvimento.
* Se EnvironmentSatisfaction <= 2, recomendar análise de clima do time.
* Se WorkLifeBalance <= 2, recomendar ajuste de rotina e flexibilidade.
* Se YearsSinceLastPromotion alto, recomendar revisão de trilha de carreira.
* Se MonthlyIncome abaixo da mediana do cargo/departamento, recomendar análise de equidade salarial.

DATASET COMPLETO (VISUALIZAÇÃO DO CSV)
Criar rota /dataset para visualização completa e bruta dos dados do CSV.

Objetivo:
* Permitir explorar TODAS as 35 colunas originais do dataset (exatamente como no CSV), não apenas as colunas resumidas de /employees.

Requisitos:
* Tabela com todas as colunas do Human_Resources.csv.
* Scroll horizontal quando necessário (a tabela é larga).
* Cabeçalho fixo (sticky) ao rolar.
* Paginação no lado do servidor.
* Seletor de itens por página com as opções: 25, 50, 100, 200, 500, 1000.
* Exibir contagem total de registros e o intervalo atual (ex.: "Exibindo 1–50 de 1470").
* Navegação de páginas (primeira, anterior, próxima, última).
* Busca textual opcional sobre as colunas.
* Estado de carregamento (skeleton) e estado vazio.
* Totalmente responsivo (ver seção de responsividade).

Download do CSV:
* Exibir um botão/link "Baixar CSV" bem visível.
* O download deve entregar o dataset completo em formato CSV.
* Servir via rota de API dedicada (streaming/attachment com Content-Disposition), gerando o CSV a partir do banco.
* O arquivo baixado deve conter todas as colunas originais.

ÁREA DE CONFIGURAÇÕES
Não existe painel administrativo separado nem papel de administrador.
Não existe tela de importação de dados (a carga é feita apenas via seed/scripts).
A tela de configurações fica disponível para qualquer usuário autenticado.

Rotas:
* /settings

RESUMO DE DADOS
Exibir (no dashboard):
* Total de profissionais na base.
* Status dos dados (base carregada ou vazia).

CONFIGURAÇÕES
Criar tela /settings.
Campos:
* Threshold de risco médio.
* Threshold de risco alto.
* Threshold de risco crítico.
* Permitir recalcular scores.

DESIGN OBRIGATÓRIO
IMPORTANTE:
O sistema NÃO deve parecer um CRUD.
O sistema deve parecer um produto comercial premium de People Analytics pronto para produção.

Direção visual:
* Visual de SaaS executivo moderno.
* Inspiração em dashboards premium como Linear, Vercel Analytics, Mixpanel, Tableau Cloud e Culture Amp.
* Fundo claro off-white ou slate muito escuro, mas com acabamento sofisticado.
* Cards com profundidade sutil.
* Muito espaço em branco.
* Tipografia forte e moderna.
* Uso consistente de cores para risco: verde, amarelo, laranja, vermelho.
* Gráficos limpos, sem excesso visual.
* Navegação lateral ou topbar minimalista.
* Componentização adequada.

DESIGN SYSTEM E TOKENS
Definir um design system centralizado, sem valores mágicos espalhados pelo código.
* Cores, espaçamentos, raios, sombras e tipografia devem ser tokens configurados em tailwind.config.ts e globals.css (CSS variables).
* Paleta de risco padronizada e reutilizável:
    * LOW: verde (ex.: emerald).
    * MEDIUM: amarelo/âmbar.
    * HIGH: laranja.
    * CRITICAL: vermelho.
* Estados de cor devem ter contraste acessível em fundo claro e escuro.
* Tipografia: uma fonte principal moderna (ex.: Inter, Geist ou Satoshi), com escala tipográfica consistente (display, título, subtítulo, corpo, legenda).
* Escala de espaçamento baseada em múltiplos de 4px.
* Raios de borda consistentes (ex.: sm, md, lg, xl) e sombras suaves padronizadas.

TEMA CLARO E ESCURO
* Suportar tema claro e escuro.
* Alternância de tema persistida (localStorage) e respeitando prefers-color-scheme na primeira visita.
* Todos os componentes, gráficos e badges de risco devem funcionar nos dois temas.

GRID E LAYOUT BASE
* Largura máxima de conteúdo controlada por container central (ex.: max-w-7xl) com padding lateral responsivo.
* Usar CSS Grid e Flexbox; evitar posicionamentos absolutos frágeis.
* Layout autenticado com sidebar fixa (desktop) + área de conteúdo scrollável.
* Espaçamento vertical consistente entre seções (ritmo visual).
* Cards e widgets organizados em grid responsivo que se reorganiza por breakpoint.

RESPONSIVIDADE (OBRIGATÓRIA)
O sistema deve ser totalmente responsivo, com abordagem mobile-first (estilos base para mobile e progressivamente aprimorados via breakpoints).

Breakpoints (padrão Tailwind):
* base: < 640px (celular)
* sm: >= 640px (celular grande)
* md: >= 768px (tablet)
* lg: >= 1024px (desktop)
* xl: >= 1280px (desktop grande)
* 2xl: >= 1536px (telas amplas)

Regras de layout por breakpoint:
* Navegação:
    * Desktop (lg+): sidebar fixa lateral com itens de navegação e ações.
    * Tablet (md): sidebar recolhível (colapsada em ícones) ou drawer.
    * Mobile (base/sm): topbar com menu hambúrguer que abre um drawer lateral; navegação inferior opcional para ações principais.
* Grid de KPIs:
    * Mobile: 1 coluna.
    * sm: 2 colunas.
    * lg: 3 a 4 colunas.
* Gráficos:
    * Mobile: largura total (100%), empilhados verticalmente, altura reduzida.
    * md: 2 por linha quando fizer sentido.
    * Devem usar container responsivo (ex.: ResponsiveContainer do Recharts) e nunca largura fixa em pixels.
* Filtros globais:
    * Desktop: barra de filtros horizontal ou painel lateral.
    * Mobile: filtros dentro de um drawer/bottom sheet acionado por botão "Filtros".
* Tabela de profissionais:
    * Desktop: tabela completa com todas as colunas e scroll horizontal quando necessário.
    * Mobile: converter linhas em cards empilhados (lista) OU manter tabela com scroll horizontal e colunas prioritárias fixas.
    * Ações e badges de risco sempre visíveis e tocáveis.
* Tabela do dataset completo (/dataset):
    * Sempre com scroll horizontal (muitas colunas) e cabeçalho fixo (sticky).
    * Seletor de itens por página e paginação acessíveis no topo e/ou rodapé.
    * Botão de download do CSV sempre visível, inclusive no mobile.
* Detalhe do profissional:
    * Desktop: layout de duas colunas (conteúdo + card lateral de risco/ações).
    * Mobile: coluna única, com o card de risco/ações no topo ou fixado ao final.
* Landing page:
    * Hero, KPIs e cards devem reempilhar em coluna única no mobile, mantendo hierarquia e CTA sempre acessível.

Requisitos gerais de responsividade:
* Nenhum overflow horizontal indevido em qualquer breakpoint.
* Imagens e gráficos fluidos (nunca estourar o container).
* Textos com tamanhos responsivos e truncamento/ellipsis quando necessário.
* Áreas de toque com no mínimo ~44px em telas touch.
* Modais, drawers e menus adaptados a mobile (largura total ou bottom sheet).
* Testar em larguras representativas: 360px, 768px, 1024px, 1440px.

ACESSIBILIDADE E USABILIDADE
* Contraste mínimo AA para texto e elementos interativos.
* Navegação por teclado e foco visível em todos os elementos interativos.
* Uso correto de HTML semântico e atributos ARIA quando necessário.
* Não comunicar risco apenas por cor: acompanhar de rótulo/ícone (ex.: "CRÍTICO").
* Estados de loading (skeletons), erro e vazio bem definidos em todas as telas.
* Respeitar prefers-reduced-motion para animações.

ESTRUTURA DE LAYOUT (COMPONENTES)
Centralizar o layout em componentes reutilizáveis em src/components/layout:
* AppShell: casca da área autenticada (sidebar + topbar + conteúdo).
* Sidebar: navegação principal, colapsável, com estado ativo por rota.
* Topbar: título de contexto, alternância de tema, menu do usuário, ações rápidas.
* MobileNav / Drawer: navegação mobile.
* PageHeader: título, subtítulo e ações de cada página.
* GlobalFilters: barra/painel de filtros globais responsivo.
* Container/Section: wrappers de largura e espaçamento padronizados.
Os componentes de página não devem duplicar estrutura de layout; devem consumir esses componentes.

HOME / LANDING PAGE
A homepage deve conter:
* Hero principal.
* KPIs de impacto.
* Preview do dashboard.
* Cards de fatores de risco.
* Seção de insights automáticos.
* CTA para login/dashboard.

EMPTY STATES
Quando a base ainda não tiver sido carregada (seed não executado):
Exibir interface amigável informando:
"Base de profissionais ainda não carregada. Execute o seed do projeto (npx prisma db seed) para popular o dashboard."

Quando filtros não retornarem resultados:
Exibir interface amigável informando:
"Nenhum profissional encontrado para os filtros selecionados."

TRATAMENTO DE ERROS E LOGGING
* Todas as rotas de API devem tratar erros de forma consistente, retornando status HTTP apropriado (400, 401, 404, 422, 500) e um corpo JSON padronizado ({ error: { message, code } }).
* Nunca vazar stack traces ou detalhes sensíveis para o cliente.
* Validar entrada das rotas com Zod; retornar 422 em falha de validação.
* Rotas autenticadas devem retornar 401 quando não houver sessão.
* Logging estruturado no servidor (ex.: pino ou console estruturado) para erros e eventos relevantes; sem logar dados sensíveis nem senhas.
* No client, usar Error Boundaries e páginas error.tsx/not-found.tsx do App Router.
* Cada tela deve ter três estados bem definidos: carregando (skeleton), erro (mensagem + ação de retry) e vazio (empty state).

PRIVACIDADE E USO RESPONSÁVEL (LGPD)
* O dataset é sintético e público (IBM HR Analytics); não contém dados pessoais reais.
* Ainda assim, tratar o projeto com as boas práticas de People Analytics:
    * Documentar que a ferramenta é de apoio à decisão e NÃO deve ser usada isoladamente para decisões de desligamento.
    * Evitar exibir/usar atributos sensíveis de forma discriminatória; registrar no model card a análise de possíveis vieses (ex.: por gênero).
    * Minimização: exibir apenas os dados necessários para a finalidade.
    * Não expor dados individuais fora da área autenticada.
* Registrar essas considerações em docs/risk-model.md e no README.

TESTES UNITÁRIOS
Testes são obrigatórios e devem cobrir a lógica de negócio crítica.

Frontend/Backend (TypeScript):
* Utilizar Vitest como framework de testes.
* Utilizar Testing Library para componentes quando aplicável.
* Cobertura mínima obrigatória: 80% nas pastas src/lib/risk, src/lib/metrics e src/lib/csv.
* Testar obrigatoriamente:
    * Conversão de attritionProbability em riskScore (0-100).
    * Classificação de riskLevel (LOW/MEDIUM/HIGH/CRITICAL) a partir dos thresholds.
    * Regras de recomendações de retenção.
    * Agregações e KPIs do dashboard.
    * Correlações entre variáveis.
    * Parsing e validação do CSV.
    * Schemas Zod de validação.
* Testes de integração para as rotas de API principais (employees, metrics, insights).
* Usar fixtures determinísticas em tests/fixtures, nunca dados aleatórios.

Machine Learning (Python):
* Utilizar pytest para a camada em analysis/hr_analytics.
* Testar: carga/limpeza de dados, pré-processamento (features), smoke test de treino, cálculo de métricas de avaliação e scoring.
* Garantir reprodutibilidade (random_state fixo) nos testes de treino.
* Validar a derivação de riskLevel a partir da probabilidade e dos thresholds (paridade com a função em src/lib/risk).
* Usar um CSV de amostra determinístico em tests/fixtures para treino/scoring rápidos.

Scripts esperados:
* npm run test         # roda os testes TS uma vez
* npm run test:watch   # modo watch
* npm run test:cov     # cobertura
* pytest               # testes Python (via pyproject.toml)
* python -m analysis.scripts.train_model          # treina e salva o modelo + métricas
* python -m analysis.scripts.generate_predictions # gera data/predictions.csv

DEPENDÊNCIAS PYTHON (pyproject.toml)
* pandas, numpy
* scikit-learn
* xgboost (ou lightgbm)
* imbalanced-learn
* shap
* joblib
* matplotlib, seaborn
* pytest
* ruff, pyright (qualidade)

QUALIDADE DE CÓDIGO PYTHON (RUFF + PYRIGHT)
A camada Python (notebooks e pacote analysis/hr_analytics) deve seguir padrões estritos de qualidade.

Ruff (lint + format):
* Configurado em pyproject.toml.
* Habilitar regras: E, F, I, N, UP, B, SIM.
* line-length consistente (ex.: 100).
* Import sorting via Ruff.
* Comando: ruff check . e ruff format .
* O código não pode conter erros de lint.

Pyright (type checking):
* Configurado em pyproject.toml (ou pyrightconfig.json).
* Modo typeCheckingMode = "strict".
* Todas as funções públicas devem ter type hints completos.
* Comando: pyright.
* O projeto não pode conter erros de tipo.

Qualidade TypeScript:
* ESLint sem erros.
* Prettier aplicado.
* tsc --noEmit sem erros de tipo.

DOCUMENTAÇÃO (MKDOCS)
A documentação do projeto deve ser gerada com MkDocs.

Requisitos:
* Utilizar tema Material for MkDocs.
* Configuração em mkdocs.yml.
* Conteúdo em docs/.
* Documentação obrigatória:
    * index.md: visão geral do produto.
    * getting-started.md: instalação, migrações, execução.
    * architecture.md: arquitetura e árvore de diretórios.
    * risk-model.md: model card (dados, target, features, métricas, threshold, limitações e vieses).
    * ml-pipeline.md: pipeline de ML (pré-processamento, treino, tuning, avaliação, SHAP, scoring).
    * api.md: referência das rotas de API.
    * data-pipeline.md: fluxo do CSV e das predições até o banco.
    * contributing.md: padrões de código, testes, Ruff, Pyright, ESLint.
* Comandos esperados:
    * mkdocs serve   # servir documentação localmente
    * mkdocs build   # gerar site estático
* A documentação deve refletir fielmente o código e ser mantida atualizada.

QUALIDADE OBRIGATÓRIA
Não utilizar:
* TODO
* FIXME
* Mock data
* Dados fictícios hardcoded no dashboard

Todas as funcionalidades devem estar conectadas ao banco.
O projeto deve compilar sem erros.
Os cálculos devem estar centralizados em funções testáveis.
Os componentes devem ser organizados e reutilizáveis.

ESTRUTURA MÍNIMA DE ROTAS
* /
* /login
* /register
* /dashboard
* /insights
* /employees
* /employees/[id]
* /dataset
* /settings

ÁRVORE DE DIRETÓRIOS E ARQUIVOS
O projeto deve seguir a estrutura abaixo, padrão de startups modernas com Next.js 15 (App Router), separação por camadas (app, components, lib, server) e agrupamento de rotas por contexto usando route groups.

```
Recursos_Humanos/
├── prisma/
│   ├── schema.prisma                # Modelos User, Employee, RiskConfig, ModelRun + enums
│   ├── seed.ts                      # Carrega Human_Resources.csv + predições (data/predictions.csv)
│   └── migrations/                  # Migrações geradas pelo Prisma
├── public/
│   └── images/                      # Assets estáticos da landing/dashboard
├── data/
│   ├── Human_Resources.csv          # Fonte de dados original (carga via seed/scripts)
│   └── predictions.csv              # Predições geradas pela camada de ML (consumidas pelo seed)
├── scripts/
│   ├── import-csv.ts                # Script CLI de carga do CSV do projeto para o banco
│   └── recalculate-risk.ts          # Reclassifica riskLevel via thresholds (sem re-treino)
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout raiz (providers, fontes, tema, locale pt-BR)
│   │   ├── page.tsx                 # Redireciona para (marketing) ou landing raiz
│   │   ├── globals.css              # Tailwind + estilos globais
│   │   ├── error.tsx                # Error boundary global
│   │   ├── not-found.tsx            # Página 404
│   │   ├── loading.tsx              # Estado de carregamento global
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx           # Layout público da landing
│   │   │   └── page.tsx             # Landing page premium (/)
│   │   ├── (auth)/
│   │   │   ├── layout.tsx           # Layout de autenticação
│   │   │   ├── login/page.tsx       # /login
│   │   │   └── register/page.tsx    # /register (cadastro + auto-login)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # Layout autenticado (sidebar/topbar + guarda de sessão)
│   │   │   ├── dashboard/page.tsx   # /dashboard (KPIs, gráficos, filtros)
│   │   │   ├── insights/page.tsx    # /insights (insights executivos automáticos)
│   │   │   ├── employees/
│   │   │   │   ├── page.tsx         # /employees (tabela avançada)
│   │   │   │   └── [id]/page.tsx    # /employees/[id] (detalhe + fatores de risco)
│   │   │   ├── dataset/page.tsx     # /dataset (todas as colunas do CSV, paginação, download)
│   │   │   └── settings/page.tsx    # /settings (thresholds de risco)
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # Handler NextAuth
│   │       ├── register/route.ts             # Cadastro de novo usuário
│   │       ├── employees/route.ts            # Listagem/filtros/paginação/export
│   │       ├── dataset/route.ts              # Dataset completo paginado (todas as colunas)
│   │       ├── dataset/download/route.ts     # Download do CSV completo (attachment)
│   │       ├── metrics/route.ts              # KPIs e agregações do dashboard
│   │       ├── insights/route.ts             # Insights executivos calculados
│   │       ├── model/route.ts                # Métricas do modelo ativo (ModelRun)
│   │       └── settings/route.ts             # Leitura/gravação de RiskConfig
│   ├── components/
│   │   ├── ui/                      # Botões, inputs, cards, tabela, badges de risco
│   │   ├── layout/                  # AppShell, Sidebar, Topbar, MobileNav, PageHeader, GlobalFilters, Container, ThemeToggle
│   │   ├── charts/                  # Wrappers Recharts (Bar, Histogram, Scatter, Heatmap)
│   │   ├── dashboard/               # KpiCard, DashboardGrid, RiskDistribution
│   │   ├── employees/               # EmployeesTable, RiskBadge, EmployeeRiskRadial
│   │   ├── dataset/                 # DatasetTable, PageSizeSelector, Pagination, DownloadCsvButton
│   │   ├── marketing/               # Hero, FeatureCards, RiskFactors, CTA
│   │   └── settings/               # SettingsForm
│   ├── lib/
│   │   ├── prisma.ts                # Cliente Prisma singleton
│   │   ├── utils.ts                 # Helpers gerais (cn, formatadores)
│   │   ├── auth/
│   │   │   ├── options.ts           # authOptions do NextAuth
│   │   │   └── session.ts           # Helpers de sessão no servidor
│   │   ├── risk/
│   │   │   ├── risk-level.ts        # Deriva riskLevel da probabilidade + thresholds
│   │   │   ├── risk-score.ts        # Converte probabilidade (0-1) em riskScore (0-100)
│   │   │   └── recommendations.ts   # Regras de recomendações de retenção (usa topRiskFactors)
│   │   ├── metrics/
│   │   │   ├── aggregations.ts      # KPIs e agrupamentos por dimensão
│   │   │   └── correlations.ts      # Matriz de correlação de variáveis numéricas
│   │   ├── csv/
│   │   │   ├── parser.ts            # Parsing/validação do CSV (PapaParse)
│   │   │   └── mapping.ts           # Mapeia colunas do CSV -> campos Employee
│   │   └── validations/
│   │       ├── auth.schema.ts       # Schemas Zod de login/cadastro
│   │       ├── employee.schema.ts   # Schema Zod de filtros/employee
│   │       └── settings.schema.ts   # Schema Zod de RiskConfig
│   ├── server/
│   │   ├── services/                # Regras de negócio (employee, metrics, insights, auth)
│   │   └── repositories/            # Acesso a dados via Prisma
│   ├── hooks/                       # useFilters, useEmployees, useMetrics
│   ├── types/                       # Tipos globais (Employee, Metrics, Risk, User)
│   ├── config/
│   │   ├── site.ts                  # Metadados do produto
│   │   └── constants.ts             # Constantes (departamentos, thresholds default)
│   ├── styles/                      # Estilos adicionais/temas
│   └── middleware.ts                # Proteção das rotas autenticadas (redireciona p/ /login)
├── tests/
│   ├── unit/
│   │   ├── risk/
│   │   │   ├── risk-score.test.ts        # Testes da conversão probabilidade -> score
│   │   │   ├── risk-level.test.ts        # Testes de classificação de nível
│   │   │   └── recommendations.test.ts   # Testes das regras de retenção
│   │   ├── metrics/
│   │   │   ├── aggregations.test.ts       # Testes de KPIs/agregações
│   │   │   └── correlations.test.ts       # Testes de correlação
│   │   ├── csv/
│   │   │   ├── parser.test.ts             # Testes de parsing/validação de CSV
│   │   │   └── mapping.test.ts            # Testes de mapeamento de colunas
│   │   └── validations/                    # Testes dos schemas Zod
│   ├── integration/
│   │   ├── api-employees.test.ts          # Testes das rotas /api/employees
│   │   ├── api-metrics.test.ts            # Testes das métricas
│   │   └── api-insights.test.ts           # Testes dos insights
│   ├── fixtures/
│   │   └── sample_hr.csv                   # CSV reduzido para testes determinísticos do seed/parser
│   └── setup.ts                            # Setup global de testes (Vitest)
├── analysis/
│   ├── analise_rh.ipynb                    # Notebook de EDA (análise exploratória)
│   ├── modeling.ipynb                      # Notebook de modelagem ML (treino/avaliação/SHAP)
│   ├── models/
│   │   ├── model_v1.joblib                 # Pipeline treinado (NÃO versionar - ver .gitignore)
│   │   └── metrics_v1.json                 # Métricas e metadados do treino (versionado)
│   ├── reports/
│   │   ├── roc_curve.png                   # Curva ROC
│   │   ├── pr_curve.png                    # Curva Precision-Recall
│   │   ├── confusion_matrix.png            # Matriz de confusão
│   │   └── shap_summary.png                # Importância global (SHAP)
│   ├── hr_analytics/
│   │   ├── __init__.py
│   │   ├── loading.py                      # Carga e limpeza do CSV
│   │   ├── features.py                     # Pré-processamento (ColumnTransformer/Pipeline)
│   │   ├── train.py                        # Treino, tuning e seleção de modelo
│   │   ├── evaluate.py                     # Métricas, curvas e matriz de confusão
│   │   ├── explain.py                      # Explicabilidade com SHAP (global e local)
│   │   ├── score.py                        # Scoring: gera predições e topRiskFactors
│   │   ├── metrics.py                      # Agregações e correlações (EDA)
│   │   └── plots.py                        # Geração de gráficos
│   ├── scripts/
│   │   ├── train_model.py                  # CLI: treina e salva artefato + métricas
│   │   └── generate_predictions.py         # CLI: gera data/predictions.csv para o seed
│   └── tests/
│       ├── __init__.py
│       ├── test_loading.py                 # Testes de carga/limpeza
│       ├── test_features.py                # Testes do pré-processamento
│       ├── test_train.py                   # Testes de treino (smoke) e reprodutibilidade
│       ├── test_evaluate.py                # Testes das métricas de avaliação
│       └── test_score.py                   # Testes de scoring e derivação de riskLevel
├── docs/
│   ├── index.md                            # Página inicial da documentação
│   ├── getting-started.md                  # Instalação e execução
│   ├── architecture.md                     # Arquitetura e árvore de diretórios
│   ├── risk-model.md                       # Model card: dados, features, métricas, limitações
│   ├── ml-pipeline.md                      # Pipeline de ML: treino, avaliação, scoring
│   ├── api.md                              # Referência das rotas de API
│   ├── data-pipeline.md                    # Fluxo de dados do CSV/predições ao banco
│   └── contributing.md                     # Padrões de código, testes e qualidade
├── .env                             # DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
├── .env.example                     # Exemplo de variáveis de ambiente
├── .eslintrc.json                   # Configuração ESLint
├── .prettierrc                      # Configuração Prettier
├── .gitignore                       # Ignorar node_modules, .env, *.joblib, dev.db, etc.
├── vitest.config.ts                 # Configuração do Vitest (testes TS)
├── mkdocs.yml                       # Configuração da documentação MkDocs
├── pyproject.toml                   # Config Python: Ruff, Pyright, pytest, deps
├── next.config.ts                   # Configuração Next.js
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

Regras da estrutura:
* Route groups: (marketing) para conteúdo público, (auth) para login/cadastro, (dashboard) para área autenticada.
* Toda lógica de negócio deve ficar em src/server e src/lib, nunca dentro dos componentes de página.
* O cálculo de risco deve residir exclusivamente em src/lib/risk e ser reutilizado por seed, scripts e rotas de API.
* No app (TypeScript), src/lib/risk contém apenas a derivação de riskLevel a partir da probabilidade e dos thresholds; o treino do modelo é exclusivo da camada Python.
* Componentes visuais devem ser puros e reutilizáveis, recebendo dados via props.
* As rotas de API em src/app/api são a única ponte entre client e banco.

EXECUÇÃO
Requisitos de ambiente:
* Node.js 20 LTS ou superior.
* Python 3.11 ou superior.
* Gerenciador de pacotes JS: npm (usar package-lock.json).
* Registrar o seed do Prisma no package.json (campo "prisma": { "seed": "..." }) para que "npx prisma db seed" funcione.

Fluxo completo (incluindo a camada de ML):
* Camada de ML (Python), uma vez para gerar o modelo e as predições:
    * pip install -e . (ou instalar deps do pyproject.toml)
    * python -m analysis.scripts.train_model
    * python -m analysis.scripts.generate_predictions   # gera data/predictions.csv
* App (Next.js):
    * npm install
    * npx prisma migrate dev
    * npx prisma db seed        # carrega CSV + predições no SQLite
    * npm run dev

Regras de robustez do seed:
* O repositório deve versionar um data/predictions.csv já gerado para que o app rode sem executar o treino.
* Se data/predictions.csv NÃO existir no momento do seed: carregar os profissionais do CSV mesmo assim, deixando os campos de predição nulos e riskLevel indefinido, e exibir no dashboard um aviso de que as predições ainda não foram geradas (com instrução de rodar a camada de ML). O app não deve quebrar.
* A carga deve ser idempotente (rodar o seed novamente não duplica registros).

VERSIONAMENTO DE ARTEFATOS
* Versionar no Git apenas: data/predictions.csv e as métricas do modelo (analysis/models/metrics_vX.json).
* NÃO versionar os binários pesados do modelo (analysis/models/*.joblib) — adicioná-los ao .gitignore.
* As figuras de avaliação (analysis/reports/*.png) podem ser versionadas se necessárias à documentação/README; caso contrário, ignorar.

CI/CD (ITEM FUTURO)
Planejado para o final do projeto (o repositório GitHub ainda não existe):
* Adicionar GitHub Actions rodando em push/PR: instalar deps, lint (ESLint + Ruff), type-check (tsc --noEmit + Pyright), testes (Vitest + pytest) e build do Next.js.
* Opcional: job para build da documentação (mkdocs build) e deploy.
* Este item deve ser implementado quando o link do repositório GitHub estiver disponível.

README
Gerar README contendo:
* Instalação
* Configuração
* Migrações
* Execução
* Carga do CSV do projeto (data/Human_Resources.csv) via seed/scripts
* Pipeline de ML: como treinar o modelo, avaliar e gerar predições
* Métricas do modelo e principais decisões (resumo do model card)
* Estrutura do projeto
* Explicação do modelo de risco (target, features, avaliação, SHAP, limitações)
* Como executar os testes (Vitest e pytest)
* Como rodar as verificações de qualidade (ESLint, Prettier, Ruff, Pyright)
* Como servir e gerar a documentação (MkDocs)
* Explicar que o acesso é feito via cadastro/login de usuário (sem admin nem setup)
* Credenciais do usuário demo (demo123 / demo123)
* Nota de privacidade/uso responsável (LGPD) e limitações do modelo
* Menção ao CI/CD planejado (GitHub Actions) como item futuro

CRITÉRIO DE APROVAÇÃO
O projeto será considerado aprovado apenas se:
* Compilar sem erros.
* Possuir autenticação funcional.
* Possuir cadastro de usuário com auto-login funcional.
* Possuir SQLite funcional.
* Carregar a base a partir do CSV do projeto (data/Human_Resources.csv) via seed/scripts.
* Persistir profissionais no banco.
* Treinar um modelo de ML supervisionado (baseline + gradient boosting) para prever Attrition.
* Tratar o desbalanceamento de classes de forma explícita.
* Avaliar o modelo com ROC-AUC, PR-AUC, precision, recall, F1 e matriz de confusão (registrados em ModelRun).
* Gerar attritionProbability por profissional e derivar riskScore e riskLevel.
* Exibir indicadores de risco apenas para profissionais ativos (isActive), mantendo métricas históricas rotuladas como tal.
* Criar usuário demo (demo123 / demo123) via seed e exibi-lo na tela de login.
* Usar locale pt-BR e exibir valores monetários em USD de forma consistente.
* Tratar erros nas rotas de API de forma padronizada e ter estados de loading/erro/vazio nas telas.
* Rodar mesmo sem predições geradas (seed tolerante à ausência de data/predictions.csv).
* Explicar o modelo com SHAP (global) e preencher topRiskFactors por profissional (local).
* Persistir métricas e versão do modelo (ModelRun / modelVersion).
* Exibir landing page premium.
* Exibir dashboard dinâmico.
* Exibir gráficos filtráveis.
* Exibir lista de profissionais com filtros e ordenação.
* Exibir detalhe individual com fatores de risco (baseados em SHAP).
* Ser totalmente responsivo (mobile-first) sem overflow horizontal em 360px, 768px, 1024px e 1440px.
* Suportar tema claro e escuro com alternância persistida.
* Permitir ajuste de configurações de risco por qualquer usuário autenticado.
* Exibir /dataset com todas as colunas do CSV, paginação (25/50/100/200/500/1000) e download do CSV completo.
* Não permitir upload/importação manual de arquivos pela interface (carga somente via seed/scripts).
* Não usar dados mockados para indicadores principais.
* Possuir testes unitários passando com cobertura mínima na lógica de risco, métricas e CSV.
* Possuir testes Python cobrindo dados, features, treino, avaliação e scoring.
* Passar sem erros em ESLint, tsc --noEmit, Ruff e Pyright.
* Possuir documentação MkDocs funcional (mkdocs build sem erros).
* Parecer um produto real de People Analytics pronto para uso.
