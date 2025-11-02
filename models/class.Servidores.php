<?php
class Servidores implements JsonSerializable {
    private $siape;
    private $cpf;
    private $nome;
    private $email;
    private $telefone;
    private $tipo;

    function setSiape($siape) { $this->siape = $siape; }
    function setCpf($cpf) { $this->cpf = $cpf; }
    function setNome($nome) { $this->nome = $nome; }
    function setEmail($email) { $this->email = $email; }
    function setTelefone($telefone) { $this->telefone = $telefone; }
    function setTipo($tipo) { $this->tipo = $tipo; }

    function getSiape() { return $this->siape; }
    function getCpf() { return $this->cpf; }
    function getNome() { return $this->nome; }
    function getEmail() { return $this->email; }
    function getTelefone() { return $this->telefone; }
    function getTipo() { return $this->tipo; }

    function jsonSerialize() {
        return [
            'siape' => $this->siape,
            'cpf' => $this->cpf,
            'nome' => $this->nome,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'tipo' => $this->tipo
        ];
    }
}
?>