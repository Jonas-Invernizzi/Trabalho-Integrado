// Configuração da API
const API_CONFIG = {
    // Detectar automaticamente a base URL da API
    baseURL: (function() {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port ? ':' + window.location.port : '';
        // Construir o caminho base: se estiver em /Trabalho-Integrado/web/, a API está em /Trabalho-Integrado/
        const path = window.location.pathname;
        let basePath = path;
        
        // Se estiver em uma subpasta 'web', subir um nível
        if (path.includes('/web/')) {
            basePath = path.split('/web/')[0];
        } else if (path.includes('/web')) {
            basePath = path.replace('/web', '');
        }
        
        // Garantir que termina com /
        if (!basePath.endsWith('/')) {
            basePath += '/';
        }
        
        // A API está no index.php do diretório raiz, mas o .htaccess faz o rewrite
        // Então a URL deve ser apenas o caminho base, não index.php/
        return `${protocol}//${hostname}${port}${basePath}`;
    })(),
    
    // Função auxiliar para fazer requisições
    async request(endpoint, method = 'GET', data = null) {
        const url = this.baseURL + endpoint;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                let errorMessage = 'Erro na requisição';
                try {
                    const result = await response.json();
                    errorMessage = result.error || errorMessage;
                } catch (e) {
                    // Se não conseguir fazer parse do JSON, usar o texto da resposta
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            // Tentar fazer parse do JSON
            try {
                const result = await response.json();
                return result;
            } catch (e) {
                // Se não for JSON, retornar texto vazio ou array vazio
                return [];
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    },
    
    // Métodos auxiliares
    get(endpoint) {
        return this.request(endpoint, 'GET');
    },
    
    post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    },
    
    put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    },
    
    delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
};

