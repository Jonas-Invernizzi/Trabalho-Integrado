<?php
require_once "class.Banco.php";
require_once "models/class.Servidores.php";

class ServidoresDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "SELECT siape, cpf, nome, email, telefone, tipo FROM servidores";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Servidores::class);
        $servidores = $stmt->fetchAll();

        return $servidores ?: [];
    }

    function buscarPorId($siape) {
        $sql = "SELECT siape, cpf, nome, email, telefone, tipo FROM servidores WHERE siape = :siape";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':siape' => $siape]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Servidores::class);
        $servidor = $stmt->fetch();

        return $servidor ?: null;
    }

    function inserir(Servidores $servidor) {
        $sql = "INSERT INTO servidores(siape, cpf, nome, email, telefone, tipo) VALUES (:siape, :cpf, :nome, :email, :telefone, :tipo)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':siape' => $servidor->getSiape(),
            ':cpf' => $servidor->getCpf(),
            ':nome' => $servidor->getNome(),
            ':email' => $servidor->getEmail(),
            ':telefone' => $servidor->getTelefone(),
            ':tipo' => $servidor->getTipo()
        ]);

        if ($resultado) {
            return $this->buscarPorId($servidor->getSiape());
        }
    }

    function editar($siape, Servidores $servidor) {
        $s = $this->buscarPorId($siape);
        if (!$s) 
            throw new Exception("Servidor não encontrado!");

        $sql = "UPDATE servidores SET cpf=:cpf, nome=:nome, email=:email, telefone=:telefone, tipo=:tipo WHERE siape=:siape";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':cpf', $servidor->getCpf());
        $query->bindValue(':nome', $servidor->getNome());
        $query->bindValue(':email', $servidor->getEmail());
        $query->bindValue(':telefone', $servidor->getTelefone());
        $query->bindValue(':tipo', $servidor->getTipo());
        $query->bindValue(':siape', $siape);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $s->setCpf($servidor->getCpf());
        $s->setNome($servidor->getNome());
        $s->setEmail($servidor->getEmail());
        $s->setTelefone($servidor->getTelefone());
        $s->setTipo($servidor->getTipo());
        return $s;
    }

    function apagar($siape) {
        $servidor = $this->buscarPorId($siape);
        if (!$servidor) 
            throw new Exception("Servidor não encontrado!");

        $sql = "DELETE FROM servidores WHERE siape=:siape";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':siape', $siape);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");

        return $servidor;
    }
}
?>