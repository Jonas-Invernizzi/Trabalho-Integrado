DROP TABLE IF EXISTS COMENTARIOS;
DROP TABLE IF EXISTS ADAPTACOES;
DROP TABLE IF EXISTS PEICOMPONENTE;
DROP TABLE IF EXISTS COMPONENTES_CURRICULARES;
DROP TABLE IF EXISTS PEIGERAL;
DROP TABLE IF EXISTS ESTUDANTES_NECESSIDADES;
DROP TABLE IF EXISTS ACOMPANHAMENTO;
DROP TABLE IF EXISTS DIAGNOSTICO;
DROP TABLE IF EXISTS MATRIZES_CURRICULARES;
DROP TABLE IF EXISTS ALUNOS;
DROP TABLE IF EXISTS NECESSIDADES_ESPECIFICAS;
DROP TABLE IF EXISTS CURSOS;
DROP TABLE IF EXISTS USUARIOS;

CREATE TABLE USUARIOS (
    id_usuario INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    PRIMARY KEY(id_usuario)
)

CREATE TABLE CURSOS (
    codigo_EM VARCHAR(50),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    duracao VARCHAR(50),
    descricao_cur TEXT,
    PRIMARY KEY(codigo_EM)
)

CREATE TABLE NECESSIDADES_ESPECIFICAS (
    id_necessidade INT AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    PRIMARY KEY(id_necessidade)
)

CREATE TABLE ALUNOS (
    id_aluno INT AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nome_social VARCHAR(255),
    matricula VARCHAR(50) NOT NULL UNIQUE,
    curso VARCHAR(100),
    turma VARCHAR(50),
    PRIMARY KEY(id_aluno),
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario)
)

CREATE TABLE MATRIZES_CURRICULARES (
    id_matriz INT AUTO_INCREMENT,
    codigo_curso VARCHAR(50) NOT NULL,
    ano_semestre VARCHAR(20),
    grade_referencia VARCHAR(50),
    PRIMARY KEY(id_matriz),
    FOREIGN KEY (codigo_curso) REFERENCES CURSOS(codigo_EM)
)

CREATE TABLE DIAGNOSTICO (
    id_aluno INT,
    laudo TEXT,
    data_diagnostico DATE,
    tipo_necessidade VARCHAR(100),
    PRIMARY KEY(id_aluno),
    FOREIGN KEY (id_aluno) REFERENCES ALUNOS(id_aluno)
)

CREATE TABLE ACOMPANHAMENTO (
    id_acompanhamento INT AUTO_INCREMENT,
    id_aluno INT NOT NULL,
    data_acompanhamento DATE,
    descricao_acompanhamento TEXT,
    PRIMARY KEY(id_acompanhamento),
    FOREIGN KEY (id_aluno) REFERENCES ALUNOS(id_aluno)
)

CREATE TABLE ESTUDANTES_NECESSIDADES (
    id_aluno INT NOT NULL,
    id_necessidade INT NOT NULL,
    PRIMARY KEY (id_aluno, id_necessidade),
    FOREIGN KEY (id_aluno) REFERENCES ALUNOS(id_aluno),
    FOREIGN KEY (id_necessidade) REFERENCES NECESSIDADES_ESPECIFICAS(id_necessidade)
)

CREATE TABLE PEIGERAL (
    id_pei INT AUTO_INCREMENT,
    id_aluno INT NOT NULL,
    ano_letivo VARCHAR(10),
    semestre VARCHAR(10),
    objetivos TEXT,
    metodologia TEXT,
    avaliacoes TEXT,
    atend_educacional TEXT,
    PRIMARY KEY(id_pei),
    FOREIGN KEY (id_aluno) REFERENCES ALUNOS(id_aluno)
)

CREATE TABLE COMPONENTES_CURRICULARES (
    codigo_componente VARCHAR(50),
    id_matriz INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    PRIMARY KEY(codigo_componente),
    FOREIGN KEY (id_matriz) REFERENCES MATRIZES_CURRICULARES(id_matriz)
)

CREATE TABLE PEICOMPONENTE (
    id_pei_comp INT AUTO_INCREMENT,
    id_pei_geral INT NOT NULL,
    cod_componente VARCHAR(50) NOT NULL,
    tipo VARCHAR(100),
    objetivos TEXT,
    conteudo TEXT,
    metodologia TEXT,
    data_inicio DATE,
    data_fim DATE,
    status VARCHAR(50),
    obs_componente TEXT,
    PRIMARY KEY(id_pei_comp),
    FOREIGN KEY (id_pei_geral) REFERENCES PEIGERAL(id_pei),
    FOREIGN KEY (cod_componente) REFERENCES COMPONENTES_CURRICULARES(codigo_componente)
)

CREATE TABLE ADAPTACOES (
    id_adaptacao INT AUTO_INCREMENT,
    id_pei_comp INT NOT NULL,
    tipo_adaptacao VARCHAR(100),
    descricao TEXT,
    PRIMARY KEY(id_adaptacao),
    FOREIGN KEY (id_pei_comp) REFERENCES PEICOMPONENTE(id_pei_comp)
)

CREATE TABLE COMENTARIOS (
    id_comentario INT AUTO_INCREMENT,
    id_pei_comp INT NOT NULL,
    id_usuario INT NOT NULL,
    comentario TEXT,
    data DATETIME,
    PRIMARY KEY(id_comentario),
    FOREIGN KEY (id_pei_comp) REFERENCES PEICOMPONENTE(id_pei_comp),
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario)
)