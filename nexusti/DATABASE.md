# Dicionário de Dados — Nexus TI

Banco de dados: PostgreSQL
Gerenciamento de schema: Hibernate (`spring.jpa.hibernate.ddl-auto=update`)
Total de tabelas: 5

Este documento descreve a modelagem relacional do Sistema de HelpDesk Omnichannel Nexus TI. As entidades JPA correspondentes encontram-se em `src/main/java/br/com/nexusti/model/`.

## Convenções Gerais

- Chaves primárias: inteiras, autoincrementais (`GenerationType.IDENTITY`).
- Datas de chamados e histórico: `LocalDateTime`, serializadas no padrão `yyyy-MM-dd'T'HH:mm:ss`.
- Senhas: nunca armazenadas em texto claro. O `UsuarioService` aplica hash BCrypt via `PasswordEncoder` antes da persistência (`encoder.encode(senha)`). A autenticação compara o hash no login JWT.
- Perfis de acesso (coluna `usuario.perfil`, normalizada em caixa alta): `ADMIN`, `TECNICO`, `USUARIO`. Na camada de segurança (`Usuario.getAuthorities()`), cada perfil é exposto como authority Spring Security no formato `ROLE_ADMIN`, `ROLE_TECNICO` e `ROLE_USUARIO`. O prefixo `ROLE_` é adicionado automaticamente quando ausente.

## 1. Tabela `setor`

Representa os setores organizacionais da empresa aos quais usuários e equipamentos pertencem.

| Coluna | Tipo (PostgreSQL / JPA) | Restrições | Descrição |
|---|---|---|---|
| id | SERIAL / int (PK) | Chave primária, autoincremento | Identificador do setor |
| nome | VARCHAR / String | Obrigatório | Nome completo do setor |
| sigla | VARCHAR / String | Obrigatório | Sigla do setor |

Relacionamentos de saída: referenciada por `usuario.id_setor` e `equipamento.id_setor`.

## 2. Tabela `usuario`

Representa solicitantes, técnicos e administradores. Implementa `UserDetails` para integração com o Spring Security e autenticação JWT (username = email).

| Coluna | Tipo (PostgreSQL / JPA) | Restrições | Descrição |
|---|---|---|---|
| id | SERIAL / int (PK) | Chave primária, autoincremento | Identificador do usuário |
| nome | VARCHAR(100) / String | Obrigatório, 3–100 caracteres | Nome do usuário |
| email | VARCHAR(100) / String | Obrigatório, formato e-mail, único por lógica de login | E-mail utilizado como credencial de acesso |
| senha | VARCHAR(100) / String | Obrigatório, mínimo 4 caracteres (texto claro na entrada) | Hash BCrypt da senha; jamais texto claro no banco |
| perfil | VARCHAR / String | Obrigatório | Perfil de acesso: `ADMIN`, `TECNICO` ou `USUARIO` (authority: `ROLE_ADMIN`, `ROLE_TECNICO`, `ROLE_USUARIO`) |
| id_setor | INTEGER / Integer (FK) | Obrigatório, > 0 | Referência ao setor de lotação (`setor.id`) |

Relacionamentos:
- `usuario.id_setor` referencia `setor.id`.
- `usuario.id` é referenciado por `chamado.id_solicitante`, `chamado.id_tecnico` e `historico_chamado.id_usuario`.

Validações aplicadas em `UsuarioService.salvar()`: nome com no mínimo 3 caracteres, e-mail contendo `@`, senha com no mínimo 4 caracteres, setor informado e maior que zero.

## 3. Tabela `equipamento`

Representa os ativos de TI passíveis de manutenção, vinculados a um setor responsável.

| Coluna | Tipo (PostgreSQL / JPA) | Restrições | Descrição |
|---|---|---|---|
| id | SERIAL / int (PK) | Chave primária, autoincremento | Identificador do equipamento |
| patrimonio | VARCHAR / String | Obrigatório, identificador patrimonial | Número de patrimônio do bem |
| tipo | VARCHAR / String | Obrigatório | Tipo do equipamento (ex.: computador, impressora, monitor) |
| marca | VARCHAR / String | Obrigatório | Fabricante do equipamento |
| modelo | VARCHAR / String | Obrigatório | Modelo do equipamento |
| id_setor | INTEGER / Integer (FK) | Obrigatório | Setor onde o equipamento está alocado (`setor.id`) |

Relacionamentos:
- `equipamento.id_setor` referencia `setor.id`.
- `equipamento.id` é referenciado por `chamado.id_equipamento`.

## 4. Tabela `chamado`

Representa o ticket de manutenção: título, descrição do problema, status, prioridade e vínculos com solicitante, técnico e equipamento.

| Coluna | Tipo (PostgreSQL / JPA) | Restrições | Descrição |
|---|---|---|---|
| id | SERIAL / int (PK) | Chave primária, autoincremento | Identificador do chamado |
| titulo | VARCHAR(100) / String | Obrigatório, 3–100 caracteres | Título resumido do chamado |
| descricao | VARCHAR(2000) / String | Obrigatório, 5–2000 caracteres | Descrição detalhada do problema |
| status | VARCHAR / String | Opcional (default aplicado na regra de negócio) | Situação do fluxo (ex.: aberto, em andamento, fechado) |
| prioridade | VARCHAR / String | Opcional | Criticidade (ex.: baixa, média, alta) |
| data_abertura | TIMESTAMP / LocalDateTime | Preenchida na abertura | Data e hora de abertura |
| data_fechamento | TIMESTAMP / LocalDateTime | Nula até o encerramento | Data e hora de fechamento |
| id_solicitante | INTEGER / Integer (FK) | Obrigatório | Usuário que abriu o chamado (`usuario.id`) |
| id_tecnico | INTEGER / Integer (FK) | Opcional (nulo até a atribuição) | Técnico responsável (`usuario.id`) |
| id_equipamento | INTEGER / Integer (FK) | Obrigatório | Equipamento objeto da manutenção (`equipamento.id`) |

Relacionamentos:
- `chamado.id_solicitante` referencia `usuario.id`.
- `chamado.id_tecnico` referencia `usuario.id`.
- `chamado.id_equipamento` referencia `equipamento.id`.
- `chamado.id` é referenciado por `historico_chamado.id_chamado`.

## 5. Tabela `historico_chamado`

Representa a trilha de auditoria e comunicação de cada chamado: cada atualização de status ou mensagem registrada por um usuário autenticado.

| Coluna | Tipo (PostgreSQL / JPA) | Restrições | Descrição |
|---|---|---|---|
| id | SERIAL / int (PK) | Chave primária, autoincremento | Identificador do registro histórico |
| mensagem | VARCHAR / String | Obrigatório | Conteúdo da atualização ou comentário |
| data_registro | TIMESTAMP / LocalDateTime | Preenchida no registro | Data e hora do lançamento |
| id_chamado | INTEGER / Integer (FK) | Obrigatório | Chamado ao qual o registro pertence (`chamado.id`) |
| id_usuario | INTEGER / Integer (FK) | Obrigatório | Autor do registro (`usuario.id`) |

Relacionamentos:
- `historico_chamado.id_chamado` referencia `chamado.id`.
- `historico_chamado.id_usuario` referencia `usuario.id`.

## Diagrama Resumido de Relacionamentos

```
setor (1) ───< usuario (N)         [usuario.id_setor → setor.id]
setor (1) ───< equipamento (N)     [equipamento.id_setor → setor.id]
usuario (1) ───< chamado (N)       [chamado.id_solicitante → usuario.id]
usuario (1) ───< chamado (N)       [chamado.id_tecnico → usuario.id]
equipamento (1) ───< chamado (N)   [chamado.id_equipamento → equipamento.id]
chamado (1) ───< historico_chamado (N) [historico_chamado.id_chamado → chamado.id]
usuario (1) ───< historico_chamado (N) [historico_chamado.id_usuario → usuario.id]
```

## Segurança e Perfis

- Hash de senhas: BCrypt via `PasswordEncoder` do Spring Security; a senha em texto claro existe apenas no payload de entrada e jamais é persistida.
- Authorities JWT: `ROLE_ADMIN` (administração total), `ROLE_TECNICO` (atendimento e atualização de chamados), `ROLE_USUARIO` (abertura e acompanhamento de chamados próprios).
- Bootstrap: a rota `POST /api/auth/bootstrap` cria o primeiro usuário somente quando a tabela `usuario` está vazia; tentativas posteriores retornam `409 Conflict`.
