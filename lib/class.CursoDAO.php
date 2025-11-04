<?php
require_once "class.Banco.php";
require_once "models/class.Curso.php";

class CursoDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "
            SELECT c.codigo, c.nome, c.modalidade, c.carga_horaria, c.duracao, c.coordenador_cpf, s.nome as coordenador_nome 
            FROM CURSOS c 
            LEFT JOIN SERVIDORES s 
                ON (c.coordenador_cpf = s.cpf)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Curso::class);
        $cursos = $stmt->fetchAll();

        return $cursos ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT codigo, nome, modalidade, carga_horaria, duracao, coordenador_cpf FROM CURSOS WHERE codigo = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Curso::class);
        $curso = $stmt->fetch();

        return $curso ?: null;
    }

    function inserir(Curso $curso) {
        $sql = "INSERT INTO CURSOS(codigo, nome, modalidade, carga_horaria, duracao, coordenador_cpf) VALUES (:codigo, :nome, :modalidade, :carga_horaria, :duracao, :coordenador_cpf)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':codigo' => $curso->getCodigo(),
            ':nome' => $curso->getNome(),
            ':modalidade' => $curso->getModalidade(),
            ':carga_horaria' => $curso->getCargaHoraria(),
            ':duracao' => $curso->getDuracao(),
            ':coordenador_cpf' => $curso->getCoordenadorCpf()
        ]);

        if ($resultado) {
            return $this->buscarPorId($curso->getCodigo());
        }
    }

    function editar($id, $curso) {
        $c = $this->buscarPorId($id);
        if (!$c) 
            throw new Exception("Curso não encontrado!");

        $sql = "UPDATE CURSOS SET nome=:nome, modalidade=:modalidade, carga_horaria=:carga_horaria, duracao=:duracao, coordenador_cpf=:coordenador_cpf WHERE codigo=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':nome', $curso->getNome());
        $query->bindValue(':modalidade', $curso->getModalidade());
        $query->bindValue(':carga_horaria', $curso->getCargaHoraria());
        $query->bindValue(':duracao', $curso->getDuracao());
        $query->bindValue(':coordenador_cpf', $curso->getCoordenadorCpf());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $c->setNome($curso->getNome());
        $c->setModalidade($curso->getModalidade());
        $c->setCargaHoraria($curso->getCargaHoraria());
        $c->setDuracao($curso->getDuracao());
        $c->setCoordenadorCpf($curso->getCoordenadorCpf());
        return $c;
    }

    function apagar($id) {
        $curso = $this->buscarPorId($id);
        if (!$curso) 
            throw new Exception("Curso não encontrado!");

        $sql = "DELETE FROM CURSOS WHERE codigo=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $curso;
    }
}
?>