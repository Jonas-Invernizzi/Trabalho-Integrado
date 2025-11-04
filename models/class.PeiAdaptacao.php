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
    
    public function setId($id) { $this->id = $id; }
    public function getId() { return $this->id; }
    
    public function setPeiGeralId($pei_geral_id) { $this->pei_geral_id = $pei_geral_id; }
    public function getPeiGeralId() { return $this->pei_geral_id; }
    
    public function setCodigoComponente($codigo_componente) { $this->codigo_componente = $codigo_componente; }
    public function getCodigoComponente() { return $this->codigo_componente; }
    
    public function setEmenta($ementa) { $this->ementa = $ementa; }
    public function getEmenta() { return $this->ementa; }
    
    public function setObjetivoGeral($objetivo_geral) { $this->objetivo_geral = $objetivo_geral; }
    public function getObjetivoGeral() { return $this->objetivo_geral; }
    
    public function setObjetivosEspecificos($objetivos_especificos) { $this->objetivos_especificos = $objetivos_especificos; }
    public function getObjetivosEspecificos() { return $this->objetivos_especificos; }
    
    public function setConteudos($conteudos) { $this->conteudos = $conteudos; }
    public function getConteudos() { return $this->conteudos; }
    
    public function setMetodologia($metodologia) { $this->metodologia = $metodologia; }
    public function getMetodologia() { return $this->metodologia; }
    
    public function setAvaliacao($avaliacao) { $this->avaliacao = $avaliacao; }
    public function getAvaliacao() { return $this->avaliacao; }
    
    public function setDataCriacao($data_criacao) { $this->data_criacao = $data_criacao; }
    public function getDataCriacao() { return $this->data_criacao; }
    
    public function setDataAtualizacao($data_atualizacao) { $this->data_atualizacao = $data_atualizacao; }
    public function getDataAtualizacao() { return $this->data_atualizacao; }
    
    public function setComentariosNapne($comentarios_napne) { $this->comentarios_napne = $comentarios_napne; }
    public function getComentariosNapne() { return $this->comentarios_napne; }
    
    public function setDocente($docente) { $this->docente = $docente; }
    public function getDocente() { return $this->docente; }
    
    public function jsonSerialize() {
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
            'docente' => $this->docente
            // Nota: Para incluir dados de PEI_GERAL e COMPONENTES_CURRICULARES, carregue via FKs
        ];
    }
}
?>