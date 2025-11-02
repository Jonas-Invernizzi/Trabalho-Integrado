<?php
class EstudantesNecessidades implements JsonSerializable {
    private $estudante_cpf;
    private $necessidade_id;
    // Propriedades para relacionamentos (FKs)
    private $estudante_nome;
    private $necessidade_nome;

    function setEstudanteCpf($estudante_cpf) { $this->estudante_cpf = $estudante_cpf; }
    function setNecessidadeId($necessidade_id) { $this->necessidade_id = $necessidade_id; }
    function setEstudanteNome($estudante_nome) { $this->estudante_nome = $estudante_nome; }
    function setNecessidadeNome($necessidade_nome) { $this->necessidade_nome = $necessidade_nome; }

    function getEstudanteCpf() { return $this->estudante_cpf; }
    function getNecessidadeId() { return $this->necessidade_id; }
    function getEstudanteNome() { return $this->estudante_nome; }
    function getNecessidadeNome() { return $this->necessidade_nome; }

    function jsonSerialize() {
        return [
            'estudante_cpf' => $this->estudante_cpf,
            'necessidade_id' => $this->necessidade_id,
            'estudante' => [
                'cpf' => $this->estudante_cpf,
                'nome' => $this->estudante_nome
            ],
            'necessidade' => [
                'id' => $this->necessidade_id,
                'nome' => $this->necessidade_nome
            ]
        ];
    }
}
?>