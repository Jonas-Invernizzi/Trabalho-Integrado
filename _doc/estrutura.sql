DROP TABLE IF EXISTS `RESP_ESTUDANTE`;
DROP TABLE IF EXISTS `ESTUDANTES_NECESSIDADES`;
DROP TABLE IF EXISTS `COMENTARIOS`;
DROP TABLE IF EXISTS `PARECERES`;
DROP TABLE IF EXISTS `PEI_ADAPTACAO`;
DROP TABLE IF EXISTS `PEI_GERAL`;
DROP TABLE IF EXISTS `MATRICULAS`;
DROP TABLE IF EXISTS `CURSOS`;
DROP TABLE IF EXISTS `RESPONSAVEIS`;
DROP TABLE IF EXISTS `ESTUDANTES`;
DROP TABLE IF EXISTS `COMPONENTES_CURRICULARES`;
DROP TABLE IF EXISTS `USUARIOS`;
DROP TABLE IF EXISTS `SERVIDORES`;
DROP TABLE IF EXISTS `NECESSIDADES_ESPECIFICAS`;

CREATE TABLE `NECESSIDADES_ESPECIFICAS` (
  `necessidade_id` INT PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` TEXT
);

CREATE TABLE `SERVIDORES` (
  `siape` INT PRIMARY KEY,
  `cpf` VARCHAR(11) NOT NULL UNIQUE,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `telefone` VARCHAR(20),
  `tipo` ENUM('Docente', 'TAE', 'NAPNE', 'Outro') NOT NULL
);

CREATE TABLE `USUARIOS` (
  `siape` INT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`siape`) REFERENCES `SERVIDORES`(`siape`)
);

CREATE TABLE `COMPONENTES_CURRICULARES` (
  `codigo_componente` INT PRIMARY KEY,
  `componente` VARCHAR(255) NOT NULL,
  `carga_horaria` INT NOT NULL
);

CREATE TABLE `ESTUDANTES` (
  `id_aluno` INT PRIMARY KEY AUTO_INCREMENT,
  `cpf` VARCHAR(11) NOT NULL UNIQUE,
  `nome` VARCHAR(255) NOT NULL,
  `contato` VARCHAR(20),
  `endereco` VARCHAR(255),
  `precisa_atendimento_psicopedagogico` BOOLEAN DEFAULT FALSE
);

CREATE TABLE `RESPONSAVEIS` (
  `id_responsavel` INT PRIMARY KEY AUTO_INCREMENT,
  `nome_responsavel` VARCHAR(255) NOT NULL,
  `cpf_responsavel` VARCHAR(11) NOT NULL UNIQUE,
  `contato_responsavel` VARCHAR(20),
  `endereco_responsavel` VARCHAR(255)
);

CREATE TABLE `CURSOS` (
  `codigo` VARCHAR(50) PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `modalidade` VARCHAR(100),
  `carga_horaria` INT,
  `duracao` VARCHAR(50),
  `coordenador_cpf` VARCHAR(11),
  FOREIGN KEY (`coordenador_cpf`) REFERENCES `SERVIDORES`(`cpf`)
);

CREATE TABLE `MATRICULAS` (
  `matricula` VARCHAR(20) PRIMARY KEY,
  `estudante_id` INT NOT NULL,
  `curso_id` VARCHAR(50) NOT NULL,
  `ativo` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`estudante_id`) REFERENCES `ESTUDANTES`(`id_aluno`),
  FOREIGN KEY (`curso_id`) REFERENCES `CURSOS`(`codigo`)
);

CREATE TABLE `PEI_GERAL` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `matricula` VARCHAR(20) NOT NULL,
  `periodo` CHAR(6),
  `dificuldades` TEXT,
  `interesses_habilidades` TEXT,
  `estrategias` TEXT,
  `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`matricula`) REFERENCES `MATRICULAS`(`matricula`)
);

CREATE TABLE `PEI_ADAPTACAO` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `pei_geral_id` INT NOT NULL,
  `codigo_componente` INT NOT NULL,
  `ementa` TEXT,
  `objetivo_geral` TEXT,
  `objetivos_especificos` TEXT,
  `conteudos` TEXT,
  `metodologia` TEXT,
  `avaliacao` TEXT,
  `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comentarios_napne` TEXT,
  `docente` VARCHAR(255),
  FOREIGN KEY (`pei_geral_id`) REFERENCES `PEI_GERAL`(`id`),
  FOREIGN KEY (`codigo_componente`) REFERENCES `COMPONENTES_CURRICULARES`(`codigo_componente`)
);

CREATE TABLE `PARECERES` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `pei_adaptacao_id` INT NOT NULL,
  `periodo` CHAR(6),
  `descricao` TEXT,
  `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `comentarios` TEXT,
  FOREIGN KEY (`pei_adaptacao_id`) REFERENCES `PEI_ADAPTACAO`(`id`)
);

CREATE TABLE `COMENTARIOS` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `parecer_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `data` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `comentarios` TEXT NOT NULL,
  FOREIGN KEY (`parecer_id`) REFERENCES `PARECERES`(`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `USUARIOS`(`siape`)
);

CREATE TABLE `ESTUDANTES_NECESSIDADES` (
  `estudante_cpf` VARCHAR(11) NOT NULL,
  `necessidade_id` INT NOT NULL,
  PRIMARY KEY (`estudante_cpf`, `necessidade_id`),
  FOREIGN KEY (`estudante_cpf`) REFERENCES `ESTUDANTES`(`cpf`),
  FOREIGN KEY (`necessidade_id`) REFERENCES `NECESSIDADES_ESPECIFICAS`(`necessidade_id`)
);

CREATE TABLE `RESP_ESTUDANTE` (
  `id_responsavel` INT NOT NULL,
  `id_aluno` INT NOT NULL,
  PRIMARY KEY (`id_responsavel`, `id_aluno`),
  FOREIGN KEY (`id_responsavel`) REFERENCES `RESPONSAVEIS`(`id_responsavel`),
  FOREIGN KEY (`id_aluno`) REFERENCES `ESTUDANTES`(`id_aluno`)
);

