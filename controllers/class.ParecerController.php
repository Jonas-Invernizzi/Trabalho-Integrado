<?php

require_once "models/class.Parecer.php";
require_once "lib/class.ParecerDAO.php";
require_once "interface.Controller.php";

class ParecerController implements Controller {
    private $dao;

    function __construct() { $this->dao = new ParecerDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $p = new Parecer();
        $p->setPeiAdaptacaoId($_POST['pei_adaptacao_id']);
        $p->setPeriodo($_POST['periodo']);
        $p->setDescricao($_POST['descricao']);
        $p->setComentarios($_POST['comentarios']);
        return $this->dao->inserir($p);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $p = new Parecer();
        $p->setPeiAdaptacaoId($dados->pei_adaptacao_id);
        $p->setPeriodo($dados->periodo);
        $p->setDescricao($dados->descricao);
        $p->setComentarios($dados->comentarios);
        return $this->dao->editar($id, $p);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>