CREATE TABLE clientes (
    id INT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20),
    cidade VARCHAR(50)
);


CREATE TABLE produtos (
    id INT PRIMARY KEY,
    nome VARCHAR(100),
    preco DECIMAL(10,2),
    estoque INT
);


CREATE TABLE pedidos (
    id INT PRIMARY KEY,
    cliente_id INT,
    produto_id INT,
    quantidade INT,
    valor_total DECIMAL(10,2),
    data_pedido TIMESTAMP,
    status VARCHAR(20),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);


INSERT INTO clientes (id, nome, email, telefone, cidade)
VALUES (1, 'Ana Souza', 'ana.souza@email.com', '(11) 98888-1111', 'Sao Paulo');

INSERT INTO clientes (id, nome, email, telefone, cidade)
VALUES (2, 'Bruno Lima', 'bruno.lima@email.com', '(21) 97777-2222', 'Rio de Janeiro');

INSERT INTO clientes (id, nome, email, telefone, cidade)
VALUES (3, 'Carla Dias', 'carla.dias@email.com', '(31) 96666-3333', 'Belo Horizonte');


INSERT INTO produtos (id, nome, preco, estoque)
VALUES (1, 'Teclado Mecanico', 250.00, 15);

INSERT INTO produtos (id, nome, preco, estoque)
VALUES (2, 'Mouse Gamer', 120.00, 30);

INSERT INTO produtos (id, nome, preco, estoque)
VALUES (3, 'Monitor 24 Polegadas', 900.00, 8);


INSERT INTO pedidos (id, cliente_id, produto_id, quantidade, valor_total, data_pedido, status)
VALUES (1, 1, 1, 1, 250.00, '2026-08-10 14:30:00', 'Pago');

INSERT INTO pedidos (id, cliente_id, produto_id, quantidade, valor_total, data_pedido, status)
VALUES (2, 2, 3, 1, 900.00, '2026-08-12 09:15:00', 'Enviado');

INSERT INTO pedidos (id, cliente_id, produto_id, quantidade, valor_total, data_pedido, status)
VALUES (3, 3, 2, 2, 240.00, '2026-08-15 16:45:00', 'Entregue');
