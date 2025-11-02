<?php

require_once "models/class.Estudante.php";
require_once "lib/class.EstudanteDAO.php";
require_once "interface.Controller.php";

class EstudanteController implements Controller {
    private $dao;

    function __construct() { $this->dao = new EstudanteDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $e = new Estudante();
        $e->setCpf($_POST['cpf']);
        $e->setNome($_POST['nome']);
        $e->setContato($_POST['contato']);
        $e->setEndereco($_POST['endereco']);
        $e->setPrecisaAtendimentoPsicopedagogico($_POST['precisa_atendimento_psicopedagogico']);
        return $this->dao->inserir($e);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $e = new Estudante();
        $e->setCpf($dados->cpf);
        $e->setNome($dados->nome);
        $e->setContato($dados->contato);
        $e->setEndereco($dados->endereco);
        $e->setPrecisaAtendimentoPsicopedagogico($dados->precisa_atendimento_psicopedagogico);
        return $this->dao->editar($id, $e);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>