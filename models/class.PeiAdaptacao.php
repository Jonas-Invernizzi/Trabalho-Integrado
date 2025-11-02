<?php
class PeiAdaptacao implements JsonSerializable {
    private $id;
    private $pei_geral_id;
    private $codigo_componente;
    private $ementa;
    private $objetivo_geral;
    private $objetivos_especificos;
    private $conteudos;
    private $metodologia;
    private $avaliacao;
    private $data_criacao;
    private $data_atualizacao;
    private $comentarios_napne;
    private $docente;
    // Propriedades para relacionamentos (FKs)
    private $pei_geral_matricula;
    private $componente_nome;

    function setId($id) { $this->id = $id; }
    function setPeiGeralId($pei_geral_id) { $this->pei_geral_id = $pei_geral_id; }
    function setCodigoComponente($codigo_componente) { $this->codigo_componente = $codigo_componente; }
    function setEmenta($ementa) { $this->ementa = $ementa; }
    function setObjetivoGeral($objetivo_geral) { $this->objetivo_geral = $objetivo_geral; }
    function setObjetivosEspecificos($objetivos_especificos) { $this->objetivos_especificos = $objetivos_especificos; }
    function setConteudos($conteudos) { $this->conteudos = $conteudos; }
    function setMetodologia($metodologia) { $this->metodologia = $metodologia; }
    function setAvaliacao($avaliacao) { $this->avaliacao = $avaliacao; }
    function setDataCriacao($data_criacao) { $this->data_criacao = $data_criacao; }
    function setDataAtualizacao($data_atualizacao) { $this->data_atualizacao = $data_atualizacao; }
    function setComentariosNapne($comentarios_napne) { $this->comentarios_napne = $comentarios_napne; }
    function setDocente($docente) { $this->docente = $docente; }
    function setPeiGeralMatricula($pei_geral_matricula) { $this->pei_geral_matricula = $pei_geral_matricula; }
    function setComponenteNome($componente_nome) { $this->componente_nome = $componente_nome; }

    function getId() { return $this->id; }
    function getPeiGeralId() { return $this->pei_geral_id; }
    function getCodigoComponente() { return $this->codigo_componente; }
    function getEmenta() { return $this->ementa; }
    function getObjetivoGeral() { return $this->objetivo_geral; }
    function getObjetivosEspecificos() { return $this->objetivos_especificos; }
    function getConteudos() { return $this->conteudos; }
    function getMetodologia() { return $this->metodologia; }
    function getAvaliacao() { return $this->avaliacao; }
    function getDataCriacao() { return $this->data_criacao; }
    function getDataAtualizacao() { return $this->data_atualizacao; }
    function getComentariosNapne() { return $this->comentarios_napne; }
    function getDocente() { return $this->docente; }
    function getPeiGeralMatricula() { return $this->pei_geral_matricula; }
    function getComponenteNome() { return $this->componente_nome; }

    function jsonSerialize() {
        return [
            'id' => $this->id,
            'pei_geral_id' => $this->pei_geral_id,
            'codigo_componente' => $this->codigo_componente,
            'ementa' => $this->ementa,
            'objetivo_geral' => $this->objetivo_geral,
            'objetivos_especificos' => $this->objetivos_especificos,
            'conteudos' => $this->conteudos,
            'metodologia' => $this->metodologia,
            'avaliacao' => $this->avaliacao,
            'data_criacao' => $this->data_criacao,
            'data_atualizacao' => $this->data_atualizacao,
            'comentarios_napne' => $this->comentarios_napne,
            'docente' => $this->docente,
            'pei_geral' => [
                'id' => $this->pei_geral_id,
                'matricula' => $this->pei_geral_matricula
            ],
            'componente_curricular' => [
                'codigo_componente' => $this->codigo_componente,
                'componente' => $this->componente_nome
            ]
        ];
    }
}
?>