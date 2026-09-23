# Nexus TI — Sistema de HelpDesk Omnichannel

Sistema web para registro, triagem e acompanhamento de chamados de manutenção de equipamentos de TI. O solicitante abre um chamado vinculado a um equipamento e setor, e a equipe técnica atualiza status, prioridade e histórico até o encerramento.

O projeto foi desenvolvido como trabalho acadêmico da disciplina de Desenvolvimento Full Stack, com arquitetura separada em backend REST segurizado e frontend SPA, e banco de dados relacional PostgreSQL.

## Arquitetura

```
nexusti/
├── src/main/java/br/com/nexusti/   # Backend (Spring Boot)
│   ├── controller/                 # Auth, Setor, Usuario, Equipamento, Chamado, HistoricoChamado
│   ├── service/                    # Regras de negócio e validações
│   ├── repository/                 # Spring Data JPA
│   ├── model/                      # Entidades JPA
│   └── security/                   # JWT (JwtService, JwtFilter, SecurityConfig)
├── src/main/resources/             # application.properties
├── frontend/                       # Frontend (React + Vite)
│   ├── src/                        # Páginas, componentes, serviços Axios
│   └── vite.config.js
├── database/                       # Scripts SQL de apoio
├── .env.example                    # Variáveis de ambiente do backend
├── DATABASE.md                     # Dicionário de dados
└── pom.xml                         # Dependências Maven
```

## Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 4.1.1 (WebMVC, Data JPA, Validation, Security)
- PostgreSQL (driver JDBC oficial)
- JWT com JJWT 0.12.6 (jjwt-api, jjwt-impl, jjwt-jackson)
- BCrypt (PasswordEncoder do Spring Security para hash de senhas)
- Lombok
- Maven Wrapper (`mvnw` / `mvnw.cmd`)

### Frontend
- React 18.3.1
- Vite 5.4.0 (@vitejs/plugin-react 4.3.0)
- React Router DOM 6.23.0
- Axios 1.7.0

### Banco de Dados
- PostgreSQL (hospedável em Supabase ou instância local)
- DDL gerenciado pelo Hibernate (`spring.jpa.hibernate.ddl-auto=update`)
- 5 tabelas: Setor, Usuario, Equipamento, Chamado, HistoricoChamado (detalhes em `DATABASE.md`)

## Pré-requisitos

- JDK 21 instalado
- Maven (ou utilize o Maven Wrapper incluso)
- Node.js 18+ e npm
- Instância PostgreSQL acessível (local, Docker ou Supabase)

## Como Rodar o Backend

O backend lê a conexão com o banco exclusivamente via variáveis de ambiente, definidas em um arquivo `.env` na raiz do projeto.

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

2. Edite o arquivo `.env` com as credenciais do seu banco:

```env
DB_URL=jdbc:postgresql://localhost:5432/nexusti
DB_USER=postgres
DB_PASSWORD=sua_senha
```

Para Supabase, utilize a URL de conexão direta (porta 5432) fornecida no painel do projeto.

3. Execute a aplicação:

```bash
./mvnw spring-boot:run
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

4. O servidor subirá em:

```
http://localhost:8080
```

O Hibernate criará/atualizará automaticamente as tabelas na primeira execução (`ddl-auto=update`). Os endpoints REST ficam disponíveis sob o prefixo `/api`.

## Como Rodar o Frontend

1. Acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a URL da API. Copie o exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

Conteúdo esperado (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8080
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse a URL exibida no terminal, por padrão:

```
http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build
```

## Primeiro Acesso — Criando o Administrador (Bootstrap)

Por segurança, todas as rotas da API exigem autenticação JWT, exceto `POST /api/auth/login` e `POST /api/auth/bootstrap`. A rota de bootstrap funciona somente quando o banco ainda não possui nenhum usuário, e serve para criar o primeiro administrador do sistema.

Endpoint:

```
POST http://localhost:8080/api/auth/bootstrap
Content-Type: application/json
```

Exemplo de corpo (cURL):

```bash
curl -X POST http://localhost:8080/api/auth/bootstrap \
  -H "Content-Type: application/json" \
  -d "{\"nome\": \"Administrador\", \"email\": \"admin@nexusti.com\", \"senha\": \"admin123\", \"perfil\": \"ADMIN\", \"idSetor\": 1}"
```

Exemplo via Postman ou Insomnia:

- Método: `POST`
- URL: `http://localhost:8080/api/auth/bootstrap`
- Header: `Content-Type: application/json`
- Body (JSON):

```json
{
  "nome": "Administrador",
  "email": "admin@nexusti.com",
  "senha": "admin123",
  "perfil": "ADMIN",
  "idSetor": 1
}
```

Comportamento esperado:

- Primeira chamada com banco vazio: retorna `201 Created` com o usuário persistido (senha já armazenada como hash BCrypt).
- Chamadas subsequentes: retornam `409 Conflict` com a mensagem `Sistema ja possui usuarios cadastrados`.

Após o bootstrap, autentique-se em `POST /api/auth/login` para obter o token JWT:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"admin@nexusti.com\", \"senha\": \"admin123\"}"
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

Utilize o token nas requisições seguintes com o header:

```
Authorization: Bearer <token>
```

## Perfis de Acesso

| Perfil | Authority JWT | Descrição |
|---|---|---|
| ADMIN | `ROLE_ADMIN` | Acesso total: gerencia setores, usuários, equipamentos e todos os chamados. |
| TECNICO | `ROLE_TECNICO` | Atende chamados: assume, atualiza status e registra histórico. |
| USUARIO | `ROLE_USUARIO` | Solicitante: abre chamados e acompanha os próprios tickets. |

## Endpoints Principais

| Módulo | Base | Autenticação |
|---|---|---|
| Auth (login/bootstrap) | `/api/auth` | Pública (login e bootstrap); demais exigem JWT |
| Setor | `/api/setores` | JWT |
| Usuário | `/api/usuarios` | JWT |
| Equipamento | `/api/equipamentos` | JWT |
| Chamado | `/api/chamados` | JWT |
| Histórico do Chamado | `/api/historicos` | JWT |

## Documentação Complementar

- `DATABASE.md` — dicionário de dados com a estrutura das 5 tabelas, relacionamentos, perfis e política de senhas.
- `database/` — scripts SQL de apoio, quando aplicável.
- `frontend/` — código-fonte da interface web em React.
