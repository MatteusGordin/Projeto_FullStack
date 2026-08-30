# ARCHITECTURE

## Visão geral do sistema

O sistema de controle de pedidos de e-commerce é dividido em duas partes principais:

- O backend em Java, que cuida das regras e do acesso aos dados.
- A interface gráfica, que serve para o usuário cadastrar e manter os dados.

## As entidades

Existem três entidades no sistema:

1. Cliente – guarda o nome, email, telefone e cidade da pessoa.
2. Produto – guarda o nome, o preço e a quantidade em estoque.
3. Pedido – guarda a quantidade, o valor total, a data e o status do pedido.

O pedido tem uma ligação com o cliente e com o produto. Essa ligação é feita com chaves estrangeiras no banco relacional.

## Banco relacional (PostgreSQL)

O banco relacional é o PostgreSQL, hospedado no Supabase e acessado pelo DBeaver.

No arquivo `database-relacional.sql` existem três tabelas:

- `clientes` – tem id, nome, email, telefone e cidade.
- `produtos` – tem id, nome, preco e estoque.
- `pedidos` – tem id, cliente_id, produto_id, quantidade, valor_total, data_pedido e status.

A tabela `pedidos` aponta para a tabela `clientes` e para a tabela `produtos` usando FOREIGN KEY. Assim, um pedido sempre pertence a um cliente e a um produto.

O arquivo também tem alguns INSERT para criar dados de exemplo nas três tabelas.

## Banco NoSQL (Firebase)

O banco NoSQL é o Firebase Realtime Database. A modelagem dele está no arquivo `database-nosql.json`.

A estrutura é uma árvore plana com três nós principais:

- `clientes` – cada cliente é um nó com nome, email, telefone e cidade.
- `produtos` – cada produto é um nó com nome, preco e estoque.
- `pedidos` – cada pedido é um nó com cliente_id, produto_id, quantidade, valor_total, data_pedido e status.

Nos pedidos, a ligação com cliente e produto é feita guardando o id de cada um. Não existe chave estrangeira como no banco relacional, a ligação é só pelo valor do id.

## Backend em Java

O backend é feito em Java e organizado em três partes:

- Entidades – classes que representam as tabelas do banco (Cliente, Produto e Pedido).
- DAOs (Data Access Objects) – classes que fazem as operações de adicionar, buscar, alterar e remover os dados no banco.
- MBeans – classes que cuidam da lógica de negócio do sistema.

## Frontend

A interface gráfica é onde o usuário faz o cadastro e a manutenção dos dados. Ela se conecta direto com o backend, então as informações saem da tela, passam pelo backend, e vão para o banco.

## Fluxo de um cadastro

1. O usuário abre a tela e digita os dados de um cliente, produto ou pedido.
2. A interface manda os dados para o backend.
3. As classes MBeans fazem a regra de negócio.
4. Os DAOs salvam os dados no banco (relacional ou NoSQL).
5. Pronto, o registro fica armazenado e aparece na tela.

## Estado atual

Nessa parte do projeto, o foco foi na modelagem e criação dos dois bancos de dados. A parte de código Java e a interface gráfica ainda estão sendo desenvolvidas.