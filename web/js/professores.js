document.addEventListener('DOMContentLoaded', function() {
    // Formatação de CPF
    function formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    }

    // Aplicar formatação de CPF em tempo real
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
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

    // Dados mockados (em produção viriam do backend)
    let teachers = JSON.parse(localStorage.getItem('teachers')) || [
        {
            id: 1,
            name: 'Prof. João Silva Santos',
            email: 'joao.santos@escola.edu.br',
            cpf: '123.456.789-01',
            birthDate: '1980-05-15'
        },
        {
            id: 2,
            name: 'Prof. Maria Oliveira Costa',
            email: 'maria.costa@escola.edu.br',
            cpf: '234.567.890-12',
            birthDate: '1975-08-22'
        }
    ];

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        loadTeachersTable();
    }

    function setupEventListeners() {
        newTeacherBtn.addEventListener('click', () => openTeacherModal());
        teacherForm.addEventListener('submit', handleTeacherSubmit);
        
        // CPF formatting - using the cpfInput from the top of the file
        if (cpfInput) {
            cpfInput.addEventListener('input', formatCPF);
        }
        
        // Modal events
        setupModalEvents();
        
        // Logout
        document.getElementById('logout').addEventListener('click', logout);
    }

    function setupModalEvents() {
        const closeBtn = teacherModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancelTeacher');
        
        closeBtn.addEventListener('click', () => closeModal(teacherModal));
        cancelBtn.addEventListener('click', () => closeModal(teacherModal));
        
        teacherModal.addEventListener('click', (e) => {
            if (e.target === teacherModal) closeModal(teacherModal);
        });
    }

    function formatCPF(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }

    function openTeacherModal(teacher = null) {
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('teacherForm');
        
        if (teacher) {
            title.textContent = 'Editar Professor';
            populateForm(teacher);
        } else {
            title.textContent = 'Novo Professor';
            form.reset();
            document.getElementById('teacherId').value = '';
        }
        
        teacherModal.style.display = 'block';
    }

    function populateForm(teacher) {
        document.getElementById('teacherId').value = teacher.id;
        document.getElementById('teacherName').value = teacher.name;
        document.getElementById('email').value = teacher.email;
        document.getElementById('cpf').value = teacher.cpf;
        document.getElementById('birthDate').value = teacher.birthDate;
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function handleTeacherSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('teacherName').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            birthDate: document.getElementById('birthDate').value
        };

        const teacherId = document.getElementById('teacherId').value;
        
        if (teacherId) {
            // Edit existing teacher
            const index = teachers.findIndex(t => t.id == teacherId);
            if (index !== -1) {
                teachers[index] = { ...teachers[index], ...formData };
                showToast('Professor atualizado com sucesso!', 'success');
            }
        } else {
            // Create new teacher
            const newTeacher = {
                id: Date.now(),
                ...formData
            };
            teachers.push(newTeacher);
            showToast('Professor cadastrado com sucesso!', 'success');
        }

        localStorage.setItem('teachers', JSON.stringify(teachers));
        loadTeachersTable();
        closeModal(teacherModal);
    }

    function loadTeachersTable() {
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
                <td>${teacher.email}</td>
                <td class="cpf-input">${teacher.cpf}</td>
                <td>${formatDate(teacher.birthDate)}</td>
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
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Global functions for buttons
    window.editTeacher = function(id) {
        const teacher = teachers.find(t => t.id === id);
        if (teacher) openTeacherModal(teacher);
    };

    window.deleteTeacher = function(id) {
        if (confirm('Tem certeza que deseja excluir este professor?')) {
            teachers = teachers.filter(t => t.id !== id);
            localStorage.setItem('teachers', JSON.stringify(teachers));
            loadTeachersTable();
            showToast('Professor excluído com sucesso!', 'success');
        }
    };

    function showToast(message, type) {
        // Create toast if it doesn't exist
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
