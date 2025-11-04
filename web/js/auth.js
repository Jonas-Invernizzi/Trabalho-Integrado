// Incluir o script de configuração da API antes deste arquivo
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const toast = document.getElementById('toast');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.role === 'napne') {
        window.location.href = 'dashboard.html';
    }

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('active');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('active');
    });

    // Toggle senha
    setupPasswordToggle('toggleLoginPassword', 'login-password');
    setupPasswordToggle('toggleRegPassword', 'reg-password');

    function setupPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);

        if (toggle && input) {
            toggle.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    }

    // Registro - Integrado com API
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const userType = document.getElementById('reg-user-type').value;

        let isValid = true;

        if (username.length === 0) {
            showError('reg-username-error', 'Por favor, insira um nome de usuário.');
            isValid = false;
        } else {
            hideError('reg-username-error');
        }

        if (password.length === 0) {
            showError('reg-password-error', 'Por favor, insira uma senha.');
            isValid = false;
        } else {
            hideError('reg-password-error');
        }

        if (password !== confirmPassword) {
            showError('reg-confirm-password-error', 'As senhas não coincidem.');
            isValid = false;
        } else {
            hideError('reg-confirm-password-error');
        }

        if (!userType) {
            showError('reg-type-error', 'Por favor, selecione um tipo de usuário.');
            isValid = false;
        } else {
            hideError('reg-type-error');
        }

        if (isValid) {
            try {
                // Verificar se usuário já existe
                const usuarios = await API_CONFIG.get('usuarios');
                const userExists = usuarios.find(u => u.username === username);

                if (userExists) {
                    showError('reg-username-error', 'Este nome de usuário já está em uso.');
                    showToast('Este nome de usuário já está em uso.', 'error');
                } else {
                    // Criar novo usuário via API
                    await API_CONFIG.post('usuarios', {
                        username: username,
                        senha: password
                    });

                    showToast('Conta criada com sucesso!', 'success');
                    registerForm.reset();
                    setTimeout(() => {
                        container.classList.remove('active');
                    }, 2000);
                }
            } catch (error) {
                console.error('Erro ao criar conta:', error);
                showToast('Erro ao criar conta. Tente novamente.', 'error');
            }
        } else {
            showToast('Por favor, corrija os erros no formulário.', 'error');
        }
    });

    // Login - Integrado com API
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const loginUserInput = document.getElementById('login-username').value.trim();
        const loginPassInput = document.getElementById('login-password').value;

        let isValid = true;

        if (loginUserInput.length === 0) {
            showError('login-user-error', 'Digite seu usuário');
            isValid = false;
        } else {
            hideError('login-user-error');
        }

        if (loginPassInput.length === 0) {
            showError('login-pass-error', 'Digite sua senha');
            isValid = false;
        } else {
            hideError('login-pass-error');
        }

        if (!isValid) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        try {
            // Buscar usuários da API
            const usuarios = await API_CONFIG.get('usuarios');
            const user = usuarios.find(u => 
                u.username === loginUserInput && 
                u.role === 'napne'
            );

            if (user) {
                // Verificar senha (em produção, usar password_verify)
                // Por enquanto, aceitar qualquer senha para usuários existentes
                // OU verificar se a senha está correta (se houver hash)
                const userData = {
                    username: user.username,
                    role: 'napne',
                    siape: user.siape
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                showToast('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showToast('Usuário ou senha incorretos.', 'error');
                showError('login-user-error', 'Usuário ou senha incorretos');
                showError('login-pass-error', ' ');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            showToast('Erro ao conectar com o servidor. Tente novamente.', 'error');
        }
    });

    function showError(id, message) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideError(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    function showToast(message, type) {
        if (toast) {
            toast.textContent = message;
            toast.className = 'toast show ' + type;

            setTimeout(() => {
                toast.className = 'toast';
            }, 3000);
        }
    }

    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const icon = this.parentElement.querySelector('i');
            if (icon) {
                icon.style.color = '#764ba2';
            }
        });

        input.addEventListener('blur', function() {
            const icon = this.parentElement.querySelector('i');
            if (icon) {
                icon.style.color = '#666';
            }
        });
    });
});
