<?php
require_once "class.Banco.php";
require_once "models/class.ComponenteCurricular.php";

class ComponenteCurricularDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "SELECT codigo_componente, componente, carga_horaria FROM COMPONENTES_CURRICULARES";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, ComponenteCurricular::class);
        $componentes = $stmt->fetchAll();

        return $componentes ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT codigo_componente, componente, carga_horaria FROM COMPONENTES_CURRICULARES WHERE codigo_componente = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, ComponenteCurricular::class);
        $componente = $stmt->fetch();

        return $componente ?: null;
    }

    function inserir(ComponenteCurricular $componente) {
        $sql = "INSERT INTO COMPONENTES_CURRICULARES(componente, carga_horaria) VALUES (:componente, :carga_horaria)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':componente' => $componente->getComponente(),
            ':carga_horaria' => $componente->getCargaHoraria()
        ]);

        if ($resultado) {
            $id = $this->pdo->lastInsertId();
            return $this->buscarPorId($id);
        }
    }

    function editar($id, $componente) {
        $c = $this->buscarPorId($id);
        if (!$c) 
            throw new Exception("Componente curricular não encontrado!");

        $sql = "UPDATE COMPONENTES_CURRICULARES SET componente=:componente, carga_horaria=:carga_horaria WHERE codigo_componente=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':componente', $componente->getComponente());
        $query->bindValue(':carga_horaria', $componente->getCargaHoraria());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $c->setComponente($componente->getComponente());
        $c->setCargaHoraria($componente->getCargaHoraria());
        return $c;
    }

    function apagar($id) {
        $componente = $this->buscarPorId($id);
        if (!$componente) 
            throw new Exception("Componente curricular não encontrado!");

        $sql = "DELETE FROM COMPONENTES_CURRICULARES WHERE codigo_componente=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $componente;
    }
}
?>