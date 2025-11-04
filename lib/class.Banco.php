<?php
class Banco {
    private static $pdo;

    static function getConexao(){
        if (!self::$pdo) {
            try {
                self::$pdo = new PDO(
                    "mysql:dbname=NAPNE;host=localhost;charset=utf8mb4",
                    'root',
                    '',
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]
                );
            } catch(PDOException $e) {
                error_log("Erro ao conectar com o banco de dados: " . $e->getMessage());
                throw new Exception("Erro ao conectar com o banco de dados");
            } catch(Exception $e) {
                error_log("Erro inesperado: " . $e->getMessage());
                throw new Exception("Erro ao conectar com o banco de dados");
            }
        }
        return self::$pdo;
    }    
}
?>