<?php

require_once "models/class.PeiAdaptacao.php";
require_once "lib/class.PeiAdaptacaoDAO.php";
require_once "interface.Controller.php";

class PeiAdaptacaoController implements Controller {
    private $dao;

    function __construct() { $this->dao = new PeiAdaptacaoDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $p = new PeiAdaptacao();
        $p->setPeiGeralId($_POST['pei_geral_id']);
        $p->setCodigoComponente($_POST['codigo_componente']);
        $p->setEmenta($_POST['ementa']);
        $p->setObjetivoGeral($_POST['objetivo_geral']);
        $p->setObjetivosEspecificos($_POST['objetivos_especificos']);
        $p->setConteudos($_POST['conteudos']);
        $p->setMetodologia($_POST['metodologia']);
        $p->setAvaliacao($_POST['avaliacao']);
        $p->setComentariosNapne($_POST['comentarios_napne']);
        $p->setDocente($_POST['docente']);
        return $this->dao->inserir($p);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $p = new PeiAdaptacao();
        $p->setPeiGeralId($dados->pei_geral_id);
        $p->setCodigoComponente($dados->codigo_componente);
        $p->setEmenta($dados->ementa);
        $p->setObjetivoGeral($dados->objetivo_geral);
        $p->setObjetivosEspecificos($dados->objetivos_especificos);
        $p->setConteudos($dados->conteudos);
        $p->setMetodologia($dados->metodologia);
        $p->setAvaliacao($dados->avaliacao);
        $p->setComentariosNapne($dados->comentarios_napne);
        $p->setDocente($dados->docente);
        return $this->dao->editar($id, $p);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>