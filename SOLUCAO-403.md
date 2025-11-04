# 🔧 Solução para Erro 403

## Problema
O Apache não está conseguindo acessar os arquivos através do link simbólico devido a permissões.

## Soluções Alternativas

### Solução 1: Copiar projeto para htdocs (Recomendado)

```bash
# Fazer backup se necessário
cp -R /Applications/XAMPP/xamppfiles/htdocs/Trabalho-Integrado /Applications/XAMPP/xamppfiles/htdocs/Trabalho-Integrado-backup

# Remover link simbólico
rm /Applications/XAMPP/xamppfiles/htdocs/Trabalho-Integrado

# Copiar projeto completo
cp -R /Users/artcagliari/Documents/Trabalho-Integrado-main /Applications/XAMPP/xamppfiles/htdocs/Trabalho-Integrado

# Ajustar permissões
chmod -R 755 /Applications/XAMPP/xamppfiles/htdocs/Trabalho-Integrado
chmod 644 /Applications/XAMPP/xamppfiles/htdocs/Trabalho-Integrado/web/*.html
```

### Solução 2: Usar servidor PHP embutido

No terminal, execute:

```bash
cd /Users/artcagliari/Documents/Trabalho-Integrado-main
/Applications/XAMPP/xamppfiles/bin/php -S localhost:8000
```

Depois acesse: `http://localhost:8000/web/index.html`

### Solução 3: Configurar Virtual Host no Apache

Edite `/Applications/XAMPP/xamppfiles/etc/httpd.conf` e adicione:

```apache
<VirtualHost *:80>
    DocumentRoot "/Users/artcagliari/Documents/Trabalho-Integrado-main/web"
    ServerName localhost.trabalho-integrado
    <Directory "/Users/artcagliari/Documents/Trabalho-Integrado-main/web">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Depois reinicie o Apache.


