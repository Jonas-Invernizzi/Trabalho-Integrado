<?php
require_once "class.Banco.php";
require_once "models/class.Usuarios.php";

class UsuariosDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "
            SELECT u.siape, u.username, u.senha, s.nome as servidor_nome, s.email as servidor_email
            FROM usuarios u
            INNER JOIN servidores s ON (u.siape = s.siape)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Usuarios::class);
        $usuarios = $stmt->fetchAll();

        return $usuarios ?: [];
    }

    function buscarPorId($siape) {
        $sql = "SELECT siape, username, senha FROM usuarios WHERE siape = :siape";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':siape' => $siape]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Usuarios::class);
        $usuario = $stmt->fetch();

        return $usuario ?: null;
    }

    function inserir(Usuarios $usuario) {
        $sql = "INSERT INTO usuarios(siape, username, senha) VALUES (:siape, :username, :senha)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':siape' => $usuario->getSiape(),
            ':username' => $usuario->getUsername(),
            ':senha' => $usuario->getSenha()
        ]);

        if ($resultado) {
            return $this->buscarPorId($usuario->getSiape());
        }
    }

    function editar($siape, Usuarios $usuario) {
        $u = $this->buscarPorId($siape);
        if (!$u) 
            throw new Exception("Usuário não encontrado!");

        $sql = "UPDATE usuarios SET username=:username, senha=:senha WHERE siape=:siape";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':username', $usuario->getUsername());
        $query->bindValue(':senha', $usuario->getSenha());
        $query->bindValue(':siape', $siape);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $u->setUsername($usuario->getUsername());
        $u->setSenha($usuario->getSenha());
        return $u;
    }

    function apagar($siape) {
        $usuario = $this->buscarPorId($siape);
        if (!$usuario) 
            throw new Exception("Usuário não encontrado!");

        $sql = "DELETE FROM usuarios WHERE siape=:siape";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':siape', $siape);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");

        return $usuario;
    }
}
?>