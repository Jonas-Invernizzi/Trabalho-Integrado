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
        // Aceitar tanto POST quanto JSON
        $dados = !empty($_POST) ? $_POST : json_decode(file_get_contents('php://input'), true);
        
        $e = new Estudante();
        // Mapear campos do frontend para o backend
        $cpf = str_replace(['.', '-'], '', $dados['cpf'] ?? $dados['cpf'] ?? '');
        $e->setCpf($cpf);
        $e->setNome($dados['nome'] ?? $dados['name'] ?? '');
        $e->setContato($dados['contato'] ?? $dados['phone'] ?? '');
        $e->setEndereco($dados['endereco'] ?? $dados['address'] ?? '');
        // Garantir que precisa_atendimento_psicopedagogico seja sempre inteiro (0 ou 1)
        $precisaAtendimento = $dados['precisa_atendimento_psicopedagogico'] ?? $dados['psychopedagogical'] ?? 0;
        // Converter para inteiro: true/1/'1' -> 1, false/0/'0'/''/null -> 0
        $precisaAtendimento = ($precisaAtendimento === true || $precisaAtendimento === 'true' || $precisaAtendimento === '1' || $precisaAtendimento === 1) ? 1 : 0;
        $e->setPrecisaAtendimentoPsicopedagogico($precisaAtendimento);
        
        $estudante = $this->dao->inserir($e);
        
        // Se vier matrícula e curso, criar matrícula também
        if (isset($dados['matricula']) && isset($dados['courseId'])) {
            require_once "models/class.Matricula.php";
            require_once "lib/class.MatriculaDAO.php";
            $matriculaDAO = new MatriculaDAO();
            $m = new Matricula();
            $m->setMatricula($dados['matricula']);
            $m->setEstudanteId($estudante->getIdAluno());
            $m->setCursoId($dados['courseId']);
            $m->setAtivo(true);
            $matriculaDAO->inserir($m);
        }
        
        return $estudante;
    }

    function editar($id) {
        $dados = json_decode(file_get_contents('php://input'), true);
        
        $e = new Estudante();
        $cpf = str_replace(['.', '-'], '', $dados['cpf'] ?? '');
        $e->setCpf($cpf);
        $e->setNome($dados['nome'] ?? $dados['name'] ?? '');
        $e->setContato($dados['contato'] ?? $dados['phone'] ?? '');
        $e->setEndereco($dados['endereco'] ?? $dados['address'] ?? '');
        // Garantir que precisa_atendimento_psicopedagogico seja sempre inteiro (0 ou 1)
        $precisaAtendimento = $dados['precisa_atendimento_psicopedagogico'] ?? $dados['psychopedagogical'] ?? 0;
        // Converter para inteiro: true/1/'1' -> 1, false/0/'0'/''/null -> 0
        $precisaAtendimento = ($precisaAtendimento === true || $precisaAtendimento === 'true' || $precisaAtendimento === '1' || $precisaAtendimento === 1) ? 1 : 0;
        $e->setPrecisaAtendimentoPsicopedagogico($precisaAtendimento);
        return $this->dao->editar($id, $e);
    }

    function apagar($id) {
        return $this->dao->apagar($id);
    }
}

?>