<?php
class Matriculas implements JsonSerializable {
    private $matricula;
    private $estudante_id;
    private $curso_id;
    private $ativo;
    // Propriedades para relacionamentos (FKs)
    private $estudante_nome;
    private $curso_nome;

    function setMatricula($matricula) { $this->matricula = $matricula; }
    function setEstudanteId($estudante_id) { $this->estudante_id = $estudante_id; }
    function setCursoId($curso_id) { $this->curso_id = $curso_id; }
    function setAtivo($ativo) { $this->ativo = $ativo; }
    function setEstudanteNome($estudante_nome) { $this->estudante_nome = $estudante_nome; }
    function setCursoNome($curso_nome) { $this->curso_nome = $curso_nome; }

    function getMatricula() { return $this->matricula; }
    function getEstudanteId() { return $this->estudante_id; }
    function getCursoId() { return $this->curso_id; }
    function getAtivo() { return $this->ativo; }
    function getEstudanteNome() { return $this->estudante_nome; }
    function getCursoNome() { return $this->curso_nome; }

    function jsonSerialize() {
        return [
            'matricula' => $this->matricula,
            'estudante_id' => $this->estudante_id,
            'curso_id' => $this->curso_id,
            'ativo' => $this->ativo,
            'estudante' => [
                'id' => $this->estudante_id,
                'nome' => $this->estudante_nome
            ],
            'curso' => [
                'codigo' => $this->curso_id,
                'nome' => $this->curso_nome
            ]
        ];
    }
}
?>