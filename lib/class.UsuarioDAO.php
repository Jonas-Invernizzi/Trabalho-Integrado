<?php
require_once "class.Banco.php";
require_once "models/class.Usuario.php";

class UsuarioDAO {
    private $pdo;

    function __construct() { $this->pdo = Banco::getConexao(); }

    function buscarTodos() {
        $sql = "
            SELECT u.siape, u.username, u.senha, s.nome as servidor_nome 
            FROM USUARIOS u 
            INNER JOIN SERVIDORES s 
                ON (u.siape = s.siape)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_CLASS, Usuario::class);
        $usuarios = $stmt->fetchAll();

        return $usuarios ?: [];
    }

    function buscarPorId($id) {
        $sql = "SELECT siape, username, senha FROM USUARIOS WHERE siape = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $stmt->setFetchMode(PDO::FETCH_CLASS, Usuario::class);
        $usuario = $stmt->fetch();

        return $usuario ?: null;
    }

    function inserir(Usuario $usuario) {
        $sql = "INSERT INTO USUARIOS(username, senha) VALUES (:username, :senha)";
        $stmt = $this->pdo->prepare($sql);
        $resultado = $stmt->execute([
            ':username' => $usuario->getUsername(),
            ':senha' => $usuario->getSenha()
        ]);

        if ($resultado) {
            $id = $this->pdo->lastInsertId();
            return $this->buscarPorId($id);
        }
    }

    function editar($id, $usuario) {
        $u = $this->buscarPorId($id);
        if (!$u) 
            throw new Exception("Usuário não encontrado!");

        $sql = "UPDATE USUARIOS SET username=:username, senha=:senha WHERE siape=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':username', $usuario->getUsername());
        $query->bindValue(':senha', $usuario->getSenha());
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao atualizar registro.");

        $u->setUsername($usuario->getUsername());
        $u->setSenha($usuario->getSenha());
        return $u;
    }

    function apagar($id) {
        $usuario = $this->buscarPorId($id);
        if (!$usuario) 
            throw new Exception("Usuário não encontrado!");

        $sql = "DELETE FROM USUARIOS WHERE siape=:id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(':id', $id);
        if (!$query->execute())
            throw new Exception("Erro ao apagar registro!");    

        return $usuario;
    }
}
?>