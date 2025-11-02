<?php

require_once "models/class.Usuario.php";
require_once "lib/class.UsuarioDAO.php";
require_once "interface.Controller.php";

class UsuarioController implements Controller {
    private $dao;

    function __construct() { $this->dao = new UsuarioDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $u = new Usuario();
        $u->setUsername($_POST['username']);
        $u->setSenha($_POST['senha']);
        return $this->dao->inserir($u);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $u = new Usuario();
        $u->setUsername($dados->username);
        $u->setSenha($dados->senha);
        return $this->dao->editar($id, $u);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>