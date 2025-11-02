<?php

require_once "models/class.Matricula.php";
require_once "lib/class.MatriculaDAO.php";
require_once "interface.Controller.php";

class MatriculaController implements Controller {
    private $dao;

    function __construct() { $this->dao = new MatriculaDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $m = new Matricula();
        $m->setEstudanteId($_POST['estudante_id']);
        $m->setCursoId($_POST['curso_id']);
        $m->setAtivo($_POST['ativo']);
        return $this->dao->inserir($m);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $m = new Matricula();
        $m->setEstudanteId($dados->estudante_id);
        $m->setCursoId($dados->curso_id);
        $m->setAtivo($dados->ativo);
        return $this->dao->editar($id, $m);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>