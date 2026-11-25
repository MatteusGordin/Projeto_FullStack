# Plano Inicial — Nexus TI

Planejamento arquitetural e de execução do Nexus TI, derivado do [PRD.md](../../PRD.md). Descreve as decisões e a ordem em que o sistema foi construído, em cinco fases. O histórico do repositório mostra a evolução entre agosto e outubro de 2026.

## Visão geral

| Fase | Foco | Requisitos do PRD |
|---|---|---|
| 1 | Modelagem de dados e configuração base | RNF04 |
| 2 | Segurança e autenticação stateless | RF01, RNF01, RNF02, RNF03, RNF05, RNF06 |
| 3 | Módulos core: chamados, ativos e usuários | RF02 a RF09 |
| 4 | Interface web e integração | RF10, RNF07 |
| 5 | Produção, deploy e validação de usabilidade | RNF08, RNF09 |

---

## Fase 1 — Modelagem de Dados e Configuração Base (Spring Boot + PostgreSQL)

**Objetivo:** ter o projeto compilando, conectado ao PostgreSQL e com o modelo de dados definido.

**Entregas**
- Projeto Maven com Spring Boot 4.1.1, Java 21, Spring Data JPA, Validation, WebMVC, Security, JJWT 0.12.6 e Lombok.
- Entidades JPA: `Setor`, `Usuario`, `Equipamento`, `Chamado`, `HistoricoChamado` e `Prioridade`, com chaves inteiras autoincrementais.
- Repositories Spring Data para cada entidade, com consultas derivadas necessárias (por e-mail, por setor, contagem por status).
- Script `nexusti/database/schema.sql` e dicionário de dados em `nexusti/DATABASE.md`.
- Configuração por variáveis de ambiente (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`) via `.env`, com `.env.example` sem valores reais; esquema gerenciado por `ddl-auto=update`.

**Decisões**
- Relacionamentos por chave estrangeira simples (`idSetor`, `idSolicitante`, `idEquipamento`) em vez de associações JPA, mantendo as entidades planas e fáceis de serializar.
- Validações declarativas (`@NotBlank`, `@Size`, `@Email`, `@NotNull`) nas entidades.

**Critério de saída:** a aplicação sobe contra um PostgreSQL vazio e cria as tabelas.

---

## Fase 2 — Segurança e Autenticação Stateless (Spring Security + JWT + CORS)

**Objetivo:** proteger toda a API e identificar o perfil do usuário em cada requisição.

**Entregas**
- `SecurityConfig` com sessão `STATELESS`, CSRF desabilitado, rotas públicas apenas em `/api/auth/login` e `/api/auth/bootstrap`, e `@EnableMethodSecurity`.
- `JwtService` (geração e validação do token) e `JwtFilter` executado antes do filtro de autenticação padrão; o filtro recusa usuários inativos.
- `UserDetailsServiceImpl`, com `Usuario` implementando `UserDetails` e perfis expostos como `ROLE_ADMIN`, `ROLE_TECNICO` e `ROLE_USUARIO`.
- Senhas com `BCryptPasswordEncoder`.
- `AuthController`: `login`, `perfil` e `bootstrap` (primeiro usuário, apenas com base vazia).
- `CorsFilter` global de alta precedência, liberando a origem do frontend publicado, com credenciais, métodos e cabeçalhos.
- `GlobalExceptionHandler` convertendo exceções em `400`, `401` e `403` com mensagem JSON.

**Decisões**
- CORS tratado em filtro de precedência máxima para que o preflight `OPTIONS` seja respondido antes da cadeia de segurança. Essa decisão veio de falhas de CORS em produção.
- Autorização em duas camadas: `@PreAuthorize` nas operações administrativas e regras de visibilidade nos services.

**Critério de saída:** sem token a API retorna `401`/`403`; com token válido, cada perfil acessa apenas o que lhe é permitido.

---

## Fase 3 — Desenvolvimento dos Módulos Core (Chamados, Ativos e Usuários)

**Objetivo:** implementar as regras de negócio do PRD em services e controllers.

**Ordem de implementação**
1. **Cadastros de apoio:** `Setor` e `Prioridade` (CRUD, endpoints `/opcoes`, unicidade do nome da prioridade).
2. **Ativos:** `Equipamento` com patrimônio, tipo, marca, modelo e setor.
3. **Usuários:** `UsuarioService` com validação de nome, e-mail único, perfil permitido, setor e senha; ativação/inativação; proteção do último administrador; restrição para o técnico não gerenciar `ADMIN`.
4. **Chamados:**
   - abertura com status `ABERTO` e data automática;
   - listagem paginada com filtros combináveis (status, prioridade, setor, período), por `Specification`;
   - segregação de dados: `USUARIO` vê apenas os próprios chamados;
   - alteração de status restrita à equipe;
   - conclusão com solução mínima de 5 caracteres e data de fechamento;
   - métricas de abertos, fechados e por prioridade.
5. **Histórico:** `HistoricoChamado` com mensagem, chamado e usuário.

**Critério de saída:** todos os critérios de aceitação de RF02 a RF09 do PRD atendidos nos endpoints, incluindo os códigos `400`, `403` e `404`.

---

## Fase 4 — Interface Web e Integração (React + Consumo de API)

**Objetivo:** entregar a SPA que consome a API para todos os perfis.

**Entregas**
- Projeto Vite com React 18, React Router 6 e Axios.
- `services/api.js` com `baseURL` vinda de `VITE_API_URL`, timeout e interceptador que limpa o token e redireciona ao login em `401`.
- `auth.js` para guarda do token; `RotaProtegida`, `RotaPublica` e `RotaAdmin` para controle de acesso por rota.
- `LayoutAutenticado` com menu lateral recolhível (responsivo), exibindo itens administrativos apenas para a equipe.
- Telas: `Login`, `Dashboard`, `ListarChamados` (filtros e paginação), `AbrirChamado`, `VerChamado` (detalhe e conclusão), `AdminSetores`, `AdminEquipamentos`, `AdminUsuarios`, `AdminPrioridades` e `NotFound`.
- Tratamento de carregamento, vazio e erro em cada tela.

**Critério de saída:** cada fluxo do PRD pode ser executado pela interface por cada perfil, sem erros de console nem de CORS.

---

## Fase 5 — Preparação para Produção, Deploy e Validação de Usabilidade (SUS)

**Objetivo:** publicar o sistema e medir a usabilidade com usuários reais.

**Deploy**
- Backend: JAR gerado com `.\mvnw.cmd clean package -DskipTests` e publicado na Square Cloud com `squarecloud.app` (`MEMORY=512`, `SUBDOMAIN=nexusti-api`, `AUTORESTART=true`). Variáveis de ambiente configuradas no painel.
- Frontend: publicado na Vercel; `vercel.json` reescreve todas as rotas para `index.html`. `VITE_API_URL` aponta para a API publicada.
- Banco: PostgreSQL hospedado (por exemplo Supabase), acessado por `DB_URL`.
- Smoke test pós-deploy: login, abertura de chamado, conclusão por técnico e carregamento direto de uma rota interna.

**Validação de usabilidade (System Usability Scale)**
1. **Amostra:** voluntários dos três perfis (`USUARIO`, `TECNICO`, `ADMIN`).
2. **Tarefas roteirizadas:**
   - usuário: entrar, abrir um chamado e acompanhar o status;
   - técnico: filtrar chamados, alterar status e concluir com solução;
   - administrador: cadastrar setor, equipamento e usuário.
3. **Questionário SUS:** 10 afirmações em escala de 1 a 5, aplicado após as tarefas.
4. **Cálculo:** para itens ímpares, pontuação menos 1; para itens pares, 5 menos a pontuação; soma multiplicada por 2,5, resultando em nota de 0 a 100. Referência de mercado: acima de 68 é considerado acima da média.
5. **Registro:** tempo por tarefa, erros e observações qualitativas.
6. **Ações:** priorizar ajustes de interface para as tarefas com maior taxa de erro e reaplicar o teste após as correções.

**Critério de saída:** sistema acessível em produção, smoke test aprovado e relatório SUS com nota média e lista de melhorias priorizadas. Os resultados do SUS ainda não estão registrados neste repositório e devem ser anexados a este plano quando a coleta for concluída.
