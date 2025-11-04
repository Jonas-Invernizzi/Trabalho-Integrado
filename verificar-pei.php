<?php
// Script para verificar PEIs no banco de dados
require_once 'lib/class.Banco.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Verificação de PEIs no Banco</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #764ba2; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #764ba2; color: white; }
        tr:hover { background-color: #f5f5f5; }
        .badge { padding: 5px 10px; border-radius: 3px; color: white; font-size: 12px; }
        .badge-success { background-color: #28a745; }
        .badge-info { background-color: #17a2b8; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-box { flex: 1; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #764ba2; }
        .stat-number { font-size: 32px; font-weight: bold; color: #764ba2; }
        .stat-label { color: #666; margin-top: 5px; }
        .refresh-btn { background: #764ba2; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .refresh-btn:hover { background: #5a3780; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Verificação de PEIs no Banco de Dados</h1>
        
        <div style="text-align: right; margin-bottom: 20px;">
            <button class="refresh-btn" onclick="location.reload()">🔄 Atualizar</button>
        </div>

        <?php
        try {
            $pdo = Banco::getConexao();
            
            // Estatísticas gerais
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM PEI_GERAL");
            $totalGeral = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM PEI_ADAPTACAO");
            $totalAdaptacao = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM MATRICULAS");
            $totalMatriculas = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM ESTUDANTES");
            $totalEstudantes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            ?>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-number"><?php echo $totalGeral; ?></div>
                    <div class="stat-label">PEIs Gerais</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $totalAdaptacao; ?></div>
                    <div class="stat-label">PEIs de Adaptação</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $totalEstudantes; ?></div>
                    <div class="stat-label">Estudantes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $totalMatriculas; ?></div>
                    <div class="stat-label">Matrículas</div>
                </div>
            </div>

            <h2>📋 PEIs Gerais</h2>
            <?php
            $stmt = $pdo->query("
                SELECT 
                    pg.id,
                    pg.matricula,
                    pg.periodo,
                    pg.dificuldades,
                    pg.interesses_habilidades,
                    pg.estrategias,
                    pg.data_criacao,
                    e.nome as estudante_nome,
                    c.nome as curso_nome
                FROM PEI_GERAL pg
                LEFT JOIN MATRICULAS m ON pg.matricula = m.matricula
                LEFT JOIN ESTUDANTES e ON m.estudante_id = e.id_aluno
                LEFT JOIN CURSOS c ON m.curso_id = c.codigo
                ORDER BY pg.data_criacao DESC
                LIMIT 20
            ");
            
            $peisGeral = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($peisGeral) > 0) {
                echo "<table>";
                echo "<tr><th>ID</th><th>Matrícula</th><th>Estudante</th><th>Curso</th><th>Período</th><th>Data Criação</th></tr>";
                foreach ($peisGeral as $pei) {
                    echo "<tr>";
                    echo "<td>" . $pei['id'] . "</td>";
                    echo "<td>" . $pei['matricula'] . "</td>";
                    echo "<td>" . ($pei['estudante_nome'] ?: 'N/A') . "</td>";
                    echo "<td>" . ($pei['curso_nome'] ?: 'N/A') . "</td>";
                    echo "<td>" . ($pei['periodo'] ?: 'N/A') . "</td>";
                    echo "<td>" . date('d/m/Y H:i', strtotime($pei['data_criacao'])) . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "<p style='color: #666;'>Nenhum PEI Geral encontrado no banco.</p>";
            }
            ?>

            <h2>📚 PEIs de Adaptação</h2>
            <?php
            $stmt = $pdo->query("
                SELECT 
                    pa.id,
                    pa.pei_geral_id,
                    pa.codigo_componente,
                    pa.docente,
                    pa.objetivo_geral,
                    pa.data_criacao,
                    cc.componente as nome_componente,
                    pg.matricula
                FROM PEI_ADAPTACAO pa
                LEFT JOIN COMPONENTES_CURRICULARES cc ON pa.codigo_componente = cc.codigo_componente
                LEFT JOIN PEI_GERAL pg ON pa.pei_geral_id = pg.id
                ORDER BY pa.data_criacao DESC
                LIMIT 20
            ");
            
            $peisAdaptacao = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($peisAdaptacao) > 0) {
                echo "<table>";
                echo "<tr><th>ID</th><th>PEI Geral ID</th><th>Matrícula</th><th>Componente</th><th>Docente</th><th>Data Criação</th></tr>";
                foreach ($peisAdaptacao as $pei) {
                    echo "<tr>";
                    echo "<td>" . $pei['id'] . "</td>";
                    echo "<td>" . $pei['pei_geral_id'] . "</td>";
                    echo "<td>" . ($pei['matricula'] ?: 'N/A') . "</td>";
                    echo "<td>" . ($pei['nome_componente'] ?: 'Código: ' . $pei['codigo_componente']) . "</td>";
                    echo "<td>" . ($pei['docente'] ?: 'N/A') . "</td>";
                    echo "<td>" . date('d/m/Y H:i', strtotime($pei['data_criacao'])) . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "<p style='color: #666;'>Nenhum PEI de Adaptação encontrado no banco.</p>";
            }
            ?>
            
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Última atualização: <?php echo date('d/m/Y H:i:s'); ?>
            </p>
            
        <?php
        } catch (Exception $e) {
            echo "<p style='color: red;'>❌ Erro ao conectar com o banco: " . $e->getMessage() . "</p>";
        }
        ?>
    </div>
</body>
</html>


