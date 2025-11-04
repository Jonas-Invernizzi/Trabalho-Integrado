<?php
require "vendor/autoload.php";
use Firebase\JWT\JWT;

class LoginController {
    function login(){
        global $key;

        $dados = json_decode(file_get_contents("php://input"));
        
        $payload = [
            'iss'=> 'http://localhost',
            'iat' => time(),
            'exp' => time() + 1 * 60 
        ];
        
        if ($dados->email === "thyago@email.com" &&
        $dados->senha === "123") {
            $payload['userId'] = 3;

            $jwt = JWT::encode($payload, $key, 'HS256');

            return ['token' => $jwt];
            
        }

        return ['error' => 'Usuário não encontrado!'];
    }
}

?>