<?php
class ComponentesCurriculares implements JsonSerializable {
    private $codigo_componente;
    private $componente;
    private $carga_horaria;

    function setCodigoComponente($codigo_componente) { $this->codigo_componente = $codigo_componente; }
    function setComponente($componente) { $this->componente = $componente; }
    function setCargaHoraria($carga_horaria) { $this->carga_horaria = $carga_horaria; }

    function getCodigoComponente() { return $this->codigo_componente; }
    function getComponente() { return $this->componente; }
    function getCargaHoraria() { return $this->carga_horaria; }

    function jsonSerialize() {
        return [
            'codigo_componente' => $this->codigo_componente,
            'componente' => $this->componente,
            'carga_horaria' => $this->carga_horaria
        ];
    }
}
?>