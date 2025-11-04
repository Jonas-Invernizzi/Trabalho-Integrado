<?php
require_once "class.Banco.php";
require_once "models/class.Servidor.php";

class ServidorDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "SELECT siape, cpf, nome, email, telefone, tipo FROM SERVIDORES";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Servidor::class);
        $servidores = $stmt->fetchAll();

        return $servidores ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT siape, cpf, nome, email, telefone, tipo FROM SERVIDORES WHERE siape = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Servidor::class);
        $servidor = $stmt->fetch();

        return $servidor ?: null;
    }

    function inserir(Servidor $servidor) {
        // Verificar se tem siape, se não tiver gerar um
        $siape = $servidor->getSiape();
        if (!$siape || $siape <= 0) {
            // Gerar um siape único baseado no timestamp
            $siape = intval(substr(time(), -8)); // Últimos 8 dígitos do timestamp
        }
        
        $sql = "INSERT INTO SERVIDORES(siape, cpf, nome, email, telefone, tipo) VALUES (:siape, :cpf, :nome, :email, :telefone, :tipo)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':siape' => $siape,
            ':cpf' => $servidor->getCpf(),
            ':nome' => $servidor->getNome(),
            ':email' => $servidor->getEmail(),
            ':telefone' => $servidor->getTelefone(),
            ':tipo' => $servidor->getTipo()
        ]);

        if ($resultado) {
            return $this->buscarPorId($siape);
        }
    }

    function editar($id, $servidor) {
        $s = $this->buscarPorId($id);
        if (!$s) 
            throw new Exception("Servidor não encontrado!");

        $sql = "UPDATE SERVIDORES SET cpf=:cpf, nome=:nome, email=:email, telefone=:telefone, tipo=:tipo WHERE siape=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':cpf', $servidor->getCpf());
        $query->bindValue(':nome', $servidor->getNome());
        $query->bindValue(':email', $servidor->getEmail());
        $query->bindValue(':telefone', $servidor->getTelefone());
        $query->bindValue(':tipo', $servidor->getTipo());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $s->setCpf($servidor->getCpf());
        $s->setNome($servidor->getNome());
        $s->setEmail($servidor->getEmail());
        $s->setTelefone($servidor->getTelefone());
        $s->setTipo($servidor->getTipo());
        return $s;
    }

    function apagar($id) {
        $servidor = $this->buscarPorId($id);
        if (!$servidor) 
            throw new Exception("Servidor não encontrado!");

        $sql = "DELETE FROM SERVIDORES WHERE siape=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $servidor;
    }
}
?>