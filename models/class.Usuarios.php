<?php
class Usuarios implements JsonSerializable {
    private $siape;
    private $username;
    private $senha;
    // Propriedades para relacionamento com Servidores (FK)
    private $servidor_nome;
    private $servidor_email;

    function setSiape($siape) { $this->siape = $siape; }
    function setUsername($username) { $this->username = $username; }
    function setSenha($senha) { $this->senha = $senha; }
    function setServidorNome($servidor_nome) { $this->servidor_nome = $servidor_nome; }
    function setServidorEmail($servidor_email) { $this->servidor_email = $servidor_email; }

    function getSiape() { return $this->siape; }
    function getUsername() { return $this->username; }
    function getSenha() { return $this->senha; }
    function getServidorNome() { return $this->servidor_nome; }
    function getServidorEmail() { return $this->servidor_email; }

    function jsonSerialize() {
        return [
            'siape' => $this->siape,
            'username' => $this->username,
            'senha' => $this->senha,
            'servidor' => [
                'siape' => $this->siape,
                'nome' => $this->servidor_nome,
                'email' => $this->servidor_email
            ]
        ];
    }
}
?>