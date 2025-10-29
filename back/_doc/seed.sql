-- Inserindo dados na tabela NECESSIDADES_ESPECIFICAS
INSERT INTO `NECESSIDADES_ESPECIFICAS` (`nome`, `descricao`) VALUES
('Deficiência Visual', 'Necessidade de adaptações para estudantes com baixa visão ou cegueira, como materiais em braille ou softwares de leitura.'),
('Deficiência Auditiva', 'Necessidade de intérpretes de Libras ou aparelhos auditivos para estudantes com surdez.'),
('Deficiência Motora', 'Necessidade de acessibilidade física, como rampas ou equipamentos adaptados para mobilidade reduzida.'),
('Transtorno do Espectro Autista', 'Necessidade de estratégias de comunicação e rotinas estruturadas para estudantes com TEA.'),
('Dificuldades de Aprendizagem', 'Necessidade de apoio pedagógico adicional para estudantes com dislexia ou outras dificuldades cognitivas.');

-- Inserindo dados na tabela SERVIDORES
INSERT INTO `SERVIDORES` (`siape`, `cpf`, `nome`, `email`, `telefone`, `tipo`) VALUES
(123456, '12345678901', 'João Silva', 'joao.silva@universidade.edu.br', '11987654321', 'Docente'),
(234567, '23456789012', 'Maria Oliveira', 'maria.oliveira@universidade.edu.br', '11987654322', 'TAE'),
(345678, '34567890123', 'Carlos Pereira', 'carlos.pereira@universidade.edu.br', '11987654323', 'NAPNE'),
(456789, '45678901234', 'Ana Costa', 'ana.costa@universidade.edu.br', '11987654324', 'Docente'),
(567890, '56789012345', 'Pedro Santos', 'pedro.santos@universidade.edu.br', '11987654325', 'Outro');

-- Inserindo dados na tabela USUARIOS (depende de SERVIDORES)
INSERT INTO `USUARIOS` (`siape`, `username`, `senha`) VALUES
(123456, 'joao_silva', 'senha123'),
(234567, 'maria_oliveira', 'senha123'),
(345678, 'carlos_pereira', 'senha123'),
(456789, 'ana_costa', 'senha123'),
(567890, 'pedro_santos', 'senha123');

-- Inserindo dados na tabela COMPONENTES_CURRICULARES
INSERT INTO `COMPONENTES_CURRICULARES` (`codigo_componente`, `componente`, `carga_horaria`) VALUES
(101, 'Matemática Básica', 60),
(102, 'Português', 45),
(103, 'História', 40),
(104, 'Ciências', 50),
(105, 'Educação Física', 30);

-- Inserindo dados na tabela ESTUDANTES
INSERT INTO `ESTUDANTES` (`cpf`, `nome`, `contato`, `endereco`, `precisa_atendimento_psicopedagogico`) VALUES
('11122233344', 'Lucas Almeida', '11999999999', 'Rua A, 123, São Paulo', TRUE),
('22233344455', 'Sofia Rodrigues', '11888888888', 'Rua B, 456, Rio de Janeiro', FALSE),
('33344455566', 'Gabriel Lima', '11777777777', 'Rua C, 789, Belo Horizonte', TRUE),
('44455566677', 'Isabela Ferreira', '11666666666', 'Rua D, 101, Porto Alegre', FALSE),
('55566677788', 'Rafael Gomes', '11555555555', 'Rua E, 202, Salvador', TRUE);

-- Inserindo dados na tabela RESPONSAVEIS
INSERT INTO `RESPONSAVEIS` (`nome_responsavel`, `cpf_responsavel`, `contato_responsavel`, `endereco_responsavel`) VALUES
('José Almeida', '66677788899', '11999999998', 'Rua A, 123, São Paulo'),
('Maria Rodrigues', '77788899900', '11888888887', 'Rua B, 456, Rio de Janeiro'),
('Carlos Lima', '88899900011', '11777777776', 'Rua C, 789, Belo Horizonte'),
('Ana Ferreira', '99900011122', '11666666665', 'Rua D, 101, Porto Alegre'),
('Pedro Gomes', '00011122233', '11555555554', 'Rua E, 202, Salvador');

-- Inserindo dados na tabela CURSOS (depende de SERVIDORES)
INSERT INTO `CURSOS` (`codigo`, `nome`, `modalidade`, `carga_horaria`, `duracao`, `coordenador_cpf`) VALUES
('ENG001', 'Engenharia Civil', 'Presencial', 3600, '5 anos', '12345678901'),
('PED002', 'Pedagogia', 'EAD', 3200, '4 anos', '23456789012'),
('ADM003', 'Administração', 'Presencial', 2800, '4 anos', '34567890123'),
('INF004', 'Informática', 'Híbrido', 3000, '3 anos', '45678901234'),
('MED005', 'Medicina', 'Presencial', 7200, '6 anos', '56789012345');

-- Inserindo dados na tabela MATRICULAS (depende de ESTUDANTES e CURSOS)
INSERT INTO `MATRICULAS` (`matricula`, `estudante_id`, `curso_id`, `ativo`) VALUES
('MAT2023001', 1, 'ENG001', TRUE),
('MAT2023002', 2, 'PED002', TRUE),
('MAT2023003', 3, 'ADM003', TRUE),
('MAT2023004', 4, 'INF004', TRUE),
('MAT2023005', 5, 'MED005', TRUE);

-- Inserindo dados na tabela PEI_GERAL (depende de MATRICULAS)
INSERT INTO `PEI_GERAL` (`matricula`, `periodo`, `dificuldades`, `interesses_habilidades`, `estrategias`) VALUES
('MAT2023001', '202301', 'Dificuldade em cálculos avançados', 'Interesse em projetos práticos', 'Uso de calculadoras e tutoria extra'),
('MAT2023002', '202301', 'Problemas de leitura', 'Habilidade em artes', 'Leituras adaptadas e atividades criativas'),
('MAT2023003', '202301', 'Falta de concentração', 'Interesse em liderança', 'Técnicas de foco e grupos de estudo'),
('MAT2023004', '202301', 'Dificuldade em programação', 'Habilidade em lógica', 'Exercícios práticos e mentoria'),
('MAT2023005', '202301', 'Estresse em exames', 'Interesse em ciências', 'Técnicas de relaxamento e revisão gradual');

-- Inserindo dados na tabela PEI_ADAPTACAO (depende de PEI_GERAL e COMPONENTES_CURRICULARES)
INSERT INTO `PEI_ADAPTACAO` (`pei_geral_id`, `codigo_componente`, `ementa`, `objetivo_geral`, `objetivos_especificos`, `conteudos`, `metodologia`, `avaliacao`, `comentarios_napne`, `docente`) VALUES
(1, 101, 'Introdução à Matemática', 'Desenvolver habilidades básicas em matemática', 'Resolver equações simples; Entender geometria básica', 'Números, operações, geometria', 'Aulas práticas com materiais visuais', 'Provas e exercícios', 'Adaptação aprovada', 'João Silva'),
(2, 102, 'Gramática e Literatura', 'Melhorar compreensão textual', 'Analisar textos; Melhorar ortografia', 'Gramática, literatura brasileira', 'Leituras em voz alta e discussões', 'Redações e testes', 'Necessário acompanhamento', 'Maria Oliveira'),
(3, 103, 'História do Brasil', 'Entender contextos históricos', 'Identificar períodos históricos; Analisar eventos', 'Colônia, Império, República', 'Debates e projetos', 'Apresentações e provas', 'Estratégias eficazes', 'Carlos Pereira'),
(4, 104, 'Física e Química', 'Aplicar conceitos científicos', 'Realizar experimentos; Entender leis físicas', 'Matéria, energia, reações', 'Laboratórios adaptados', 'Relatórios e exames', 'Apoio adicional sugerido', 'Ana Costa'),
(5, 105, 'Atividades Físicas', 'Promover saúde e inclusão', 'Praticar esportes adaptados; Melhorar coordenação', 'Esportes, dança, ginástica', 'Aulas inclusivas', 'Avaliação prática', 'Monitoramento contínuo', 'Pedro Santos');

-- Inserindo dados na tabela PARECERES (depende de PEI_ADAPTACAO)
INSERT INTO `PARECERES` (`pei_adaptacao_id`, `periodo`, `descricao`, `comentarios`) VALUES
(1, '202301', 'Adaptações implementadas com sucesso', 'Estudante progredindo bem'),
(2, '202301', 'Necessário reforço em leitura', 'Sugestão de materiais extras'),
(3, '202301', 'Participação ativa nas aulas', 'Continuar com estratégias atuais'),
(4, '202301', 'Dificuldades em experimentos', 'Ajustar metodologia'),
(5, '202301', 'Melhoria na coordenação', 'Manter atividades inclusivas');

-- Inserindo dados na tabela COMENTARIOS (depende de PARECERES e USUARIOS)
INSERT INTO `COMENTARIOS` (`parecer_id`, `usuario_id`, `comentarios`) VALUES
(1, 123456, 'Concordo com as adaptações.'),
(2, 234567, 'Vamos implementar reforços.'),
(3, 345678, 'Estratégias estão funcionando.'),
(4, 456789, 'Ajustes necessários aprovados.'),
(5, 567890, 'Continuar monitoramento.');

-- Inserindo dados na tabela ESTUDANTES_NECESSIDADES (depende de ESTUDANTES e NECESSIDADES_ESPECIFICAS)
INSERT INTO `ESTUDANTES_NECESSIDADES` (`estudante_cpf`, `necessidade_id`) VALUES
('11122233344', 1),
('22233344455', 2),
('33344455566', 3),
('44455566677', 4),
('55566677788', 5);

-- Inserindo dados na tabela RESP_ESTUDANTE (depende de RESPONSAVEIS e ESTUDANTES)
INSERT INTO `RESP_ESTUDANTE` (`id_responsavel`, `id_aluno`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);