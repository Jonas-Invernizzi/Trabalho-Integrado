<?php

require_once "models/class.NecessidadeEspecifica.php";
require_once "lib/class.NecessidadeEspecificaDAO.php";
require_once "interface.Controller.php";

class NecessidadeEspecificaController implements Controller {
    private $dao;

    function __construct() { $this->dao = new NecessidadeEspecificaDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $n = new NecessidadeEspecifica();
        $n->setNome($_POST['nome']);
        $n->setDescricao($_POST['descricao']);
        return $this->dao->inserir($n);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $n = new NecessidadeEspecifica();
        $n->setNome($dados->nome);
        $n->setDescricao($dados->descricao);
        return $this->dao->editar($id, $n);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>