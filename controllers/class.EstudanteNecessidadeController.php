<?php

require_once "models/class.EstudanteNecessidade.php";
require_once "lib/class.EstudanteNecessidadeDAO.php";
require_once "interface.Controller.php";

class EstudanteNecessidadeController implements Controller {
    private $dao;

    function __construct() { $this->dao = new EstudanteNecessidadeDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        $ids = explode('-', $id);
        $ids_array = ['estudante_cpf' => $ids[0], 'necessidade_id' => $ids[1]];
        return $this->dao->buscarPorId($ids_array);
    }
    
    function criar() {
        $en = new EstudanteNecessidade();
        $en->setEstudanteCpf($_POST['estudante_cpf']);
        $en->setNecessidadeId($_POST['necessidade_id']);
        return $this->dao->inserir($en);
    }

    function editar($id) {
        $ids = explode('-', $id);
        $ids_array = ['estudante_cpf' => $ids[0], 'necessidade_id' => $ids[1]];
        
        $dados = json_decode(file_get_contents('php://input'));
        
        $en = new EstudanteNecessidade();
        $en->setEstudanteCpf($dados->estudante_cpf);
        $en->setNecessidadeId($dados->necessidade_id);
        return $this->dao->editar($ids_array, $en);
    }

    function apagar($id) {
        $ids = explode('-', $id);
        $ids_array = ['estudante_cpf' => $ids[0], 'necessidade_id' => $ids[1]];
        return $this->dao->apagar($ids_array);
    }
}

?>