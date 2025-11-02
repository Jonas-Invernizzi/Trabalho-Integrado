<?php

require_once "models/class.Comentario.php";
require_once "lib/class.ComentarioDAO.php";
require_once "interface.Controller.php";

class ComentarioController implements Controller {
    private $dao;

    function __construct() { $this->dao = new ComentarioDAO(); }

    function getTodos(){
        return $this->dao->buscarTodos();
    }

    function getPorId($id) {
        return $this->dao->buscarPorId($id);
    }
    
    function criar() {
        $c = new Comentario();
        $c->setParecerId($_POST['parecer_id']);
        $c->setUsuarioId($_POST['usuario_id']);
        $c->setComentarios($_POST['comentarios']);
        return $this->dao->inserir($c);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'));
        
        $c = new Comentario();
        $c->setParecerId($dados->parecer_id);
        $c->setUsuarioId($dados->usuario_id);
        $c->setComentarios($dados->comentarios);
        return $this->dao->editar($id, $c);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>