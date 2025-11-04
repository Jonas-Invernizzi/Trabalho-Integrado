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
        // Aceitar tanto POST quanto JSON
        $dados = !empty($_POST) ? $_POST : json_decode(file_get_contents('php://input'), true);
        
        $s = new Servidor();
        $cpf = str_replace(['.', '-'], '', $dados['cpf'] ?? $dados['cpf'] ?? '');
        $s->setSiape(intval($dados['siape'] ?? $dados['siape'] ?? 0));
        $s->setCpf($cpf);
        $s->setNome($dados['nome'] ?? $dados['name'] ?? '');
        $s->setEmail($dados['email'] ?? $dados['email'] ?? '');
        $s->setTelefone($dados['telefone'] ?? $dados['phone'] ?? '');
        $s->setTipo($dados['tipo'] ?? $dados['type'] ?? '');
        return $this->dao->inserir($s);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $s = new Servidor();
        $cpf = str_replace(['.', '-'], '', $dados['cpf'] ?? '');
        $s->setCpf($cpf);
        $s->setNome($dados['nome'] ?? $dados['name'] ?? '');
        $s->setEmail($dados['email'] ?? '');
        $s->setTelefone($dados['telefone'] ?? $dados['phone'] ?? '');
        $s->setTipo($dados['tipo'] ?? $dados['type'] ?? '');
        return $this->dao->editar($id, $s);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>