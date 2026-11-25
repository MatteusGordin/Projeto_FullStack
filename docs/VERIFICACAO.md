# Verificação Técnica — Etapa 6

Auditoria realizada em 25/11/2026 sobre o repositório `Projeto_FullStack`, sem alteração do código-fonte funcional. Os únicos arquivos criados pela etapa são documentação em Markdown.

## 1. Entregáveis

| Entregável | Caminho | Existe | Conformidade |
|---|---|---|---|
| PRD | `PRD.md` | Sim | Definição do projeto, 10 RF com critérios de aceitação, 9 RNF e 14 RN. Atende o mínimo de 6 RF, 4 RNF e 4 RN. |
| Guia para agentes | `CLAUDE.md` | Sim | Arquitetura, stack com versões, padrões de código, comandos de build/teste/execução e fluxo de deploy. |
| Skill | `.claude/skills/desenvolver-funcionalidade/SKILL.md` | Sim | Frontmatter com `name: desenvolver-funcionalidade` e `description`; 5 fases (análise, dúvidas, planejamento com aprovação, implementação, verificação). |
| Plano inicial | `docs/plans/PLANO-INICIAL.md` | Sim | 5 fases: dados, segurança, módulos core, interface, produção e SUS. |

## 2. Builds e integridade

| Verificação | Comando | Resultado |
|---|---|---|
| Backend | `cd nexusti; .\mvnw.cmd clean package -DskipTests` | **BUILD SUCCESS** em 7,8 s. 32 classes compiladas com Java 21; JAR `target/nexusti-0.0.1-SNAPSHOT.jar` gerado e reempacotado pelo Spring Boot 4.1.1. |
| Frontend | `cd nexusti/frontend; npm run build` | **Sucesso** em 1,3 s (Vite 5.4.21). 105 módulos transformados; JS 261,04 kB (81,66 kB gzip) e CSS 7,53 kB. |
| Auditoria de dependências | `npm audit --omit=dev` | **3 vulnerabilidades** (1 alta, 2 moderadas). Uma delas é no React Router (open redirect via barra invertida em `<Link>` e `useNavigate`, GHSA-wrjc-x8rr-h8h6). As demais não foram detalhadas. Nenhuma correção foi aplicada. |
| Testes automatizados | `mvnw.cmd clean package -DskipTests` | **Não executados** por instrução do comando. Existe apenas `NexustiApplicationTests` (teste de contexto), que depende de banco e variáveis de ambiente. |
| Lint do frontend | — | Não há script de lint em `package.json` (apenas `dev`, `build` e `preview`). |

## 3. Status dos requisitos do PRD

Legenda: **Implementado** = há código correspondente no backend e/ou frontend, conferido por leitura. Nenhum requisito foi exercitado por teste automatizado nem por chamada autenticada nesta auditoria.

| Requisito | Status | Evidência |
|---|---|---|
| RF01 Autenticação JWT | Implementado | `AuthController` (`login`, `perfil`, `bootstrap`), `JwtService`, `JwtFilter`, tela `Login`. |
| RF02 Abertura de chamado | Implementado | `ChamadoController.criar`, `ChamadoService.salvar`, tela `AbrirChamado`. |
| RF03 Listagem e filtros | Implementado | `ChamadoService.listarFiltrado`, tela `ListarChamados`. |
| RF04 Atualização e conclusão | Implementado | `ChamadoController.atualizar` e `concluir`, tela `VerChamado`. |
| RF05 Histórico | Implementado no backend | `HistoricoChamadoController`. Nenhuma tela do frontend consome `/historicos`. |
| RF06 Equipamentos | Implementado | `EquipamentoController`, tela `AdminEquipamentos`. |
| RF07 Setores | Implementado | `SetorController`, tela `AdminSetores`. |
| RF08 Usuários e perfis | Implementado | `UsuarioController`, `UsuarioService`, tela `AdminUsuarios`. |
| RF09 Prioridades | Implementado | `PrioridadeController`, tela `AdminPrioridades`. |
| RF10 Dashboard | Implementado | `ChamadoController.metricas`, tela `Dashboard`. |
| RNF01 a RNF03 Segurança | Implementado | `SecurityConfig` stateless, `@EnableMethodSecurity`, BCrypt, segredos por variável de ambiente. |
| RNF04 PostgreSQL/JPA | Implementado | `application.properties`, entidades e `schema.sql`. |
| RNF05 CORS | Verificado em produção | Ver seção 4. |
| RNF06 Erros padronizados | Implementado | `GlobalExceptionHandler`. |
| RNF07 Responsividade | Implementado, não testado | Menu recolhível em `LayoutAutenticado`; sem teste em dispositivo. |
| RNF08 Deploy | Verificado em produção | Ver seção 4. |
| RNF09 Paginação | Implementado | `Pageable` nos controllers de listagem. |

## 4. Arquitetura em produção

Requisições feitas durante a auditoria, sem credenciais:

| Alvo | Requisição | Resultado | Leitura |
|---|---|---|---|
| Frontend | `GET https://nexusti-frontend.vercel.app` | 200 | Frontend publicado e acessível. |
| Frontend | `GET https://nexusti-frontend.vercel.app/chamados` | 200 | Rewrite SPA do `vercel.json` funcionando em rota interna. |
| API | `GET https://nexusti-api.squareweb.app/api/auth/perfil` | 403 | API no ar e protegida: rota autenticada sem token é recusada. |
| API | `OPTIONS /api/auth/login` com `Origin: https://nexusti-frontend.vercel.app` | 200, `Access-Control-Allow-Origin` igual à origem do frontend | Preflight CORS respondido corretamente. |

O endereço da API foi inferido de `SUBDOMAIN=nexusti-api` em `squarecloud.app` e respondeu, o que confirma o host. Os fluxos autenticados (login, abertura e conclusão de chamado) não foram testados em produção porque exigiriam credenciais reais, e a auditoria não as utilizou.

## 5. Estado do repositório

- Código-fonte da aplicação: sem alterações.
- Arquivos novos (não versionados até o momento): `PRD.md`, `CLAUDE.md`, `.claude/`, `docs/`.
- Os diretórios `target/` e `dist/` gerados pelos builds estão cobertos pelo `.gitignore`.

## 6. Pendências e riscos

1. **Dependências vulneráveis no frontend** (React Router e outras 2). Avaliar `npm audit fix` em uma tarefa separada, pois altera `package-lock.json`.
2. **Sem testes automatizados** além do teste de contexto. A cobertura das regras de negócio do PRD depende de verificação manual.
3. **Sem lint** no frontend.
4. **RF05**: o histórico existe na API, mas a interface não o exibe.
5. **Fluxos autenticados em produção** não validados nesta auditoria; recomenda-se um smoke test manual com usuário de teste (login, abrir chamado, concluir).
6. **Validação SUS** ainda sem resultados registrados (ver `docs/plans/PLANO-INICIAL.md`).
7. `application.properties` mantém `spring.jpa.show-sql=true`, que imprime SQL no log em produção.

## 7. Conclusão

Os quatro entregáveis existem e estão conformes. O backend e o frontend compilam sem erros, e a arquitetura publicada responde como esperado: frontend servido pela Vercel com rewrite de SPA, API protegida na Square Cloud e CORS liberado para a origem do frontend. As pendências da seção 6 não impedem o funcionamento atual.
