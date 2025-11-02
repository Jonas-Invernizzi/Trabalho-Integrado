<?php
require_once "class.Banco.php";
require_once "models/class.ComponentesCurriculares.php";

class ComponentesCurricularesDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "SELECT codigo_componente, componente, carga_horaria FROM componentes_curriculares";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, ComponentesCurriculares::class);
        $componentes = $stmt->fetchAll();

        return $componentes ?: [];
    }

    function buscarPorId($codigo) {
        $sql = "SELECT codigo_componente, componente, carga_horaria FROM componentes_curriculares WHERE codigo_componente = :codigo";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':codigo' => $codigo]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, ComponentesCurriculares::class);
        $componente = $stmt->fetch();

        return $componente ?: null;
    }

    function inserir(ComponentesCurriculares $componente) {
        $sql = "INSERT INTO componentes_curriculares(codigo_componente, componente, carga_horaria) VALUES (:codigo, :componente, :carga)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':codigo' => $componente->getCodigoComponente(),
            ':componente' => $componente->getComponente(),
            ':carga' => $componente->getCargaHoraria()
        ]);

        if ($resultado) {
            return $this->buscarPorId($componente->getCodigoComponente());
        }
    }

    function editar($codigo, ComponentesCurriculares $componente) {
        $c = $this->buscarPorId($codigo);
        if (!$c) 
            throw new Exception("Componente não encontrado!");

        $sql = "UPDATE componentes_curriculares SET componente=:componente, carga_horaria=:carga WHERE codigo_componente=:codigo";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':componente', $componente->getComponente());
        $query->bindValue(':carga', $componente->getCargaHoraria());
        $query->bindValue(':codigo', $codigo);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $c->setComponente($componente->getComponente());
        $c->setCargaHoraria($componente->getCargaHoraria());
        return $c;
    }

    function apagar($codigo) {
        $componente = $this->buscarPorId($codigo);
        if (!$componente) 
            throw new Exception("Componente não encontrado!");

        $sql = "DELETE FROM componentes_curriculares WHERE codigo_componente=:codigo";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':codigo', $codigo);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");

        return $componente;
    }
}
?>