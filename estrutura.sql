-- Script de criação do banco de dados NAPNE
-- Execute este script para criar/reconstruir o banco de dados

DROP DATABASE IF EXISTS NAPNE;
CREATE DATABASE NAPNE;
USE NAPNE;

-- Tabela de Usuários
DROP TABLE IF EXISTS USUARIOS;
CREATE TABLE USUARIOS (
    siape INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    PRIMARY KEY(siape)
);

-- Tabela de Servidores (Professores, Coordenadores, etc.)
DROP TABLE IF EXISTS SERVIDORES;
CREATE TABLE SERVIDORES (
    siape INT NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    tipo ENUM('Docente', 'Coordenador', 'Diretor', 'Outro') NOT NULL,
    PRIMARY KEY(siape)
);

-- Tabela de Cursos
DROP TABLE IF EXISTS CURSOS;
CREATE TABLE CURSOS (
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    modalidade VARCHAR(100),
    carga_horaria INT,
    duracao VARCHAR(100),
    coordenador_cpf VARCHAR(14),
    PRIMARY KEY(codigo),
    FOREIGN KEY (coordenador_cpf) REFERENCES SERVIDORES(cpf)
);

-- Tabela de Estudantes
DROP TABLE IF EXISTS ESTUDANTES;
CREATE TABLE ESTUDANTES (
    id_aluno INT AUTO_INCREMENT,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(20),
    endereco VARCHAR(500),
    precisa_atendimento_psicopedagogico TINYINT(1) DEFAULT 0,
    PRIMARY KEY(id_aluno)
);

-- Tabela de Matrículas
DROP TABLE IF EXISTS MATRICULAS;
CREATE TABLE MATRICULAS (
    matricula VARCHAR(50) NOT NULL,
    estudante_id INT NOT NULL,
    curso_id VARCHAR(50) NOT NULL,
    ativo TINYINT(1) DEFAULT 1,
    PRIMARY KEY(matricula),
    FOREIGN KEY (estudante_id) REFERENCES ESTUDANTES(id_aluno),
    FOREIGN KEY (curso_id) REFERENCES CURSOS(codigo)
);

-- Tabela de Necessidades Específicas
DROP TABLE IF EXISTS NECESSIDADES_ESPECIFICAS;
CREATE TABLE NECESSIDADES_ESPECIFICAS (
    necessidade_id INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    PRIMARY KEY(necessidade_id)
);

-- Tabela de Relacionamento Estudantes-Necessidades
DROP TABLE IF EXISTS ESTUDANTES_NECESSIDADES;
CREATE TABLE ESTUDANTES_NECESSIDADES (
    estudante_cpf VARCHAR(14) NOT NULL,
    necessidade_id INT NOT NULL,
    PRIMARY KEY(estudante_cpf, necessidade_id),
    FOREIGN KEY (estudante_cpf) REFERENCES ESTUDANTES(cpf),
    FOREIGN KEY (necessidade_id) REFERENCES NECESSIDADES_ESPECIFICAS(necessidade_id)
);

-- Tabela de Componentes Curriculares
DROP TABLE IF EXISTS COMPONENTES_CURRICULARES;
CREATE TABLE COMPONENTES_CURRICULARES (
    codigo_componente INT NOT NULL,
    componente VARCHAR(255) NOT NULL,
    carga_horaria INT NOT NULL,
    PRIMARY KEY(codigo_componente)
);

-- Tabela de PEI Geral
DROP TABLE IF EXISTS PEI_GERAL;
CREATE TABLE PEI_GERAL (
    id INT AUTO_INCREMENT,
    matricula VARCHAR(50) NOT NULL,
    periodo CHAR(10),
    dificuldades TEXT,
    interesses_habilidades TEXT,
    estrategias TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (matricula) REFERENCES MATRICULAS(matricula)
);

-- Tabela de PEI Adaptação (Componentes específicos)
DROP TABLE IF EXISTS PEI_ADAPTACAO;
CREATE TABLE PEI_ADAPTACAO (
    id INT AUTO_INCREMENT,
    pei_geral_id INT NOT NULL,
    codigo_componente INT NOT NULL,
    ementa TEXT,
    objetivo_geral TEXT,
    objetivos_especificos TEXT,
    conteudos TEXT,
    metodologia TEXT,
    avaliacao TEXT,
    comentarios_napne TEXT,
    docente VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (pei_geral_id) REFERENCES PEI_GERAL(id),
    FOREIGN KEY (codigo_componente) REFERENCES COMPONENTES_CURRICULARES(codigo_componente)
);

-- Tabela de Pareceres
DROP TABLE IF EXISTS PARECERES;
CREATE TABLE PARECERES (
    id INT AUTO_INCREMENT,
    pei_adaptacao_id INT NOT NULL,
    periodo CHAR(10),
    descricao TEXT,
    comentarios TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (pei_adaptacao_id) REFERENCES PEI_ADAPTACAO(id)
);

-- Tabela de Comentários
DROP TABLE IF EXISTS COMENTARIOS;
CREATE TABLE COMENTARIOS (
    id INT AUTO_INCREMENT,
    parecer_id INT NOT NULL,
    usuario_id INT NOT NULL,
    comentarios TEXT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (parecer_id) REFERENCES PARECERES(id),
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(siape)
);

-- Tabela de Responsáveis
DROP TABLE IF EXISTS RESPONSAVEIS;
CREATE TABLE RESPONSAVEIS (
    id_responsavel INT AUTO_INCREMENT,
    nome_responsavel VARCHAR(255) NOT NULL,
    cpf_responsavel VARCHAR(14) NOT NULL UNIQUE,
    contato_responsavel VARCHAR(20),
    endereco_responsavel VARCHAR(500),
    PRIMARY KEY(id_responsavel)
);

-- Tabela de Relacionamento Responsáveis-Estudantes
DROP TABLE IF EXISTS RESP_ESTUDANTE;
CREATE TABLE RESP_ESTUDANTE (
    id_responsavel INT NOT NULL,
    id_aluno INT NOT NULL,
    PRIMARY KEY(id_responsavel, id_aluno),
    FOREIGN KEY (id_responsavel) REFERENCES RESPONSAVEIS(id_responsavel),
    FOREIGN KEY (id_aluno) REFERENCES ESTUDANTES(id_aluno)
);
