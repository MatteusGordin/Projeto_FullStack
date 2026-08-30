# README

## Sistema de Controle de Pedidos de E-commerce

Esse é o Projeto 1 da matéria de Full Stack. O objetivo é fazer um sistema web completo para cadastro e manutenção de dados.

## Sobre o projeto

O sistema serve para controlar os pedidos de uma loja virtual. Ele cadastra os clientes, os produtos e os pedidos. Todo pedido precisa de um cliente e de um produto, por isso a tabela de pedidos usa chaves estrangeiras para ligar com as outras duas.

As entidades principais são:

- Clientes
- Produtos
- Pedidos

## Tecnologias usadas

- Java
- PostgreSQL (banco relacional)
- Firebase Realtime Database (banco NoSQL)
- Interface gráfica para o cadastro

## Como está dividido

O projeto tem duas partes de banco de dados:

- `database-relacional.sql` – arquivo com os comandos SQL para criar as tabelas de clientes, produtos e pedidos, junto com alguns dados de exemplo.
- `database-nosql.json` – arquivo com a estrutura das mesmas entidades em um formatoo que pode ser importado no Firebase.

## Os bancos de dados

O banco relacional usa PostgreSQL e é hospedado no Supabase. A gente acessa ele pelo DBeaver.

O banco NoSQL usa o Firebase Realtime Database. Nele os dados ficam em uma árvore simples com nós para cada entidade, igual o modelo feito no arquivo JSON.

## Como a aplicação funciona

- Cadastro e edição de clientes, produtos e pedidos.
- A interface gráfica conversa direto com o backend.
- O backend usa Java com Entidades, DAOs (para mexer no banco) e MBeans (para a lógica de negócio).

## Rodando o projeto

No momento o projeto ainda está na parte de modelagem dos bancos. Os arquivos SQL e JSON já estão prontos para criar os bancos. As etapas seguintes (código Java do backend e a interface gráfica) ainda estão em desenvolvimento.

## Versionamento

O código fica em um repositório privado no GitHub.