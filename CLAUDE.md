# CLAUDE.md — Guia para agentes de IA

Instruções para qualquer agente de IA que trabalhe neste repositório. O requisito funcional completo está em `PRD.md`; o dicionário de dados em `nexusti/DATABASE.md`.

## 1. Visão geral da arquitetura

Monorepo com duas aplicações independentes, ambas dentro da pasta `nexusti/`:

```
Projeto_FullStack/
├── PRD.md
├── CLAUDE.md
├── README.md
└── nexusti/
    ├── pom.xml
    ├── mvnw / mvnw.cmd
    ├── squarecloud.app
    ├── DATABASE.md
    ├── .env.example
    ├── src/main/java/br/com/nexusti/
    │   ├── controller/    endpoints REST (/api/...)
    │   ├── service/       regras de negócio e validações
    │   ├── repository/    interfaces Spring Data JPA
    │   ├── model/         entidades JPA
    │   ├── dto/           objetos de resposta
    │   ├── exception/     GlobalExceptionHandler
    │   └── security/      SecurityConfig, JwtFilter, JwtService, UserDetailsServiceImpl
    └── frontend/
        ├── vercel.json
        └── src/
            ├── pages/       telas (Dashboard, ListarChamados, AbrirChamado, VerChamado, Admin*)
            ├── components/  LayoutAutenticado, RotaAdmin, RotaPublica
            ├── services/    api.js (Axios)
            └── auth.js, prioridades.js
```

- Backend: API REST stateless, camadas `controller → service → repository`. A regra de negócio fica no `service`; o `controller` apenas orquestra e traduz para HTTP.
- Frontend: SPA React com React Router; todas as chamadas passam por `src/services/api.js`.
- Autenticação: JWT no cabeçalho `Authorization: Bearer <token>`; perfis `ADMIN`, `TECNICO` e `USUARIO`.

## 2. Stack tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Linguagem backend | Java | 21 |
| Framework backend | Spring Boot (WebMVC, Data JPA, Validation, Security) | 4.1.1 |
| JWT | JJWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) | 0.12.6 |
| Configuração por `.env` | springboot4-dotenv (BOM `spring-dotenv-bom`) | 5.1.0 |
| Banco de dados | PostgreSQL (driver JDBC oficial) | — |
| Build backend | Maven Wrapper (`mvnw`) | — |
| Boilerplate | Lombok | gerenciado pelo parent |
| Frontend | React / React DOM | ^18.3.1 |
| Roteamento | react-router-dom | ^6.23.0 |
| HTTP client | Axios | ^1.7.0 |
| Bundler | Vite + `@vitejs/plugin-react` | ^5.4.0 / ^4.3.0 |
| Node.js | recomendado 18 ou superior | — |

Se qualquer versão mudar em `pom.xml` ou `package.json`, atualize esta tabela.

## 3. Padrões de código

Estas regras são obrigatórias em qualquer alteração:

1. **Sem comentários.** Nenhum comentário inline, de bloco ou Javadoc/JSDoc. O código deve se explicar por nomes claros de classes, métodos e variáveis.
2. **Sem dados fictícios.** Não inserir usuários, e-mails, senhas, chamados ou massas de teste de exemplo no código-fonte, em seeds ou em fixtures.
3. **Sem segredos hardcoded.** URL do banco, usuário, senha e `JWT_SECRET` vêm exclusivamente de variáveis de ambiente (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`). Nunca versionar `.env`; mantenha apenas `.env.example` com valores em branco. A URL da API no frontend vem de `VITE_API_URL`.
4. **Estilo direto e modular.** Métodos pequenos com uma responsabilidade, sem abstrações especulativas, sem código morto, sem duplicação. Siga o estilo existente: nomes em português, `if` explícitos e uso de `== false` / `== true` já adotado no projeto.
5. **Validação no `service`.** Regras de negócio lançam `IllegalArgumentException` (vira `400`) ou `AccessDeniedException` (vira `403`), tratadas pelo `GlobalExceptionHandler`. Não retornar stack trace ao cliente.
6. **Segurança.** Operações administrativas usam `@PreAuthorize("hasAnyRole('ADMIN','TECNICO')")`. Senhas sempre com BCrypt. Não enfraquecer `SecurityConfig` nem o `CorsFilter`.
7. **Frontend.** Componentes funcionais, chamadas HTTP apenas via `services/api.js`, rotas protegidas por `RotaProtegida`, `RotaAdmin` e `RotaPublica`.
8. **Mudanças mínimas.** Altere somente o que a tarefa exige; não reformate arquivos inteiros nem renomeie em massa.
9. **Idioma.** Código, mensagens de erro e documentação em português do Brasil.

## 4. Comandos essenciais

O backend lê as credenciais de `nexusti/.env` (copie de `nexusti/.env.example`). Execute os comandos do backend dentro de `nexusti/` e os do frontend dentro de `nexusti/frontend/`.

### Backend (PowerShell, a partir de `nexusti/`)

```powershell
Copy-Item .env.example .env
```

```powershell
.\mvnw.cmd spring-boot:run
```

```powershell
.\mvnw.cmd clean package -DskipTests
```

```powershell
.\mvnw.cmd test
```

```powershell
java -jar target/nexusti-0.0.1-SNAPSHOT.jar
```

A API sobe em `http://localhost:8080` (ou na porta definida em `PORT`).

### Frontend (a partir de `nexusti/frontend/`)

```powershell
npm install
```

```powershell
npm run dev
```

```powershell
npm run build
```

```powershell
npm run preview
```

O servidor de desenvolvimento do Vite sobe em `http://localhost:5173`. Para apontar para outra API, defina `VITE_API_URL` (padrão: `http://localhost:8080/api`).

> Observação: a origem `localhost:5173` não está na lista de CORS do `SecurityConfig` (apenas `https://nexusti-frontend.vercel.app`). Ao rodar o frontend local contra o backend local, é necessário liberar essa origem — somente se o usuário pedir.

## 5. Fluxo de deploy

| Parte | Plataforma | Como |
|---|---|---|
| Frontend | Vercel | Projeto apontando para `nexusti/frontend`; build `npm run build`, saída `dist`. `vercel.json` reescreve todas as rotas para `/index.html` (SPA). Variável `VITE_API_URL` aponta para a API publicada. |
| Backend | Square Cloud | Gerar o JAR com `.\mvnw.cmd clean package -DskipTests`, empacotar e enviar com o arquivo `nexusti/squarecloud.app`. |

`squarecloud.app` define: `DISPLAY_NAME=Nexus TI`, `MAIN=target/nexusti-0.0.1-SNAPSHOT.jar`, `MEMORY=512`, `SUBDOMAIN=nexusti-api`, `AUTORESTART=true`. As variáveis `DB_URL`, `DB_USER`, `DB_PASSWORD` e `JWT_SECRET` são configuradas no painel da Square Cloud, nunca no repositório.

Ordem recomendada: publicar o backend, confirmar que a API responde, depois publicar o frontend com `VITE_API_URL` apontando para o subdomínio da API.

## 6. Arquivos protegidos

Não alterar, mover ou excluir sem pedido explícito do usuário: `pom.xml`, `package.json`, `squarecloud.app`, `vercel.json`, `application.properties` e qualquer arquivo `.env`.
