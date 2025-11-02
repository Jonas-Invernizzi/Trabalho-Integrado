<?php
class Pareceres implements JsonSerializable {
    private $id;
    private $pei_adaptacao_id;
    private $periodo;
    private $descricao;
    private $data_criacao;
    private $comentarios;
    // Propriedade para relacionamento com PeiAdaptacao (FK)
    private $pei_adaptacao_docente;

    function setId($id) { $this->id = $id; }
    function setPeiAdaptacaoId($pei_adaptacao_id) { $this->pei_adaptacao_id = $pei_adaptacao_id; }
    function setPeriodo($periodo) { $this->periodo = $periodo; }
    function setDescricao($descricao) { $this->descricao = $descricao; }
    function setDataCriacao($data_criacao) { $this->data_criacao = $data_criacao; }
    function setComentarios($comentarios) { $this->comentarios = $comentarios; }
    function setPeiAdaptacaoDocente($pei_adaptacao_docente) { $this->pei_adaptacao_docente = $pei_adaptacao_docente; }

    function getId() { return $this->id; }
    function getPeiAdaptacaoId() { return $this->pei_adaptacao_id; }
    function getPeriodo() { return $this->periodo; }
    function getDescricao() { return $this->descricao; }
    function getDataCriacao() { return $this->data_criacao; }
    function getComentarios() { return $this->comentarios; }
    function getPeiAdaptacaoDocente() { return $this->pei_adaptacao_docente; }

    function jsonSerialize() {
        return [
            'id' => $this->id,
            'pei_adaptacao_id' => $this->pei_adaptacao_id,
            'periodo' => $this->periodo,
            'descricao' => $this->descricao,
            'data_criacao' => $this->data_criacao,
            'comentarios' => $this->comentarios,
            'pei_adaptacao' => [
                'id' => $this->pei_adaptacao_id,
                'docente' => $this->pei_adaptacao_docente
            ]
        ];
    }
}
?>