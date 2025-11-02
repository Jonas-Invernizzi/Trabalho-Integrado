<?php

require_once "models/class.PeiGeral.php";
require_once "lib/class.PeiGeralDAO.php";
require_once "interface.Controller.php";

class PeiGeralController implements Controller {
    private $dao;

    function __construct() { $this->dao = new PeiGeralDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $p = new PeiGeral();
        $p->setMatricula($_POST['matricula']);
        $p->setPeriodo($_POST['periodo']);
        $p->setDificuldades($_POST['dificuldades']);
        $p->setInteressesHabilidades($_POST['interesses_habilidades']);
        $p->setEstrategias($_POST['estrategias']);
        return $this->dao->inserir($p);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $p = new PeiGeral();
        $p->setMatricula($dados->matricula);
        $p->setPeriodo($dados->periodo);
        $p->setDificuldades($dados->dificuldades);
        $p->setInteressesHabilidades($dados->interesses_habilidades);
        $p->setEstrategias($dados->estrategias);
        return $this->dao->editar($id, $p);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>