<?php
require "vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth {
    static function check(){
        global $key;

        $usuarios = [
            ['id' => 3, 'nome' => 'Thyago'],
            ['id' => 4, 'nome' => 'Salvá'],
        ];

        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            return false;
        }

        $authorization = $headers['Authorization'];
        $parts = explode(" ", $authorization);
        $token = trim($parts[1]);

        try {
            $resultado = JWT::decode( 
                $token, new Key($key, 'HS256')
            );
        }catch(Exception $e){
            http_response_code(403);
            echo json_encode(['error'=>$e->getMessage()]);
            exit;
        }
        

        foreach($usuarios as $usuario) {
            if ($usuario['id'] === $resultado->userId){
                echo $usuario['nome'];
            }
        }

        return !!$resultado->userId;
    }
}

?>