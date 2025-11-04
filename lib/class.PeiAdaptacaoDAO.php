<?php
require_once "class.Banco.php";
require_once "models/class.PeiAdaptacao.php";

class PeiAdaptacaoDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "
            SELECT pa.id, pa.pei_geral_id, pa.codigo_componente, pa.ementa, pa.objetivo_geral, pa.objetivos_especificos, pa.conteudos, pa.metodologia, pa.avaliacao, pa.data_criacao, pa.data_atualizacao, pa.comentarios_napne, pa.docente, pg.matricula, cc.componente 
            FROM PEI_ADAPTACAO pa 
            INNER JOIN PEI_GERAL pg ON (pa.pei_geral_id = pg.id) 
            INNER JOIN COMPONENTES_CURRICULARES cc ON (pa.codigo_componente = cc.codigo_componente)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, PeiAdaptacao::class);
        $peis = $stmt->fetchAll();

        return $peis ?: [];
    }

        function buscarPorId($id) {
        $sql = "SELECT id, pei_geral_id, codigo_componente, ementa, objetivo_geral, objetivos_especificos, conteudos, metodologia, avaliacao, data_criacao, data_atualizacao, comentarios_napne, docente FROM PEI_ADAPTACAO WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, PeiAdaptacao::class);
        $pei = $stmt->fetch();

        return $pei ?: null;
    }

    function inserir(PeiAdaptacao $pei) {
        $sql = "INSERT INTO PEI_ADAPTACAO(pei_geral_id, codigo_componente, ementa, objetivo_geral, objetivos_especificos, conteudos, metodologia, avaliacao, comentarios_napne, docente) VALUES (:pei_geral_id, :codigo_componente, :ementa, :objetivo_geral, :objetivos_especificos, :conteudos, :metodologia, :avaliacao, :comentarios_napne, :docente)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':pei_geral_id' => $pei->getPeiGeralId(),
            ':codigo_componente' => $pei->getCodigoComponente(),
            ':ementa' => $pei->getEmenta(),
            ':objetivo_geral' => $pei->getObjetivoGeral(),
            ':objetivos_especificos' => $pei->getObjetivosEspecificos(),
            ':conteudos' => $pei->getConteudos(),
            ':metodologia' => $pei->getMetodologia(),
            ':avaliacao' => $pei->getAvaliacao(),
            ':comentarios_napne' => $pei->getComentariosNapne(),
            ':docente' => $pei->getDocente()
        ]);

        if ($resultado) {
            $id = $this->pdo->lastInsertId();
            return $this->buscarPorId($id);
        }
    }

    function editar($id, $pei) {
        $p = $this->buscarPorId($id);
        if (!$p) 
            throw new Exception("PEI Adaptação não encontrado!");

        $sql = "UPDATE PEI_ADAPTACAO SET pei_geral_id=:pei_geral_id, codigo_componente=:codigo_componente, ementa=:ementa, objetivo_geral=:objetivo_geral, objetivos_especificos=:objetivos_especificos, conteudos=:conteudos, metodologia=:metodologia, avaliacao=:avaliacao, comentarios_napne=:comentarios_napne, docente=:docente WHERE id=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':pei_geral_id', $pei->getPeiGeralId());
        $query->bindValue(':codigo_componente', $pei->getCodigoComponente());
        $query->bindValue(':ementa', $pei->getEmenta());
        $query->bindValue(':objetivo_geral', $pei->getObjetivoGeral());
        $query->bindValue(':objetivos_especificos', $pei->getObjetivosEspecificos());
        $query->bindValue(':conteudos', $pei->getConteudos());
        $query->bindValue(':metodologia', $pei->getMetodologia());
        $query->bindValue(':avaliacao', $pei->getAvaliacao());
        $query->bindValue(':comentarios_napne', $pei->getComentariosNapne());
        $query->bindValue(':docente', $pei->getDocente());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $p->setPeiGeralId($pei->getPeiGeralId());
        $p->setCodigoComponente($pei->getCodigoComponente());
        $p->setEmenta($pei->getEmenta());
        $p->setObjetivoGeral($pei->getObjetivoGeral());
        $p->setObjetivosEspecificos($pei->getObjetivosEspecificos());
        $p->setConteudos($pei->getConteudos());
        $p->setMetodologia($pei->getMetodologia());
        $p->setAvaliacao($pei->getAvaliacao());
        $p->setComentariosNapne($pei->getComentariosNapne());
        $p->setDocente($pei->getDocente());
        return $p;
    }

    function apagar($id) {
        $pei = $this->buscarPorId($id);
        if (!$pei) 
            throw new Exception("PEI Adaptação não encontrado!");

        $sql = "DELETE FROM PEI_ADAPTACAO WHERE id=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $pei;
    }
}
?>