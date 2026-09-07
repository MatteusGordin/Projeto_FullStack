# Dicionario de Dados - Nexus TI

Banco de dados: PostgreSQL
Total de tabelas: 5

## 1. Tabela setor
Guarda os setores da empresa.
Colunas:
id - inteiro - chave primaria
nome - texto - nome completo do setor
sigla - texto - sigla do setor

## 2. Tabela usuario
Guarda os usuarios do sistema.
Colunas:
id - inteiro - chave primaria
nome - texto - nome do usuario
email - texto - email do usuario
senha - texto - senha do usuario
perfil - texto - perfil do usuario como usuario ou tecnico ou admin
id_setor - inteiro - chave estrangeira para setor.id

Relacionamento:
usuario.id_setor referencia setor.id

## 3. Tabela equipamento
Guarda os equipamentos de TI.
Colunas:
id - inteiro - chave primaria
patrimonio - texto - numero de patrimonio
tipo - texto - tipo do equipamento como computador ou impressora
marca - texto - marca do equipamento
modelo - texto - modelo do equipamento
id_setor - inteiro - chave estrangeira para setor.id

Relacionamento:
equipamento.id_setor referencia setor.id

## 4. Tabela chamado
Guarda os chamados de manutencao.
Colunas:
id - inteiro - chave primaria
titulo - texto - titulo do chamado
descricao - texto - descricao do problema
status - texto - status como aberto ou em andamento ou fechado
prioridade - texto - prioridade como baixa ou media ou alta
data_abertura - data - data de abertura do chamado
data_fechamento - data - data de fechamento do chamado
id_solicitante - inteiro - chave estrangeira para usuario.id
id_tecnico - inteiro - chave estrangeira para usuario.id
id_equipamento - inteiro - chave estrangeira para equipamento.id

Relacionamentos:
chamado.id_solicitante referencia usuario.id
chamado.id_tecnico referencia usuario.id
chamado.id_equipamento referencia equipamento.id

## 5. Tabela historico_chamado
Guarda o historico de atualizacoes do chamado.
Colunas:
id - inteiro - chave primaria
mensagem - texto - mensagem da atualizacao
data_registro - data - data do registro
id_chamado - inteiro - chave estrangeira para chamado.id
id_usuario - inteiro - chave estrangeira para usuario.id

Relacionamentos:
historico_chamado.id_chamado referencia chamado.id
historico_chamado.id_usuario referencia usuario.id
