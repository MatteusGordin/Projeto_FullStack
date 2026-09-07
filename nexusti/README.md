# Nexus TI

Projeto 1 da disciplina de Full Stack

Objetivo do projeto:
Sistema web simples para registrar e acompanhar manutencao de equipamentos de TI. O usuario abre um chamado e o tecnico atualiza o status ate o fechamento.

Arquitetura:
Backend em Java
Banco de dados relacional PostgreSQL hospedado no Supabase
Frontend web ainda sera feito

Tecnologias:
Java 21
Spring Boot
PostgreSQL
Maven
Supabase

Estrutura do banco:
5 tabelas: setor, usuario, equipamento, chamado, historico_chamado

Estrutura do backend:
Pacote model com as 5 entidades
Pacote dao com as 5 classes DAO para operacoes de CRUD

Como executar:
Configurar o banco com o arquivo database/schema.sql
Executar a classe NexustiApplication
