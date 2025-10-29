<?php
class Banco {
    private static $pdo;

    static function getConexao(){
        if (!self::$pdo) {
            try {
                self::$pdo = new PDO("mysql:dbname=pw2;host=localhost",'root', '');
            }catch(Exception $e){
                die("Erro ao conectar com o banco de dados");
            }
        }
        return self::$pdo;
    }    
}
?>