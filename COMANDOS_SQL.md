# Comandos SQL - Guia Rápido

## Como executar comandos SQL no terminal

### 1. Conectar ao MySQL do XAMPP

```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE
```

**Ou use o alias (se configurado):**
```bash
mysqlxampp NAPNE
```

### 2. Comandos SQL úteis

#### Ver todas as tabelas:
```sql
SHOW TABLES;
```

#### Ver estrutura de uma tabela:
```sql
DESCRIBE NOME_DA_TABELA;
-- ou
SHOW CREATE TABLE NOME_DA_TABELA;
```

#### Selecionar dados:
```sql
SELECT * FROM ESTUDANTES;
SELECT * FROM CURSOS;
SELECT * FROM PEI_GERAL;
SELECT * FROM PEI_ADAPTACAO;
SELECT * FROM COMPONENTES_CURRICULARES;
```

#### Contar registros:
```sql
SELECT COUNT(*) FROM ESTUDANTES;
SELECT COUNT(*) FROM CURSOS;
SELECT COUNT(*) FROM PEI_GERAL;
```

#### Inserir dados:
```sql
INSERT INTO ESTUDANTES (cpf, nome, contato) VALUES ('12345678900', 'João Silva', '999999999');
INSERT INTO CURSOS (codigo, nome, modalidade) VALUES ('TEC001', 'Técnico em Informática', 'Técnico');
```

#### Atualizar dados:
```sql
UPDATE ESTUDANTES SET nome = 'João Silva Santos' WHERE id_aluno = 1;
```

#### Deletar dados:
```sql
DELETE FROM ESTUDANTES WHERE id_aluno = 1;
```

#### Limpar tabela (manter estrutura):
```sql
TRUNCATE TABLE NOME_DA_TABELA;
```

#### Executar arquivo SQL:
```sql
SOURCE /caminho/para/arquivo.sql;
```

### 3. Executar comandos SQL diretamente (sem entrar no MySQL)

#### Executar um comando único:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE -e "SELECT * FROM ESTUDANTES;"
```

#### Executar arquivo SQL:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE < estrutura.sql
```

#### Executar múltiplos comandos:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE <<EOF
SELECT * FROM ESTUDANTES;
SELECT * FROM CURSOS;
SELECT COUNT(*) as total_peis FROM PEI_GERAL;
EOF
```

### 4. Exportar e Importar

#### Exportar banco de dados:
```bash
/Applications/XAMPP/xamppfiles/bin/mysqldump -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE > backup.sql
```

#### Importar banco de dados:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE < backup.sql
```

### 5. Consultas úteis para o sistema NAPNE

#### Ver todos os estudantes com suas matrículas:
```sql
SELECT e.id_aluno, e.nome, e.cpf, m.matricula, c.nome as curso
FROM ESTUDANTES e
LEFT JOIN MATRICULAS m ON e.id_aluno = m.estudante_id
LEFT JOIN CURSOS c ON m.curso_id = c.codigo;
```

#### Ver todos os PEIs com informações completas:
```sql
SELECT 
    pg.id as pei_id,
    e.nome as estudante,
    c.nome as curso,
    pg.periodo,
    COUNT(pa.id) as total_adaptacoes
FROM PEI_GERAL pg
JOIN MATRICULAS m ON pg.matricula = m.matricula
JOIN ESTUDANTES e ON m.estudante_id = e.id_aluno
JOIN CURSOS c ON m.curso_id = c.codigo
LEFT JOIN PEI_ADAPTACAO pa ON pa.pei_geral_id = pg.id
GROUP BY pg.id, e.nome, c.nome, pg.periodo;
```

#### Ver componentes curriculares:
```sql
SELECT codigo_componente, componente, carga_horaria 
FROM COMPONENTES_CURRICULARES 
ORDER BY codigo_componente;
```

#### Ver servidores (professores):
```sql
SELECT siape, nome, email, tipo 
FROM SERVIDORES 
WHERE tipo = 'Docente';
```

### 6. Limpar banco de dados (CUIDADO!)

```sql
-- Desabilitar verificação de foreign keys temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpar todas as tabelas
TRUNCATE TABLE COMENTARIOS;
TRUNCATE TABLE PARECERES;
TRUNCATE TABLE PEI_ADAPTACAO;
TRUNCATE TABLE PEI_GERAL;
TRUNCATE TABLE ESTUDANTES_NECESSIDADES;
TRUNCATE TABLE MATRICULAS;
TRUNCATE TABLE ESTUDANTES;
TRUNCATE TABLE COMPONENTES_CURRICULARES;
TRUNCATE TABLE CURSOS;
TRUNCATE TABLE SERVIDORES;
TRUNCATE TABLE USUARIOS;

-- Reabilitar verificação de foreign keys
SET FOREIGN_KEY_CHECKS = 1;
```

### 7. Verificar integridade do banco

```sql
-- Verificar foreign keys
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'NAPNE'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### 8. Criar alias para facilitar (opcional)

Adicione ao seu `~/.zshrc` ou `~/.bash_profile`:

```bash
alias mysqlxampp='/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
alias mysqlxampp-napne='/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE'
```

Depois execute:
```bash
source ~/.zshrc  # ou source ~/.bash_profile
```

Agora você pode usar simplesmente:
```bash
mysqlxampp-napne -e "SELECT * FROM ESTUDANTES;"
```


