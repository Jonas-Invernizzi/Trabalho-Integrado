<?php

require_once "models/class.Curso.php";
require_once "lib/class.CursoDAO.php";
require_once "interface.Controller.php";

class CursoController implements Controller {
    private $dao;

    function __construct() { $this->dao = new CursoDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $c = new Curso();
        $c->setNome($_POST['nome']);
        $c->setModalidade($_POST['modalidade']);
        $c->setCargaHoraria($_POST['carga_horaria']);
        $c->setDuracao($_POST['duracao']);
        $c->setCoordenadorCpf($_POST['coordenador_cpf']);
        return $this->dao->inserir($c);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $c = new Curso();
        $c->setNome($dados->nome);
        $c->setModalidade($dados->modalidade);
        $c->setCargaHoraria($dados->carga_horaria);
        $c->setDuracao($dados->duracao);
        $c->setCoordenadorCpf($dados->coordenador_cpf);
        return $this->dao->editar($id, $c);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>