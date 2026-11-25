---
name: desenvolver-funcionalidade
description: Fluxo obrigatório de 5 fases (análise, dúvidas, planejamento com aprovação, implementação incremental e verificação) para qualquer nova funcionalidade, alteração de regra ou correção estrutural no Nexus TI. Use antes de escrever código no backend Spring Boot (nexusti/) ou no frontend React (nexusti/frontend/).
---

# Desenvolver funcionalidade — Nexus TI

Siga as cinco fases na ordem. Não escreva nem edite código da aplicação antes de a fase 3 terminar com a aprovação explícita do usuário. Leia `CLAUDE.md` e `PRD.md` na raiz antes de começar.

## Fase 1 — Análise da Solicitação

Reescreva o pedido em uma frase e mapeie o impacto. Leia os arquivos existentes antes de concluir qualquer item.

**Backend (`nexusti/src/main/java/br/com/nexusti/`)**
- Entidade (`model/`): nova entidade ou novos campos; efeito no esquema, que é gerado por `ddl-auto=update`.
- Repository (`repository/`): consultas novas ou derivadas.
- Service (`service/`): regras de negócio e validações (`IllegalArgumentException` para 400, `AccessDeniedException` para 403).
- Controller (`controller/`): endpoints, verbos, parâmetros e `@PreAuthorize`.
- DTO (`dto/`) e `GlobalExceptionHandler`, se o contrato de resposta mudar.
- Security (`security/`): rotas públicas, perfis `ADMIN`, `TECNICO`, `USUARIO` e CORS.

**Frontend (`nexusti/frontend/src/`)**
- Componentes e páginas (`pages/`, `components/`).
- Serviços de API (`services/api.js`) e uso de `VITE_API_URL`.
- Rotas em `App.jsx` e menu em `LayoutAutenticado.jsx`, incluindo `RotaProtegida` e `RotaAdmin`.

Apresente o mapeamento como lista, marcando cada camada como "alterar", "criar" ou "sem impacto".

## Fase 2 — Identificação de Dúvidas e Ambiguidades

Liste tudo o que a análise deixou obscuro e pergunte ao usuário antes de avançar:
- regras de negócio (estados, limites, campos obrigatórios, validações);
- permissões: quais perfis veem, criam, editam e excluem;
- contrato JSON: nomes de campos, tipos, formato de datas, paginação, códigos de erro;
- impacto em dados existentes (colunas novas em tabelas preenchidas, valores padrão);
- comportamento da interface (filtros, mensagens, estados vazios, responsividade).

Faça perguntas objetivas, com uma sugestão de resposta padrão quando houver. Se não houver dúvida real, declare isso explicitamente. Não invente respostas nem prossiga com suposições silenciosas.

## Fase 3 — Planejamento

Produza o plano técnico com:
1. Objetivo e critérios de aceitação verificáveis.
2. Lista de arquivos a **criar** e a **modificar**, com o que muda em cada um.
3. Contrato dos endpoints (método, rota, perfis, corpo, respostas).
4. Ordem de implementação e riscos.
5. Plano de verificação (fase 5).

O plano deve respeitar o `CLAUDE.md`:
- zero comentários no código;
- zero mocks, dados fictícios ou massas de exemplo;
- zero segredos hardcoded: tudo por variáveis de ambiente;
- mudança mínima, estilo direto e modular;
- arquivos protegidos (`pom.xml`, `package.json`, `squarecloud.app`, `vercel.json`, `application.properties`) só mudam com pedido explícito.

**Pare e aguarde.** Só avance quando o usuário responder com aprovação explícita ("Aprovado"). Qualquer outra resposta, incluindo ajustes, exige revisar o plano e pedir aprovação de novo.

## Fase 4 — Implementação

Execute de forma incremental, validando cada etapa antes da próxima:
1. **Modelo e banco:** entidade, repository e, se necessário, atualização de `nexusti/database/schema.sql` e `nexusti/DATABASE.md`.
2. **Regras e API REST:** service com validações, controller com `@PreAuthorize`, DTOs, ajustes em `SecurityConfig` quando exigido.
3. **Interface React:** chamadas em `services/api.js`, páginas, componentes, rotas e menu.

Ao final de cada etapa, confirme que compila. Corrija na hora, sem acumular problemas. Não adicione comentários, mocks ou dependências não previstas no plano. Se surgir algo fora do plano, pare e consulte o usuário.

## Fase 5 — Verificação

Execute e reporte o resultado real de cada item, sem omitir falhas:

1. Backend, em `nexusti/`:
   ```powershell
   .\mvnw.cmd clean package -DskipTests
   ```
2. Frontend, em `nexusti/frontend/`:
   ```powershell
   npm run build
   ```
3. Suba a API com as variáveis de ambiente reais e teste cada endpoint novo ou alterado: caminho feliz, validação inválida (400), sem token (401/403) e perfil sem permissão (403).
4. Abra o frontend e percorra o fluxo alterado em cada perfil afetado.
5. Confirme ausência de erros no console do navegador e de erros de CORS nas requisições, incluindo o preflight `OPTIONS`.
6. Confira os critérios de aceitação do plano um a um e atualize `PRD.md` se requisitos ou regras de negócio mudaram.
7. Confirme que o diff não contém comentários, dados fictícios nem segredos.

Encerre com um resumo: o que foi feito, o que foi verificado, o que não pôde ser verificado e por quê.
