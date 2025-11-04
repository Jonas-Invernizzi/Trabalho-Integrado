# 🚀 Como Rodar o Sistema NAPNE

## ✅ Status Atual
- ✓ Banco de dados NAPNE criado e funcionando
- ✓ MySQL XAMPP rodando
- ✓ Apache XAMPP rodando
- ✓ Link simbólico criado em htdocs
- ✓ Backend integrado com Frontend

## 📍 Acesso à Aplicação

### Opção 1: Via XAMPP (Recomendado)
Abra seu navegador e acesse:

```
http://localhost/Trabalho-Integrado/web/index.html
```

ou

```
http://127.0.0.1/Trabalho-Integrado/web/index.html
```

### Opção 2: Teste de Conexão
Para verificar se tudo está funcionando:

```
http://localhost/Trabalho-Integrado/test-connection.php
```

## 🗄️ Banco de Dados
- **Banco**: NAPNE
- **Usuário**: root
- **Senha**: (vazia)
- **Host**: localhost (via socket XAMPP)

## 🔧 Comandos Úteis

### Entrar no MySQL do XAMPP:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock NAPNE
```

### Verificar serviços XAMPP:
```bash
/Applications/XAMPP/xamppfiles/xampp status
```

### Iniciar serviços (se necessário):
```bash
/Applications/XAMPP/xamppfiles/xampp start
```

## 📝 Estrutura do Projeto

- `/web/` - Frontend (HTML/CSS/JS)
- `/controllers/` - Controllers PHP (API)
- `/models/` - Models PHP
- `/lib/` - DAOs e Banco de Dados
- `/index.php` - Roteador da API

## 🎯 Próximos Passos

1. Abra `http://localhost/Trabalho-Integrado/web/index.html`
2. Faça login (se tiver usuário) ou crie um novo
3. Comece a usar o sistema!

## ⚠️ Observações

- O sistema está configurado para rodar no XAMPP
- Se precisar mudar a porta do Apache, edite o arquivo de configuração
- Os dados são salvos no banco MySQL
- O frontend se comunica com o backend via API REST


