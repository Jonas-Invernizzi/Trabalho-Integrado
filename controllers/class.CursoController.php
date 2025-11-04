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
        // Aceitar tanto POST quanto JSON
        $dados = !empty($_POST) ? $_POST : json_decode(file_get_contents('php://input'), true);
        
        // Gerar código se não fornecido
        $codigo = $dados['codigo'] ?? $dados['code'] ?? 'CURSO-' . strtoupper(substr(md5(time()), 0, 8));
        
        $c = new Curso();
        $c->setCodigo($codigo);
        $c->setNome($dados['nome'] ?? $dados['name'] ?? '');
        $c->setModalidade($dados['modalidade'] ?? $dados['level'] ?? '');
        $c->setCargaHoraria($dados['carga_horaria'] ?? $dados['workload'] ?? null);
        $c->setDuracao($dados['duracao'] ?? $dados['duration'] ?? '');
        $c->setCoordenadorCpf($dados['coordenador_cpf'] ?? $dados['coordinator_cpf'] ?? null);
        
        return $this->dao->inserir($c);
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $c = new Curso();
        $c->setCodigo($id); // Manter o código original
        $c->setNome($dados['nome'] ?? $dados['name'] ?? '');
        $c->setModalidade($dados['modalidade'] ?? $dados['level'] ?? '');
        $c->setCargaHoraria($dados['carga_horaria'] ?? $dados['workload'] ?? null);
        $c->setDuracao($dados['duracao'] ?? $dados['duration'] ?? '');
        $c->setCoordenadorCpf($dados['coordenador_cpf'] ?? $dados['coordinator_cpf'] ?? null);
        return $this->dao->editar($id, $c);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>