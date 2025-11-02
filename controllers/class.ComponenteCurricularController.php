<?php

require_once "models/class.ComponenteCurricular.php";
require_once "lib/class.ComponenteCurricularDAO.php";
require_once "interface.Controller.php";

class ComponenteCurricularController implements Controller {
    private $dao;

    function __construct() { $this->dao = new ComponenteCurricularDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $c = new ComponenteCurricular();
        $c->setComponente($_POST['componente']);
        $c->setCargaHoraria($_POST['carga_horaria']);
        return $this->dao->inserir($c);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $c = new ComponenteCurricular();
        $c->setComponente($dados->componente);
        $c->setCargaHoraria($dados->carga_horaria);
        return $this->dao->editar($id, $c);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>