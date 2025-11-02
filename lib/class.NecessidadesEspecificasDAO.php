<?php
require_once "class.Banco.php";
require_once "models/class.NecessidadesEspecificas.php";

class NecessidadesEspecificasDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "SELECT necessidade_id, nome, descricao FROM necessidades_especificas";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, NecessidadesEspecificas::class);
        $necessidades = $stmt->fetchAll();

        return $necessidades ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT necessidade_id, nome, descricao FROM necessidades_especificas WHERE necessidade_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, NecessidadesEspecificas::class);
        $necessidade = $stmt->fetch();

        return $necessidade ?: null;
    }

    function inserir(NecessidadesEspecificas $necessidade) {
        $sql = "INSERT INTO necessidades_especificas(nome, descricao) VALUES (:nome, :descricao)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':nome' => $necessidade->getNome(),
            ':descricao' => $necessidade->getDescricao()
        ]);

        if ($resultado) {
            $id = $this->pdo->lastInsertId();
            return $this->buscarPorId($id);
        }
    }

    function editar($id, NecessidadesEspecificas $necessidade) {
        $n = $this->buscarPorId($id);
        if (!$n) 
            throw new Exception("Necessidade não encontrada!");

        $sql = "UPDATE necessidades_especificas SET nome=:nome, descricao=:descricao WHERE necessidade_id=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':nome', $necessidade->getNome());
        $query->bindValue(':descricao', $necessidade->getDescricao());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $n->setNome($necessidade->getNome());
        $n->setDescricao($necessidade->getDescricao());
        return $n;
    }

    function apagar($id) {
        $necessidade = $this->buscarPorId($id);
        if (!$necessidade) 
            throw new Exception("Necessidade não encontrada!");

        $sql = "DELETE FROM necessidades_especificas WHERE necessidade_id=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");

        return $necessidade;
    }
}
?>