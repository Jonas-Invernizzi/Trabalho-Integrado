// Incluir o script de configuração da API antes deste arquivo
document.addEventListener('DOMContentLoaded', function() {
    // Formatação de CPF
    function formatCPF(cpf) {
        if (!cpf) return '';
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    }

    // Verificar autenticação
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'napne') {
        window.location.href = 'index.html';
        return;
    }

    // Elementos DOM
    const newTeacherBtn = document.getElementById('newTeacherBtn');
    const teacherModal = document.getElementById('teacherModal');
    const teacherForm = document.getElementById('teacherForm');
    const teachersTableBody = document.getElementById('teachers-table-body');

    // Dados carregados do backend
    let teachers = [];

    // Inicialização
    init();

    async function init() {
        setupEventListeners();
        await loadData();
        loadTeachersTable();
    }

    async function loadData() {
        try {
            teachers = await API_CONFIG.get('servidores');
            // Filtrar apenas professores (tipo = 'Docente')
            teachers = teachers.filter(t => t.tipo === 'Docente').map(t => ({
                id: t.siape,
                siape: t.siape,
                name: t.nome,
                email: t.email,
                cpf: formatCPF(t.cpf),
                phone: t.telefone,
                type: t.tipo
            }));
        } catch (error) {
            let errorMessage = 'Erro ao carregar dados do servidor';
            
            if (error instanceof SyntaxError) {
                errorMessage = 'Erro ao processar resposta do servidor. Tente novamente.';
            } else if (error instanceof Error) {
                errorMessage = error.message || errorMessage;
            }
            
            console.error('Erro ao carregar professores:', errorMessage, error);
            showToast(errorMessage, 'error');
            teachers = [];
        }
    }

    function setupEventListeners() {
        if (newTeacherBtn) newTeacherBtn.addEventListener('click', () => openTeacherModal());
        if (teacherForm) teacherForm.addEventListener('submit', handleTeacherSubmit);
        
        // CPF formatting
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                e.target.value = formatCPF(e.target.value);
            });
        }
        
        // Modal events
        setupModalEvents();
        
        // Logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }

    function setupModalEvents() {
        if (!teacherModal) return;
        const closeBtn = teacherModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancelTeacher');
        
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(teacherModal));
        if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal(teacherModal));
        
        teacherModal.addEventListener('click', (e) => {
            if (e.target === teacherModal) closeModal(teacherModal);
        });
    }

    function openTeacherModal(teacher = null) {
        if (!teacherModal) return;
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('teacherForm');
        
        if (teacher) {
            if (title) title.textContent = 'Editar Professor';
            populateForm(teacher);
        } else {
            if (title) title.textContent = 'Novo Professor';
            if (form) form.reset();
            const teacherId = document.getElementById('teacherId');
            if (teacherId) teacherId.value = '';
        }
        
        teacherModal.style.display = 'block';
    }

    function populateForm(teacher) {
        const teacherId = document.getElementById('teacherId');
        const teacherName = document.getElementById('teacherName');
        const email = document.getElementById('email');
        const cpf = document.getElementById('cpf');
        const phone = document.getElementById('phone') || document.getElementById('telefone');
        const birthDate = document.getElementById('birthDate');
        
        if (teacherId) teacherId.value = teacher.id || teacher.siape || '';
        if (teacherName) teacherName.value = teacher.name || teacher.nome || '';
        if (email) email.value = teacher.email || '';
        if (cpf) cpf.value = formatCPF(teacher.cpf || '');
        if (phone) phone.value = teacher.phone || teacher.telefone || '';
        if (birthDate) birthDate.value = teacher.birthDate || '';
    }

    function closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }

    async function handleTeacherSubmit(e) {
        e.preventDefault();
        
        const teacherId = document.getElementById('teacherId')?.value;
        const cpfRaw = document.getElementById('cpf')?.value.replace(/\D/g, '') || '';
        
        const formData = {
            nome: document.getElementById('teacherName')?.value || '',
            email: document.getElementById('email')?.value || '',
            cpf: cpfRaw,
            telefone: (document.getElementById('phone') || document.getElementById('telefone'))?.value || '',
            tipo: 'Docente'
        };

        // Adicionar siape se for edição
        if (teacherId) {
            formData.siape = parseInt(teacherId);
        }

        try {
            if (teacherId) {
                // Editar professor existente
                await API_CONFIG.put(`servidores/${teacherId}`, formData);
                showToast('Professor atualizado com sucesso!', 'success');
            } else {
                // Criar novo professor
                await API_CONFIG.post('servidores', formData);
                showToast('Professor cadastrado com sucesso!', 'success');
            }
            
            // Recarregar dados
            await loadData();
            loadTeachersTable();
            closeModal(teacherModal);
        } catch (error) {
            console.error('Erro ao salvar professor:', error);
            showToast(error.message || 'Erro ao salvar professor', 'error');
        }
    }

    function loadTeachersTable() {
        if (!teachersTableBody) return;
        teachersTableBody.innerHTML = '';
        
        if (teachers.length === 0) {
            teachersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <h3>Nenhum professor cadastrado</h3>
                        <p>Clique em "Novo Professor" para começar</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${teacher.name}</strong></td>
                <td>${teacher.email || 'N/A'}</td>
                <td class="cpf-input">${teacher.cpf}</td>
                <td>${teacher.phone || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTeacher(${teacher.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${teacher.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            teachersTableBody.appendChild(row);
        });
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Global functions for buttons
    window.editTeacher = function(id) {
        const teacher = teachers.find(t => t.id === id);
        if (teacher) openTeacherModal(teacher);
    };

    window.deleteTeacher = async function(id) {
        if (confirm('Tem certeza que deseja excluir este professor?')) {
            try {
                await API_CONFIG.delete(`servidores/${id}`);
                showToast('Professor excluído com sucesso!', 'success');
                await loadData();
                loadTeachersTable();
            } catch (error) {
                console.error('Erro ao excluir professor:', error);
                showToast(error.message || 'Erro ao excluir professor', 'error');
            }
        }
    };

    function showToast(message, type) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});
