<?php
class Estudantes implements JsonSerializable {
    private $id_aluno;
    private $cpf;
    private $nome;
    private $contato;
    private $endereco;
    private $precisa_atendimento_psicopedagogico;

    function setIdAluno($id_aluno) { $this->id_aluno = $id_aluno; }
    function setCpf($cpf) { $this->cpf = $cpf; }
    function setNome($nome) { $this->nome = $nome; }
    function setContato($contato) { $this->contato = $contato; }
    function setEndereco($endereco) { $this->endereco = $endereco; }
    function setPrecisaAtendimentoPsicopedagogico($precisa_atendimento_psicopedagogico) { $this->precisa_atendimento_psicopedagogico = $precisa_atendimento_psicopedagogico; }

    function getIdAluno() { return $this->id_aluno; }
    function getCpf() { return $this->cpf; }
    function getNome() { return $this->nome; }
    function getContato() { return $this->contato; }
    function getEndereco() { return $this->endereco; }
    function getPrecisaAtendimentoPsicopedagogico() { return $this->precisa_atendimento_psicopedagogico; }

    function jsonSerialize() {
        return [
            'id_aluno' => $this->id_aluno,
            'cpf' => $this->cpf,
            'nome' => $this->nome,
            'contato' => $this->contato,
            'endereco' => $this->endereco,
            'precisa_atendimento_psicopedagogico' => $this->precisa_atendimento_psicopedagogico
        ];
    }
}
?>