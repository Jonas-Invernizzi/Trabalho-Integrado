<?php
class ComponenteCurricular implements JsonSerializable {
    private $codigo_componente;
    private $componente;
    private $carga_horaria;
    
    public function setCodigoComponente($codigo_componente) { $this->codigo_componente = $codigo_componente; }
    public function getCodigoComponente() { return $this->codigo_componente; }
    
    public function setComponente($componente) { $this->componente = $componente; }
    public function getComponente() { return $this->componente; }
    
    public function setCargaHoraria($carga_horaria) { $this->carga_horaria = $carga_horaria; }
    public function getCargaHoraria() { return $this->carga_horaria; }
    
    public function jsonSerialize() {
        return [
            'codigo_componente' => $this->codigo_componente,
            'componente' => $this->componente,
            'carga_horaria' => $this->carga_horaria
        ];
    }
}
?>