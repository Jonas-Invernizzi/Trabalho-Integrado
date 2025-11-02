<?php

require_once "models/class.Servidor.php";
require_once "lib/class.ServidorDAO.php";
require_once "interface.Controller.php";

class ServidorController implements Controller {
    private $dao;

    function __construct() { $this->dao = new ServidorDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $s = new Servidor();
        $s->setCpf($_POST['cpf']);
        $s->setNome($_POST['nome']);
        $s->setEmail($_POST['email']);
        $s->setTelefone($_POST['telefone']);
        $s->setTipo($_POST['tipo']);
        return $this->dao->inserir($s);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $s = new Servidor();
        $s->setCpf($dados->cpf);
        $s->setNome($dados->nome);
        $s->setEmail($dados->email);
        $s->setTelefone($dados->telefone);
        $s->setTipo($dados->tipo);
        return $this->dao->editar($id, $s);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>