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
        // Aceitar tanto POST quanto JSON
        $dados = !empty($_POST) ? $_POST : json_decode(file_get_contents('php://input'), true);
        
        $p = new PeiAdaptacao();
        $p->setPeiGeralId(intval($dados['pei_geral_id'] ?? $dados['pei_geral_id'] ?? 0));
        $p->setCodigoComponente(intval($dados['codigo_componente'] ?? $dados['codigo_componente'] ?? 0));
        $p->setEmenta($dados['ementa'] ?? $dados['ementa'] ?? '');
        $p->setObjetivoGeral($dados['objetivo_geral'] ?? $dados['objetivo_geral'] ?? '');
        $p->setObjetivosEspecificos($dados['objetivos_especificos'] ?? $dados['objetivos_especificos'] ?? '');
        $p->setConteudos($dados['conteudos'] ?? $dados['conteudos'] ?? '');
        $p->setMetodologia($dados['metodologia'] ?? $dados['metodologia'] ?? '');
        $p->setAvaliacao($dados['avaliacao'] ?? $dados['avaliacao'] ?? '');
        $p->setComentariosNapne($dados['comentarios_napne'] ?? $dados['comentarios_napne'] ?? '');
        $p->setDocente($dados['docente'] ?? $dados['docente'] ?? '');
        return $this->dao->inserir($p);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $p = new PeiAdaptacao();
        $p->setPeiGeralId(intval($dados['pei_geral_id'] ?? 0));
        $p->setCodigoComponente(intval($dados['codigo_componente'] ?? 0));
        $p->setEmenta($dados['ementa'] ?? '');
        $p->setObjetivoGeral($dados['objetivo_geral'] ?? '');
        $p->setObjetivosEspecificos($dados['objetivos_especificos'] ?? '');
        $p->setConteudos($dados['conteudos'] ?? '');
        $p->setMetodologia($dados['metodologia'] ?? '');
        $p->setAvaliacao($dados['avaliacao'] ?? '');
        $p->setComentariosNapne($dados['comentarios_napne'] ?? '');
        $p->setDocente($dados['docente'] ?? '');
        return $this->dao->editar($id, $p);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>