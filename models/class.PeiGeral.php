<?php
class PeiGeral implements JsonSerializable {
    private $id;
    private $matricula;
    private $periodo;
    private $dificuldades;
    private $interesses_habilidades;
    private $estrategias;
    private $data_criacao;
    private $data_atualizacao;
    
    public function setId($id) { $this->id = $id; }
    public function getId() { return $this->id; }
    
    public function setMatricula($matricula) { $this->matricula = $matricula; }
    public function getMatricula() { return $this->matricula; }
    
    public function setPeriodo($periodo) { $this->periodo = $periodo; }
    public function getPeriodo() { return $this->periodo; }
    
    public function setDificuldades($dificuldades) { $this->dificuldades = $dificuldades; }
    public function getDificuldades() { return $this->dificuldades; }
    
    public function setInteressesHabilidades($interesses_habilidades) { $this->interesses_habilidades = $interesses_habilidades; }
    public function getInteressesHabilidades() { return $this->interesses_habilidades; }
    
    public function setEstrategias($estrategias) { $this->estrategias = $estrategias; }
    public function getEstrategias() { return $this->estrategias; }
    
    public function setDataCriacao($data_criacao) { $this->data_criacao = $data_criacao; }
    public function getDataCriacao() { return $this->data_criacao; }
    
    public function setDataAtualizacao($data_atualizacao) { $this->data_atualizacao = $data_atualizacao; }
    public function getDataAtualizacao() { return $this->data_atualizacao; }
    
    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'matricula' => $this->matricula,
            'periodo' => $this->periodo,
            'dificuldades' => $this->dificuldades,
            'interesses_habilidades' => $this->interesses_habilidades,
            'estrategias' => $this->estrategias,
            'data_criacao' => $this->data_criacao,
            'data_atualizacao' => $this->data_atualizacao
            // Nota: Para incluir dados de MATRICULAS, carregue via FK
        ];
    }
}
?>