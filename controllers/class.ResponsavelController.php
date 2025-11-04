<?php

require_once "models/class.Responsavel.php";
require_once "lib/class.ResponsavelDAO.php";
require_once "interface.Controller.php";

class ResponsavelController implements Controller {
    private $dao;

    function __construct() { $this->dao = new ResponsavelDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $r = new Responsavel();
        $r->setNomeResponsavel($_POST['nome_responsavel']);
        $r->setCpfResponsavel($_POST['cpf_responsavel']);
        $r->setContatoResponsavel($_POST['contato_responsavel']);
        $r->setEnderecoResponsavel($_POST['endereco_responsavel']);
        return $this->dao->inserir($r);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $r = new Responsavel();
        $r->setNomeResponsavel($dados->nome_responsavel);
        $r->setCpfResponsavel($dados->cpf_responsavel);
        $r->setContatoResponsavel($dados->contato_responsavel);
        $r->setEnderecoResponsavel($dados->endereco_responsavel);
        return $this->dao->editar($id, $r);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>