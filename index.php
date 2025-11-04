<?php
// Headers CORS para permitir requisições do frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function converterNomeController($palavra) {
    // Mapear rotas do frontend para nomes de controllers
    $mapeamento = [
        'estudantes' => 'EstudanteController',
        'cursos' => 'CursoController',
        'componentes' => 'ComponenteCurricularController',
        'matriculas' => 'MatriculaController',
        'usuarios' => 'UsuarioController',
        'servidores' => 'ServidorController',
        'necessidades' => 'NecessidadeEspecificaController',
        'pareceres' => 'ParecerController',
        'peis' => 'PeiGeralController',
        'adaptacoes' => 'PeiAdaptacaoController',
        'comentarios' => 'ComentarioController'
    ];
    
    if (isset($mapeamento[$palavra])) {
        return $mapeamento[$palavra];
    }
    
    // Fallback: tentar converter automaticamente
    return ucfirst(rtrim($palavra, 's')) . 'Controller';
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

// Detectar automaticamente o caminho base
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$requestUri = $_SERVER['REQUEST_URI'];
$url = str_replace($scriptName, '', $requestUri);
$url = ltrim($url, '/');
$partes = array_filter(explode("/", $url));
$partes = array_values($partes); // Reindexar array
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