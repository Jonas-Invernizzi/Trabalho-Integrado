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
            
            // Ler o texto da resposta uma única vez
            const text = await response.text();
            
            if (!response.ok) {
                let errorMessage = 'Erro na requisição';
                try {
                    // Tentar fazer parse do JSON para obter mensagem de erro
                    if (text && text.trim() !== '' && text.trim().startsWith('{')) {
                        const result = JSON.parse(text);
                        errorMessage = result.error || errorMessage;
                    } else if (text && text.trim() !== '') {
                        // Se não for JSON, usar o texto como mensagem de erro
                        errorMessage = text.trim();
                    }
                } catch (e) {
                    // Se não conseguir fazer parse do JSON, usar o texto da resposta
                    errorMessage = (text && text.trim() !== '') ? text.trim() : `Erro HTTP ${response.status}`;
                }
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }
            
            // Tentar fazer parse do JSON
            const contentType = response.headers.get('content-type');
            
            // Verificar se a resposta está vazia
            if (!text || text.trim() === '') {
                return null;
            }
            
            // Se o content-type indica JSON, tentar fazer parse
            if (contentType && contentType.includes('application/json')) {
                try {
                    // Verificar se o texto começa com { ou [ (JSON válido)
                    const trimmedText = text.trim();
                    if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
                        const result = JSON.parse(trimmedText);
                        return result;
                    } else {
                        // Se não começa com { ou [, não é JSON válido
                        console.warn('Resposta não é JSON válido:', trimmedText.substring(0, 100));
                        return null;
                    }
                } catch (e) {
                    // Se o parse falhar, logar o erro mas não quebrar
                    console.error('Erro ao fazer parse do JSON:', e.message, 'Texto recebido:', text.substring(0, 200));
                    return null;
                }
            } else {
                // Se não for JSON, retornar o texto da resposta
                return text || null;
            }
        } catch (error) {
            // Melhorar tratamento de erro para evitar SyntaxError
            let errorMessage = 'Erro na requisição';
            
            if (error instanceof SyntaxError) {
                errorMessage = 'Erro ao processar resposta do servidor. A resposta não é um JSON válido.';
            } else if (error instanceof TypeError && error.message.includes('JSON')) {
                errorMessage = 'Erro ao processar resposta do servidor.';
            } else if (error instanceof Error) {
                errorMessage = error.message || errorMessage;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            // Log detalhado apenas em desenvolvimento
            if (error.status) {
                errorMessage = `Erro ${error.status}: ${errorMessage}`;
            }
            
            console.error('Erro na requisição:', errorMessage);
            const finalError = new Error(errorMessage);
            if (error.status) {
                finalError.status = error.status;
            }
            throw finalError;
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

