<?php
class Cursos implements JsonSerializable {
    private $codigo;
    private $nome;
    private $modalidade;
    private $carga_horaria;
    private $duracao;
    private $coordenador_cpf;
    // Propriedades para relacionamento com Servidores (FK)
    private $coordenador_nome;
    private $coordenador_email;

    function setCodigo($codigo) { $this->codigo = $codigo; }
    function setNome($nome) { $this->nome = $nome; }
    function setModalidade($modalidade) { $this->modalidade = $modalidade; }
    function setCargaHoraria($carga_horaria) { $this->carga_horaria = $carga_horaria; }
    function setDuracao($duracao) { $this->duracao = $duracao; }
    function setCoordenadorCpf($coordenador_cpf) { $this->coordenador_cpf = $coordenador_cpf; }
    function setCoordenadorNome($coordenador_nome) { $this->coordenador_nome = $coordenador_nome; }
    function setCoordenadorEmail($coordenador_email) { $this->coordenador_email = $coordenador_email; }

    function getCodigo() { return $this->codigo; }
    function getNome() { return $this->nome; }
    function getModalidade() { return $this->modalidade; }
    function getCargaHoraria() { return $this->carga_horaria; }
    function getDuracao() { return $this->duracao; }
    function getCoordenadorCpf() { return $this->coordenador_cpf; }
    function getCoordenadorNome() { return $this->coordenador_nome; }
    function getCoordenadorEmail() { return $this->coordenador_email; }

    function jsonSerialize() {
        return [
            'codigo' => $this->codigo,
            'nome' => $this->nome,
            'modalidade' => $this->modalidade,
            'carga_horaria' => $this->carga_horaria,
            'duracao' => $this->duracao,
            'coordenador_cpf' => $this->coordenador_cpf,
            'coordenador' => [
                'cpf' => $this->coordenador_cpf,
                'nome' => $this->coordenador_nome,
                'email' => $this->coordenador_email
            ]
        ];
    }
}
?>