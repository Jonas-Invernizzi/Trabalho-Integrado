<?php
require_once "class.Banco.php";
require_once "models/class.PeiGeral.php";

class PeiGeralDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "
            SELECT pg.id, pg.matricula, pg.periodo, pg.dificuldades, pg.interesses_habilidades, pg.estrategias, pg.data_criacao, pg.data_atualizacao, m.estudante_id, m.curso_id 
            FROM PEI_GERAL pg 
            INNER JOIN MATRICULAS m ON (pg.matricula = m.matricula)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, PeiGeral::class);
        $peis = $stmt->fetchAll();

        return $peis ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT id, matricula, periodo, dificuldades, interesses_habilidades, estrategias, data_criacao, data_atualizacao FROM PEI_GERAL WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, PeiGeral::class);
        $pei = $stmt->fetch();

        return $pei ?: null;
    }

    function inserir(PeiGeral $pei) {
        $sql = "INSERT INTO PEI_GERAL(matricula, periodo, dificuldades, interesses_habilidades, estrategias) VALUES (:matricula, :periodo, :dificuldades, :interesses_habilidades, :estrategias)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':matricula' => $pei->getMatricula(),
            ':periodo' => $pei->getPeriodo(),
            ':dificuldades' => $pei->getDificuldades(),
            ':interesses_habilidades' => $pei->getInteressesHabilidades(),
            ':estrategias' => $pei->getEstrategias()
        ]);

        if ($resultado) {
            $id = $this->pdo->lastInsertId();
            return $this->buscarPorId($id);
        }
    }

    function editar($id, $pei) {
        $p = $this->buscarPorId($id);
        if (!$p) 
            throw new Exception("PEI Geral não encontrado!");

        $sql = "UPDATE PEI_GERAL SET matricula=:matricula, periodo=:periodo, dificuldades=:dificuldades, interesses_habilidades=:interesses_habilidades, estrategias=:estrategias WHERE id=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':matricula', $pei->getMatricula());
        $query->bindValue(':periodo', $pei->getPeriodo());
        $query->bindValue(':dificuldades', $pei->getDificuldades());
        $query->bindValue(':interesses_habilidades', $pei->getInteressesHabilidades());
        $query->bindValue(':estrategias', $pei->getEstrategias());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $p->setMatricula($pei->getMatricula());
        $p->setPeriodo($pei->getPeriodo());
        $p->setDificuldades($pei->getDificuldades());
        $p->setInteressesHabilidades($pei->getInteressesHabilidades());
        $p->setEstrategias($pei->getEstrategias());
        return $p;
    }

    function apagar($id) {
        $pei = $this->buscarPorId($id);
        if (!$pei) 
            throw new Exception("PEI Geral não encontrado!");

        $sql = "DELETE FROM PEI_GERAL WHERE id=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $pei;
    }
}
?>