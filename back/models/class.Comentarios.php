<?php
class Comentarios implements JsonSerializable {
    private $id;
    private $parecer_id;
    private $usuario_id;
    private $data;
    private $comentarios;
    // Propriedades para relacionamentos (FKs)
    private $parecer_descricao;
    private $usuario_username;

    function setId($id) { $this->id = $id; }
    function setParecerId($parecer_id) { $this->parecer_id = $parecer_id; }
    function setUsuarioId($usuario_id) { $this->usuario_id = $usuario_id; }
    function setData($data) { $this->data = $data; }
    function setComentarios($comentarios) { $this->comentarios = $comentarios; }
    function setParecerDescricao($parecer_descricao) { $this->parecer_descricao = $parecer_descricao; }
    function setUsuarioUsername($usuario_username) { $this->usuario_username = $usuario_username; }

    function getId() { return $this->id; }
    function getParecerId() { return $this->parecer_id; }
    function getUsuarioId() { return $this->usuario_id; }
    function getData() { return $this->data; }
    function getComentarios() { return $this->comentarios; }
    function getParecerDescricao() { return $this->parecer_descricao; }
    function getUsuarioUsername() { return $this->usuario_username; }

    function jsonSerialize() {
        return [
            'id' => $this->id,
            'parecer_id' => $this->parecer_id,
            'usuario_id' => $this->usuario_id,
            'data' => $this->data,
            'comentarios' => $this->comentarios,
            'parecer' => [
                'id' => $this->parecer_id,
                'descricao' => $this->parecer_descricao
            ],
            'usuario' => [
                'siape' => $this->usuario_id,
                'username' => $this->usuario_username
            ]
        ];
    }
}
?>