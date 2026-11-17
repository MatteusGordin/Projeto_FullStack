# Projeto_FullStack — Nexus TI

Trabalho da disciplina de Desenvolvimento Full Stack: sistema de HelpDesk
para manutenção de equipamentos de TI (backend Spring Boot + frontend React + PostgreSQL).

Site: https://nexusti-frontend.vercel.app

O código do projeto está na subpasta [`nexusti/`](nexusti/).

## Início rápido (clone e execução)

```bash
git clone https://github.com/MattGordin/Projeto_FullStack.git
cd Projeto_FullStack/nexusti
```

Depois siga o passo a passo completo em [`nexusti/README.md`](nexusti/README.md):

1. `Copy-Item .env.example .env` (ou `cp .env.example .env`) e preencha `DB_URL`, `DB_USER`, `DB_PASSWORD`.
2. `.\mvnw.cmd spring-boot:run` (ou `./mvnw spring-boot:run`) — backend em `http://localhost:8080`.
3. Em outro terminal: `cd frontend`, `npm install`, copiar `.env.example` para `.env` (`VITE_API_URL=http://localhost:8080/api`), `npm run dev` — frontend em `http://localhost:5173`.
4. Primeiro acesso via `POST /api/auth/bootstrap` (banco vazio) e depois `POST /api/auth/login`.

Pré-requisitos: JDK 21, Node.js 18+ e PostgreSQL acessível (local, Docker ou Supabase).