<?php
class Responsaveis implements JsonSerializable {
    private $id_responsavel;
    private $nome_responsavel;
    private $cpf_responsavel;
    private $contato_responsavel;
    private $endereco_responsavel;

    function setIdResponsavel($id_responsavel) { $this->id_responsavel = $id_responsavel; }
    function setNomeResponsavel($nome_responsavel) { $this->nome_responsavel = $nome_responsavel; }
    function setCpfResponsavel($cpf_responsavel) { $this->cpf_responsavel = $cpf_responsavel; }
    function setContatoResponsavel($contato_responsavel) { $this->contato_responsavel = $contato_responsavel; }
    function setEnderecoResponsavel($endereco_responsavel) { $this->endereco_responsavel = $endereco_responsavel; }

    function getIdResponsavel() { return $this->id_responsavel; }
    function getNomeResponsavel() { return $this->nome_responsavel; }
    function getCpfResponsavel() { return $this->cpf_responsavel; }
    function getContatoResponsavel() { return $this->contato_responsavel; }
    function getEnderecoResponsavel() { return $this->endereco_responsavel; }

    function jsonSerialize() {
        return [
            'id_responsavel' => $this->id_responsavel,
            'nome_responsavel' => $this->nome_responsavel,
            'cpf_responsavel' => $this->cpf_responsavel,
            'contato_responsavel' => $this->contato_responsavel,
            'endereco_responsavel' => $this->endereco_responsavel
        ];
    }
}
?>