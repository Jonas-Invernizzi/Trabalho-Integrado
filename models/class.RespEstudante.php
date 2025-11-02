<?php
class RespEstudante implements JsonSerializable {
    private $id_responsavel;
    private $id_aluno;
    // Propriedades para relacionamentos (FKs)
    private $responsavel_nome;
    private $aluno_nome;

    function setIdResponsavel($id_responsavel) { $this->id_responsavel = $id_responsavel; }
    function setIdAluno($id_aluno) { $this->id_aluno = $id_aluno; }
    function setResponsavelNome($responsavel_nome) { $this->responsavel_nome = $responsavel_nome; }
    function setAlunoNome($aluno_nome) { $this->aluno_nome = $aluno_nome; }

    function getIdResponsavel() { return $this->id_responsavel; }
    function getIdAluno() { return $this->id_aluno; }
    function getResponsavelNome() { return $this->responsavel_nome; }
    function getAlunoNome() { return $this->aluno_nome; }

    function jsonSerialize() {
        return [
            'id_responsavel' => $this->id_responsavel,
            'id_aluno' => $this->id_aluno,
            'responsavel' => [
                'id' => $this->id_responsavel,
                'nome' => $this->responsavel_nome
            ],
            'aluno' => [
                'id' => $this->id_aluno,
                'nome' => $this->aluno_nome
            ]
        ];
    }
}
?>