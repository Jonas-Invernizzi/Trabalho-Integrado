<?php
header('Content-Type: application/json; charset=utf-8');

function converterNomeController($palavra) {
    return ucfirst(substr($palavra, 0, -1)) . 'Controller';
}

function error($msg, $code = 404) {
    http_response_code($code);
    die(json_encode(['error' => $msg]));
}

spl_autoload_register(function($nomeDaClasse){
    $arquivo = __DIR__ . '/controllers/class.' . $nomeDaClasse . '.php';

    if (!file_exists($arquivo)) {
        error("Controller '$nomeDaClasse' não existe!");
    }
    require_once $arquivo;
});

$method = $_SERVER['REQUEST_METHOD'];
$urlBase = '/pw2/poo/0714/';
$url = str_ireplace($urlBase, '', $_SERVER['REQUEST_URI']);
$partes = explode("/", $url);
if ($method === 'POST' && count($partes) != 1) {
    error("Requisição inválida!");
}
if (in_array($method, ['PUT', 'DELETE']) && count($partes) != 2) {
    error("Requisição inválida!");
}
if ($method === 'GET' && (count($partes) < 1 || count($partes) > 2)) {
    error("Requisição inválida!");
}
if (empty($partes[0])) {
    error("Requisição inválida!");
}

$nomeDoController = converterNomeController($partes[0]); 

$controller = new $nomeDoController();

try {
    switch($method) {
        case 'GET':         
            echo json_encode(
                (count($partes) === 1) 
                ? $controller->getTodos() 
                : $controller->getPorId($partes[1]));
            break;
        case 'POST': 
            echo json_encode($controller->criar());
            break;
        case 'PUT': 
            echo json_encode($controller->editar($partes[1]));
            break;
        case 'DELETE':  
            echo json_encode($controller->apagar($partes[1]));
            break;
        default: die('Método inválido!');
    }
}catch(Exception $e) {
    error($e->getMessage());
}


?>