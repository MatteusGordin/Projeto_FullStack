# PRD — Nexus TI

Product Requirements Document do sistema **Nexus TI**, elaborado a partir do que está implementado no repositório (backend Spring Boot em `nexusti/` e frontend React/Vite em `nexusti/frontend/`).

## 1. Definição do Projeto

| Item | Descrição |
|---|---|
| Nome | Nexus TI — Sistema de HelpDesk |
| Objetivo | Centralizar o registro, a triagem e o acompanhamento de chamados de manutenção de equipamentos de TI, do momento da abertura até a conclusão com solução registrada. |
| Público-alvo | Colaboradores de qualquer setor que precisam relatar problemas de TI (perfil `USUARIO`); equipe de suporte que atende os chamados (perfil `TECNICO`); gestores responsáveis pela governança do sistema (perfil `ADMIN`). |
| Problema que resolve | Solicitações de suporte feitas de forma informal (mensagens, ligações, recados) não deixam rastro, não têm prioridade definida, não se vinculam ao equipamento afetado e não permitem medir volume de atendimento. O Nexus TI padroniza o fluxo e mantém o histórico. |

### 1.1 Perfis de acesso

| Perfil | Capacidades |
|---|---|
| `USUARIO` | Abre chamados e consulta apenas os chamados de sua autoria. Pode ajustar equipamento, título, descrição e prioridade do próprio chamado, mas não altera status nem conclui. |
| `TECNICO` | Visualiza todos os chamados, altera status, conclui chamados com solução, gerencia setores, equipamentos, prioridades e usuários (exceto acessos de nível `ADMIN`). |
| `ADMIN` | Todas as capacidades do técnico, incluindo gerenciar usuários de nível `ADMIN`. |

### 1.2 Escopo de telas (frontend)

| Rota | Tela | Acesso |
|---|---|---|
| `/login` | Autenticação | Público |
| `/` | Dashboard de métricas | Autenticado |
| `/chamados` | Listagem e filtros de chamados | Autenticado |
| `/novo` | Abertura de chamado | Autenticado |
| `/chamado/:id` | Detalhe e conclusão do chamado | Autenticado |
| `/admin/setores` | Cadastro de setores | Equipe (`ADMIN`/`TECNICO`) |
| `/admin/equipamentos` | Cadastro de equipamentos | Equipe |
| `/admin/usuarios` | Cadastro de usuários | Equipe |
| `/admin/prioridades` | Cadastro de prioridades | Equipe |
| `*` | Página não encontrada | Público |

## 2. Requisitos Funcionais

### RF01 — Autenticação com JWT
O sistema autentica o usuário por e-mail e senha (`POST /api/auth/login`), devolve um token JWT e permite consultar o perfil logado (`GET /api/auth/perfil`). Existe ainda `POST /api/auth/bootstrap` para criar o primeiro usuário quando a base está vazia.

**Critérios de aceitação**
- Credenciais válidas retornam `200` com o campo `token`.
- Credenciais inválidas ou usuário inativo retornam `401`.
- E-mail ou senha vazios retornam `400` com a mensagem "Informe email e senha".
- `GET /api/auth/perfil` com token válido retorna `id`, `email`, `nome`, `perfil` e `idSetor`.
- `bootstrap` retorna `409` quando já existe qualquer usuário cadastrado.
- Sem token, qualquer rota fora de `login` e `bootstrap` retorna `401`/`403`; no frontend o usuário é redirecionado para `/login`.

### RF02 — Abertura de chamado
Usuário autenticado abre um chamado informando título, descrição, equipamento e, opcionalmente, prioridade (`POST /api/chamados`, tela `/novo`).

**Critérios de aceitação**
- Título com 3 a 100 caracteres e descrição com 5 a 2000 caracteres são obrigatórios; fora disso retorna `400`.
- Solicitante e equipamento são obrigatórios.
- O chamado é criado com status `ABERTO` e `dataAbertura` preenchida automaticamente.
- Prioridade informada que não exista no catálogo ativo é rejeitada com "Prioridade invalida".
- A resposta retorna `201` com os dados do chamado, incluindo nome do solicitante e do setor.

### RF03 — Listagem, filtro e consulta de chamados
O sistema lista chamados paginados (`GET /api/chamados`) com filtros por status, prioridade, setor e período, e permite consultar um chamado (`GET /api/chamados/{id}`).

**Critérios de aceitação**
- Sem ordenação explícita, a lista vem ordenada por status e por data de abertura decrescente.
- Os filtros `status`, `prioridade`, `idSetor`, `dataInicio` e `dataFim` podem ser combinados.
- Período ou setor inválido retorna `400`.
- `USUARIO` enxerga apenas chamados em que é solicitante; `TECNICO` e `ADMIN` enxergam todos.
- Consulta de chamado inexistente ou fora do alcance do usuário retorna `404`.

### RF04 — Atualização e conclusão de chamado
Equipe técnica altera status, prioridade, técnico responsável e equipamento (`PUT /api/chamados/{id}`) e conclui o chamado com solução (`PUT /api/chamados/{id}/concluir`).

**Critérios de aceitação**
- Concluir exige solução com no mínimo 5 caracteres; caso contrário retorna `400` com "Solucao obrigatoria para concluir o chamado".
- Ao concluir, o status passa a `FECHADO` e `dataFechamento` é preenchida.
- `USUARIO` que tenta alterar status ou concluir recebe `403`.
- O endpoint `/concluir` é restrito a `ADMIN` e `TECNICO`.
- Chamado pode ser excluído (`DELETE /api/chamados/{id}`) por quem tem acesso a ele; sucesso retorna `204`.

### RF05 — Histórico do chamado
O sistema registra mensagens de acompanhamento vinculadas a um chamado e a um usuário (`/api/historicos`).

**Critérios de aceitação**
- Mensagem com 3 a 2000 caracteres, chamado e usuário são obrigatórios.
- Registro de histórico inexistente retorna `404` na consulta, atualização e exclusão.
- Criação válida retorna `201`.

### RF06 — Controle de ativos (equipamentos)
Equipe cadastra, edita, lista e remove equipamentos com patrimônio, tipo, marca, modelo e setor (`/api/equipamentos`, tela `/admin/equipamentos`). A abertura de chamado consome a lista de opções (`/api/equipamentos/opcoes`).

**Critérios de aceitação**
- Patrimônio, tipo, marca, modelo e setor são obrigatórios; ausência retorna `400`.
- Criar, editar e excluir exigem `ADMIN` ou `TECNICO`; `USUARIO` recebe `403`.
- Qualquer usuário autenticado consegue listar as opções de equipamento.
- Equipamento inexistente retorna `404`.

### RF07 — Gestão de setores
Equipe gerencia os setores da organização (`/api/setores`, tela `/admin/setores`).

**Critérios de aceitação**
- Nome (2 a 100 caracteres) e sigla (2 a 20 caracteres) são obrigatórios.
- Criar, editar e excluir exigem `ADMIN` ou `TECNICO`.
- `GET /api/setores/opcoes` está disponível para qualquer usuário autenticado.

### RF08 — Gestão de usuários e perfis de acesso
Equipe cadastra, edita, ativa/inativa e remove usuários com perfil `ADMIN`, `TECNICO` ou `USUARIO` (`/api/usuarios`, tela `/admin/usuarios`).

**Critérios de aceitação**
- Nome com no mínimo 3 caracteres, e-mail válido e único, perfil dentro dos três valores permitidos e setor informado são obrigatórios.
- Senha com no mínimo 4 caracteres na criação; na edição, senha vazia mantém o hash atual.
- Senha é persistida com hash BCrypt, nunca em texto claro.
- `TECNICO` não cria, edita nem promove usuários ao nível `ADMIN`; tentativa retorna `403`.
- Usuário com `ativo = false` não consegue autenticar e seus tokens já emitidos deixam de ser aceitos.
- Operações de listagem, consulta, criação, edição e exclusão exigem `ADMIN` ou `TECNICO`.

### RF09 — Catálogo de prioridades
Equipe gerencia as prioridades usadas nos chamados com nome, cor, ordem e situação ativa (`/api/prioridades`, tela `/admin/prioridades`).

**Critérios de aceitação**
- Nome com 2 a 30 caracteres e único; duplicidade retorna `400` com "Prioridade ja cadastrada".
- Cor com no máximo 20 caracteres.
- Criar, editar e excluir exigem `ADMIN` ou `TECNICO`.
- `GET /api/prioridades/opcoes` alimenta os formulários e filtros do frontend.

### RF10 — Dashboard de métricas
A tela inicial exibe total de chamados abertos e fechados (`GET /api/chamados/metricas`), distribuição por prioridade (`GET /api/chamados/metricas/prioridades`) e os cinco chamados mais recentes.

**Critérios de aceitação**
- As métricas respeitam o perfil: `USUARIO` vê números apenas dos próprios chamados; equipe vê o total geral.
- A resposta de `metricas` contém as chaves `abertos` e `fechados`.
- Os chamados recentes são ordenados por `dataAbertura` decrescente, limitados a 5.

## 3. Requisitos Não Funcionais

### RNF01 — API REST stateless com segurança JWT
A API usa Spring Security com `SessionCreationPolicy.STATELESS`, filtro JWT (`JwtFilter`) executado antes do filtro de autenticação padrão e CSRF desabilitado por não haver sessão.
**Verificação:** nenhuma sessão HTTP é criada; toda rota, exceto `/api/auth/login` e `/api/auth/bootstrap`, exige `Authorization: Bearer <token>`.

### RNF02 — Autorização por perfil
Controle de acesso em nível de método com `@EnableMethodSecurity` e `@PreAuthorize("hasAnyRole('ADMIN','TECNICO')")` nas operações administrativas.
**Verificação:** `USUARIO` recebe `403` ao chamar operações administrativas.

### RNF03 — Segurança de credenciais
Senhas armazenadas com BCrypt; segredo do JWT, URL e credenciais do banco lidos de variáveis de ambiente (`JWT_SECRET`, `DB_URL`, `DB_USER`, `DB_PASSWORD`), nunca versionados.
**Verificação:** `application.properties` contém apenas placeholders `${...}`; o arquivo `.env` não é versionado.

### RNF04 — Persistência relacional
Banco PostgreSQL com acesso via Spring Data JPA/Hibernate; esquema gerenciado por `spring.jpa.hibernate.ddl-auto=update`. Entidades: Setor, Usuario, Equipamento, Chamado, Prioridade e HistoricoChamado (ver `nexusti/DATABASE.md`).
**Verificação:** a aplicação sobe contra uma instância PostgreSQL vazia e cria as tabelas automaticamente.

### RNF05 — Separação frontend/backend e CORS
Frontend SPA (React + Vite) independente do backend, comunicando-se por HTTP/JSON via Axios. O backend libera CORS por `CorsFilter` global de alta precedência para a origem `https://nexusti-frontend.vercel.app`, com credenciais, todos os métodos e cabeçalhos.
**Verificação:** requisições `OPTIONS` (preflight) são respondidas sem autenticação; origens não liberadas são bloqueadas pelo navegador.

### RNF06 — Tratamento padronizado de erros
`GlobalExceptionHandler` converte exceções em respostas JSON com mensagem: `400` (validação e regra de negócio), `401` (credenciais inválidas ou usuário inativo), `403` (acesso negado).
**Verificação:** nenhuma resposta de erro expõe stack trace ao cliente.

### RNF07 — Responsividade e usabilidade
Interface com menu lateral recolhível (`LayoutAutenticado`) que se adapta a telas pequenas, rotas protegidas e redirecionamento automático ao login quando o token expira (resposta `401` interceptada em `services/api.js`).
**Verificação:** as telas permanecem utilizáveis em viewport mobile; token inválido leva o usuário a `/login`.

### RNF08 — Portabilidade e implantação
Backend empacotado como JAR (Java 21) e executado na Square Cloud; frontend publicado na Vercel com reescrita de todas as rotas para `index.html` (`vercel.json`), permitindo navegação direta por URL em SPA. A porta do servidor vem de `PORT` (padrão `8080`).
**Verificação:** acesso direto a `/chamados` no frontend publicado não retorna `404`.

### RNF09 — Paginação
Listagens do backend aceitam `Pageable` (`page`, `size`, `sort`), evitando carregar todo o conjunto de dados.
**Verificação:** `GET /api/chamados?page=0&size=5` retorna uma `Page` com no máximo 5 itens.

## 4. Regras de Negócio

| ID | Regra |
|---|---|
| RN01 | Todo chamado nasce com status `ABERTO`; a data de abertura é definida pelo servidor. |
| RN02 | Um chamado só pode ser concluído por `ADMIN` ou `TECNICO` e exige solução com no mínimo 5 caracteres; a conclusão define status `FECHADO` e data de fechamento. |
| RN03 | `USUARIO` só enxerga, lista, filtra e contabiliza nas métricas os chamados dos quais é solicitante. `ADMIN` e `TECNICO` têm acesso amplo. |
| RN04 | Somente `ADMIN` e `TECNICO` podem alterar o status de um chamado; `USUARIO` pode editar apenas título, descrição, prioridade e equipamento do próprio chamado. |
| RN05 | A prioridade de um chamado deve existir no catálogo de prioridades (quando o catálogo não está vazio); a prioridade já gravada em chamado antigo é preservada na edição. |
| RN06 | O nome de uma prioridade é único; a cor tem no máximo 20 caracteres. |
| RN07 | O e-mail do usuário é único e funciona como credencial de login; o perfil deve ser `ADMIN`, `TECNICO` ou `USUARIO`. |
| RN08 | `TECNICO` não pode criar, editar, promover ou excluir usuários de nível `ADMIN`. |
| RN09 | Não é permitido remover ou rebaixar o último administrador ativo, nem excluí-lo. |
| RN10 | Usuário inativo (`ativo = false`) não autentica e tem os tokens já emitidos recusados. |
| RN11 | Todo chamado deve estar vinculado a um solicitante e a um equipamento; todo equipamento e todo usuário pertencem a um setor. |
| RN12 | O primeiro usuário só pode ser criado pelo endpoint `bootstrap` enquanto a base estiver vazia, e assume perfil `ADMIN` (ou `TECNICO` se explicitamente informado). |
| RN13 | Filtro por setor em chamados considera o setor do solicitante; setor sem usuários retorna lista vazia. |
| RN14 | Senha em edição de usuário é opcional: vazia mantém o hash atual; informada, é novamente protegida com BCrypt. |
