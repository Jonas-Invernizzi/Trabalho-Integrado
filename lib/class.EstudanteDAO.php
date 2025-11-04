<?php
require_once "class.Banco.php";
require_once "models/class.Estudante.php";

class EstudanteDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "SELECT id_aluno, cpf, nome, contato, endereco, precisa_atendimento_psicopedagogico FROM ESTUDANTES";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Estudante::class);
        $estudantes = $stmt->fetchAll();

        return $estudantes ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT id_aluno, cpf, nome, contato, endereco, precisa_atendimento_psicopedagogico FROM ESTUDANTES WHERE id_aluno = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Estudante::class);
        $estudante = $stmt->fetch();

        return $estudante ?: null;
    }

    function inserir(Estudante $estudante) {
        $sql = "INSERT INTO ESTUDANTES(cpf, nome, contato, endereco, precisa_atendimento_psicopedagogico) VALUES (:cpf, :nome, :contato, :endereco, :precisa_atendimento_psicopedagogico)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':cpf' => $estudante->getCpf(),
            ':nome' => $estudante->getNome(),
            ':contato' => $estudante->getContato(),
            ':endereco' => $estudante->getEndereco(),
            ':precisa_atendimento_psicopedagogico' => $estudante->getPrecisaAtendimentoPsicopedagogico()
        ]);

        if ($resultado) {
            $id = $this->pdo->lastInsertId();
            return $this->buscarPorId($id);
        }
    }

    function editar($id, $estudante) {
        $e = $this->buscarPorId($id);
        if (!$e) 
            throw new Exception("Estudante não encontrado!");

        $sql = "UPDATE ESTUDANTES SET cpf=:cpf, nome=:nome, contato=:contato, endereco=:endereco, precisa_atendimento_psicopedagogico=:precisa_atendimento_psicopedagogico WHERE id_aluno=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':cpf', $estudante->getCpf());
        $query->bindValue(':nome', $estudante->getNome());
        $query->bindValue(':contato', $estudante->getContato());
        $query->bindValue(':endereco', $estudante->getEndereco());
        $query->bindValue(':precisa_atendimento_psicopedagogico', $estudante->getPrecisaAtendimentoPsicopedagogico());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $e->setCpf($estudante->getCpf());
        $e->setNome($estudante->getNome());
        $e->setContato($estudante->getContato());
        $e->setEndereco($estudante->getEndereco());
        $e->setPrecisaAtendimentoPsicopedagogico($estudante->getPrecisaAtendimentoPsicopedagogico());
        return $e;
    }

    function apagar($id) {
        $estudante = $this->buscarPorId($id);
        if (!$estudante) 
            throw new Exception("Estudante não encontrado!");

        $sql = "DELETE FROM ESTUDANTES WHERE id_aluno=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $estudante;
    }
}
?>