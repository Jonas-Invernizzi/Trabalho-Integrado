INSERT INTO USUARIOS (nome, email, senha, tipo) VALUES
('João Silva', 'joao.silva@email.com', 'senha123', 'Professor'),
('Maria Oliveira', 'maria.oliveira@email.com', 'senha456', 'Coordenador'),
('Pedro Santos', 'pedro.santos@email.com', 'senha789', 'Aluno'),
('Ana Costa', 'ana.costa@email.com', 'senha101', 'Professor'),
('Carlos Lima', 'carlos.lima@email.com', 'senha202', 'Aluno');

INSERT INTO CURSOS (codigo_EM, nome, tipo, duracao, descricao_cur) VALUES
('EM001', 'Ensino Médio - Ciências', 'Ensino Médio', '3 anos', 'Curso focado em ciências naturais e exatas.'),
('EM002', 'Ensino Médio - Humanas', 'Ensino Médio', '3 anos', 'Curso focado em história, geografia e literatura.');

INSERT INTO NECESSIDADES_ESPECIFICAS (descricao) VALUES
('Deficiência visual'),
('Deficiência auditiva'),
('Dificuldades de aprendizagem'),
('Mobilidade reduzida');

INSERT INTO ALUNOS (id_usuario, nome_social, matricula, curso, turma) VALUES
(3, 'Pedro Santos Jr.', 'MAT2023001', 'EM001', 'Turma A'),
(5, 'Carlos Lima Neto', 'MAT2023002', 'EM002', 'Turma B');

INSERT INTO MATRIZES_CURRICULARES (codigo_curso, ano_semestre, grade_referencia) VALUES
('EM001', '2023/1', 'Grade 2023'),
('EM002', '2023/2', 'Grade 2023');

INSERT INTO COMPONENTES_CURRICULARES (codigo_componente, id_matriz, nome) VALUES
('COMP001', 1, 'Matemática'),
('COMP002', 1, 'Física'),
('COMP003', 2, 'História'),
('COMP004', 2, 'Geografia');

INSERT INTO PEIGERAL (id_aluno, ano_letivo, semestre, objetivos, metodologia, avaliacoes, atend_educacional) VALUES
(1, '2023', '1', 'Melhorar habilidades em matemática.', 'Aulas adaptadas com materiais visuais.', 'Provas mensais e feedback.', 'Suporte pedagógico individual.'),
(2, '2023', '2', 'Desenvolver compreensão em história.', 'Discussões em grupo e leituras adaptadas.', 'Trabalhos práticos.', 'Acompanhamento semanal.');

INSERT INTO PEICOMPONENTE (id_pei_geral, cod_componente, tipo, objetivos, conteudo, metodologia, data_inicio, data_fim, status_componente, obs_componente) VALUES
(1, 'COMP001', 'Adaptado', 'Aprofundar conceitos de álgebra.', 'Equações e funções.', 'Aulas com calculadora adaptada.', '2023-02-01', '2023-06-30', 'Em andamento', 'Necessita de material braille.'),
(1, 'COMP002', 'Padrão', 'Entender leis da física.', 'Movimento e energia.', 'Experimentos práticos.', '2023-02-01', '2023-06-30', 'Concluído', 'Bom desempenho.'),
(2, 'COMP003', 'Adaptado', 'Analisar eventos históricos.', 'Revolução Industrial.', 'Vídeos e discussões.', '2023-08-01', '2023-12-31', 'Em andamento', 'Adaptação para audição.');

INSERT INTO ADAPTACOES (id_pei_comp, tipo_adaptacao, descricao) VALUES
(1, 'Material', 'Uso de calculadora braille para deficientes visuais.'),
(3, 'Metodologia', 'Vídeos com legendas para deficientes auditivos.');

INSERT INTO COMENTARIOS (id_pei_comp, id_usuario, comentario, data) VALUES
(1, 1, 'O aluno progrediu bem nesta semana.', '2023-03-15 10:00:00'),
(2, 4, 'Sugiro mais exercícios práticos.', '2023-04-20 14:30:00'),
(3, 2, 'A adaptação está funcionando.', '2023-09-10 09:15:00');

INSERT INTO DIAGNOSTICO (id_aluno, laudo, data_diagnostico, tipo_necessidade) VALUES
(1, 'Deficiência visual moderada, necessita de materiais adaptados.', '2023-01-10', 'Deficiência visual'),
(2, 'Dificuldades auditivas leves, recomenda legendas.', '2023-01-15', 'Deficiência auditiva');

INSERT INTO ACOMPANHAMENTO (id_aluno, data_acompanhamento, descricao_acompanhamento) VALUES
(1, '2023-03-01', 'Reunião com família para discutir progresso.'),
(2, '2023-09-05', 'Avaliação mensal positiva.');

INSERT INTO ESTUDANTES_NECESSIDADES (id_aluno, id_necessidade) VALUES
(1, 1),
(2, 2);