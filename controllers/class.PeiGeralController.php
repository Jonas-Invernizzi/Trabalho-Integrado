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
        // Aceitar tanto POST quanto JSON
        $dados = !empty($_POST) ? $_POST : json_decode(file_get_contents('php://input'), true);
        
        $p = new PeiGeral();
        $p->setMatricula($dados['matricula'] ?? $dados['matricula'] ?? '');
        $p->setPeriodo($dados['periodo'] ?? $dados['periodo'] ?? '');
        $p->setDificuldades($dados['dificuldades'] ?? $dados['dificuldades'] ?? '');
        $p->setInteressesHabilidades($dados['interesses_habilidades'] ?? $dados['interesses_habilidades'] ?? '');
        $p->setEstrategias($dados['estrategias'] ?? $dados['estrategias'] ?? '');
        return $this->dao->inserir($p);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $p = new PeiGeral();
        $p->setMatricula($dados['matricula'] ?? '');
        $p->setPeriodo($dados['periodo'] ?? '');
        $p->setDificuldades($dados['dificuldades'] ?? '');
        $p->setInteressesHabilidades($dados['interesses_habilidades'] ?? '');
        $p->setEstrategias($dados['estrategias'] ?? '');
        return $this->dao->editar($id, $p);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>