CREATE TABLE setor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(20) NOT NULL
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    perfil VARCHAR(20) NOT NULL,
    id_setor INTEGER NOT NULL,
    CONSTRAINT fk_usuario_setor FOREIGN KEY (id_setor) REFERENCES setor(id)
);

CREATE TABLE equipamento (
    id SERIAL PRIMARY KEY,
    patrimonio VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    id_setor INTEGER NOT NULL,
    CONSTRAINT fk_equipamento_setor FOREIGN KEY (id_setor) REFERENCES setor(id)
);

CREATE TABLE chamado (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    prioridade VARCHAR(20) NOT NULL,
    data_abertura DATE NOT NULL,
    data_fechamento DATE,
    id_solicitante INTEGER NOT NULL,
    id_tecnico INTEGER,
    id_equipamento INTEGER NOT NULL,
    solucao TEXT,
    CONSTRAINT fk_chamado_solicitante FOREIGN KEY (id_solicitante) REFERENCES usuario(id),
    CONSTRAINT fk_chamado_tecnico FOREIGN KEY (id_tecnico) REFERENCES usuario(id),
    CONSTRAINT fk_chamado_equipamento FOREIGN KEY (id_equipamento) REFERENCES equipamento(id)
);

CREATE TABLE IF NOT EXISTS prioridade (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE,
    cor VARCHAR(20),
    ordem INTEGER,
    ativa BOOLEAN
);

CREATE TABLE historico_chamado (
    id SERIAL PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_registro DATE NOT NULL,
    id_chamado INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    CONSTRAINT fk_historico_chamado FOREIGN KEY (id_chamado) REFERENCES chamado(id),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);
