<?php

require_once "models/class.RespEstudante.php";
require_once "lib/class.RespEstudanteDAO.php";
require_once "interface.Controller.php";

class RespEstudanteController implements Controller {
    private $dao;

    function __construct() { $this->dao = new RespEstudanteDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        // $id é uma string concatenada como "id_responsavel-id_aluno"
        $ids = explode('-', $id);
        $ids_array = ['id_responsavel' => $ids[0], 'id_aluno' => $ids[1]];
        return $this->dao->buscarPorId($ids_array);
    }
    
    function criar() {
        $re = new RespEstudante();
        $re->setIdResponsavel($_POST['id_responsavel']);
        $re->setIdAluno($_POST['id_aluno']);
        return $this->dao->inserir($re);
    }

    function editar($id) {
        // $id é uma string concatenada como "id_responsavel-id_aluno"
        $ids = explode('-', $id);
        $ids_array = ['id_responsavel' => $ids[0], 'id_aluno' => $ids[1]];
        
        $dados = json_decode(file_get_contents('php://input'));
        
        $re = new RespEstudante();
        $re->setIdResponsavel($dados->id_responsavel);
        $re->setIdAluno($dados->id_aluno);
        return $this->dao->editar($ids_array, $re);
    }

    function apagar($id) {
        // $id é uma string concatenada como "id_responsavel-id_aluno"
        $ids = explode('-', $id);
        $ids_array = ['id_responsavel' => $ids[0], 'id_aluno' => $ids[1]];
        return $this->dao->apagar($ids_array);
    }
}

?>