<?php
require_once "class.Banco.php";
require_once "models/class.Matricula.php";

class MatriculaDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "
            SELECT m.matricula, m.estudante_id, m.curso_id, m.ativo, e.nome as estudante_nome, c.nome as curso_nome 
            FROM MATRICULAS m 
            INNER JOIN ESTUDANTES e ON (m.estudante_id = e.id_aluno) 
            INNER JOIN CURSOS c ON (m.curso_id = c.codigo)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Matricula::class);
        $matriculas = $stmt->fetchAll();

        return $matriculas ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT matricula, estudante_id, curso_id, ativo FROM MATRICULAS WHERE matricula = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Matricula::class);
        $matricula = $stmt->fetch();

        return $matricula ?: null;
    }

    function inserir(Matricula $matricula) {
        $sql = "INSERT INTO MATRICULAS(matricula, estudante_id, curso_id, ativo) VALUES (:matricula, :estudante_id, :curso_id, :ativo)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':matricula' => $matricula->getMatricula(),
            ':estudante_id' => $matricula->getEstudanteId(),
            ':curso_id' => $matricula->getCursoId(),
            ':ativo' => $matricula->getAtivo()
        ]);

        if ($resultado) {
            return $this->buscarPorId($matricula->getMatricula());
        }
    }

    function editar($id, $matricula) {
        $m = $this->buscarPorId($id);
        if (!$m) 
            throw new Exception("Matrícula não encontrada!");

        $sql = "UPDATE MATRICULAS SET estudante_id=:estudante_id, curso_id=:curso_id, ativo=:ativo WHERE matricula=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':estudante_id', $matricula->getEstudanteId());
        $query->bindValue(':curso_id', $matricula->getCursoId());
        $query->bindValue(':ativo', $matricula->getAtivo());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $m->setEstudanteId($matricula->getEstudanteId());
        $m->setCursoId($matricula->getCursoId());
        $m->setAtivo($matricula->getAtivo());
        return $m;
    }

    function apagar($id) {
        $matricula = $this->buscarPorId($id);
        if (!$matricula) 
            throw new Exception("Matrícula não encontrada!");

        $sql = "DELETE FROM MATRICULAS WHERE matricula=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $matricula;
    }
}
?>