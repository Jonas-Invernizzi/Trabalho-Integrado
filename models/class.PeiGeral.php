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
    // Propriedade para relacionamento com Matriculas (FK)
    private $matricula_estudante_nome;

    function setId($id) { $this->id = $id; }
    function setMatricula($matricula) { $this->matricula = $matricula; }
    function setPeriodo($periodo) { $this->periodo = $periodo; }
    function setDificuldades($dificuldades) { $this->dificuldades = $dificuldades; }
    function setInteressesHabilidades($interesses_habilidades) { $this->interesses_habilidades = $interesses_habilidades; }
    function setEstrategias($estrategias) { $this->estrategias = $estrategias; }
    function setDataCriacao($data_criacao) { $this->data_criacao = $data_criacao; }
    function setDataAtualizacao($data_atualizacao) { $this->data_atualizacao = $data_atualizacao; }
    function setMatriculaEstudanteNome($matricula_estudante_nome) { $this->matricula_estudante_nome = $matricula_estudante_nome; }

    function getId() { return $this->id; }
    function getMatricula() { return $this->matricula; }
    function getPeriodo() { return $this->periodo; }
    function getDificuldades() { return $this->dificuldades; }
    function getInteressesHabilidades() { return $this->interesses_habilidades; }
    function getEstrategias() { return $this->estrategias; }
    function getDataCriacao() { return $this->data_criacao; }
    function getDataAtualizacao() { return $this->data_atualizacao; }
    function getMatriculaEstudanteNome() { return $this->matricula_estudante_nome; }

    function jsonSerialize() {
        return [
            'id' => $this->id,
            'matricula' => $this->matricula,
            'periodo' => $this->periodo,
            'dificuldades' => $this->dificuldades,
            'interesses_habilidades' => $this->interesses_habilidades,
            'estrategias' => $this->estrategias,
            'data_criacao' => $this->data_criacao,
            'data_atualizacao' => $this->data_atualizacao,
            'matricula_rel' => [
                'matricula' => $this->matricula,
                'estudante_nome' => $this->matricula_estudante_nome
            ]
        ];
    }
}
?>