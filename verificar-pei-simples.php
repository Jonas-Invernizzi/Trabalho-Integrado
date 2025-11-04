<?php
// Script simples para verificar PEIs via linha de comando
require_once 'lib/class.Banco.php';

try {
    $pdo = Banco::getConexao();
    
    // Contar PEIs
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM PEI_GERAL");
    $totalGeral = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM PEI_ADAPTACAO");
    $totalAdaptacao = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    echo "=== VERIFICAÇÃO DE PEIs ===\n\n";
    echo "PEIs Gerais: $totalGeral\n";
    echo "PEIs de Adaptação: $totalAdaptacao\n\n";
    
    if ($totalGeral > 0) {
        echo "--- Últimos PEIs Gerais ---\n";
        $stmt = $pdo->query("
            SELECT id, matricula, periodo, data_criacao 
            FROM PEI_GERAL 
            ORDER BY data_criacao DESC 
            LIMIT 5
        ");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "ID: {$row['id']} | Matrícula: {$row['matricula']} | Período: {$row['periodo']} | Data: {$row['data_criacao']}\n";
        }
    }
    
    if ($totalAdaptacao > 0) {
        echo "\n--- Últimos PEIs de Adaptação ---\n";
        $stmt = $pdo->query("
            SELECT id, pei_geral_id, codigo_componente, docente, data_criacao 
            FROM PEI_ADAPTACAO 
            ORDER BY data_criacao DESC 
            LIMIT 5
        ");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "ID: {$row['id']} | PEI Geral: {$row['pei_geral_id']} | Componente: {$row['codigo_componente']} | Docente: {$row['docente']} | Data: {$row['data_criacao']}\n";
        }
    }
    
    echo "\n✅ Verificação concluída!\n";
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>


