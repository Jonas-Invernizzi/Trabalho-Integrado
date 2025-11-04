<?php
// Teste de conexão com o banco de dados
require_once 'lib/class.Banco.php';

echo "<h1>Teste de Conexão - Sistema NAPNE</h1>";

try {
    $pdo = Banco::getConexao();
    echo "<p style='color: green;'>✓ Conexão com banco de dados estabelecida com sucesso!</p>";
    
    // Testar consulta
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM ESTUDANTES");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>Total de estudantes no banco: <strong>" . $result['total'] . "</strong></p>";
    
    // Listar tabelas
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<h2>Tabelas no banco NAPNE:</h2><ul>";
    foreach ($tables as $table) {
        echo "<li>" . $table . "</li>";
    }
    echo "</ul>";
    
    echo "<p style='color: green;'><strong>Sistema pronto para uso!</strong></p>";
    echo "<p><a href='web/index.html'>Acessar Sistema NAPNE</a></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Erro: " . $e->getMessage() . "</p>";
}
?>


