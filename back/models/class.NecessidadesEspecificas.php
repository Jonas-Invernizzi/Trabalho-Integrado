<?php
class NecessidadesEspecificas implements JsonSerializable {
    private $necessidade_id;
    private $nome;
    private $descricao;

    function setNecessidadeId($necessidade_id) { $this->necessidade_id = $necessidade_id; }
    function setNome($nome) { $this->nome = $nome; }
    function setDescricao($descricao) { $this->descricao = $descricao; }

    function getNecessidadeId() { return $this->necessidade_id; }
    function getNome() { return $this->nome; }
    function getDescricao() { return $this->descricao; }

    function jsonSerialize() {
        return [
            'necessidade_id' => $this->necessidade_id,
            'nome' => $this->nome,
            'descricao' => $this->descricao
        ];
    }
}
?>