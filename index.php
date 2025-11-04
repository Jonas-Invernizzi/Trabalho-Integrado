<?php
header("Content-Type: Application/JSON");

require_once "config/index.php";
require_once "lib/Auth.php";
require_once "lib/Rotas.php";

$rotas = new Rotas();
$rotas->get('/estudantes','EstudanteController@listar', false);
$rotas->get('/estudantes/{id}','EstudanteController@detalhar');
$rotas->post('/estudantes','EstudanteController@criar');
$rotas->put('/estudantes/{id}','EstudanteController@editar');
$rotas->delete('/estudantes/{id}','EstudanteController@remover');

$rotas->post('/login', 'LoginController@login', false);

echo json_encode($rotas->executar());
?>