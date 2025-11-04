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
    const newStudentBtn = document.getElementById('newStudentBtn');
    const studentModal = document.getElementById('studentModal');
    const studentForm = document.getElementById('studentForm');
    const studentsTableBody = document.getElementById('students-table-body');
    const needTypeSelect = document.getElementById('needType');
    const specificNeedSelect = document.getElementById('specificNeed');
    const courseSelect = document.getElementById('course');

    // Dados carregados do backend
    let students = [];
    let courses = [];
    let matriculas = [];

    const specificNeeds = {
        'deficiencia': [
            'Deficiência Visual - Cegueira',
            'Deficiência Visual - Baixa Visão',
            'Deficiência Auditiva - Surdez',
            'Deficiência Auditiva - Perda Auditiva',
            'Deficiência Física - Cadeirante',
            'Deficiência Física - Mobilidade Reduzida',
            'Deficiência Intelectual',
            'Deficiência Múltipla'
        ],
        'tea': [
            'Transtorno do Espectro Autista - Nível 1',
            'Transtorno do Espectro Autista - Nível 2',
            'Transtorno do Espectro Autista - Nível 3',
            'Síndrome de Asperger'
        ],
        'altas-habilidades': [
            'Superdotação Acadêmica',
            'Superdotação Criativa',
            'Superdotação Psicomotora',
            'Superdotação Artística'
        ],
        'transtornos': [
            'Dislexia',
            'Discalculia',
            'Disgrafia',
            'TDAH - Transtorno do Déficit de Atenção',
            'Transtorno de Processamento Auditivo'
        ],
        'nenhuma': ['Nenhuma necessidade específica']
    };

    // Inicialização
    init();

    async function init() {
        setupEventListeners();
        await loadData();
        loadStudentsTable();
        populateCourseSelect();
        setupFilters();
    }

    async function loadData() {
        try {
            // Carregar cursos e estudantes em paralelo
            [courses, students, matriculas] = await Promise.all([
                API_CONFIG.get('cursos'),
                API_CONFIG.get('estudantes'),
                API_CONFIG.get('matriculas')
            ]);

            // Mapear cursos para formato esperado pelo frontend
            courses = courses.map(c => ({
                id: c.codigo,
                code: c.codigo,
                name: c.nome,
                level: c.modalidade || 'Técnico'
            }));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showToast('Erro ao carregar dados do servidor', 'error');
            courses = [];
            students = [];
            matriculas = [];
        }
    }

    // Combinar dados de estudantes com matrículas e cursos
    function getStudentsWithMatricula() {
        return students.map(estudante => {
            const matricula = matriculas.find(m => m.estudante_id === estudante.id_aluno);
            const curso = courses.find(c => matricula && c.id === matricula.curso_id);
            
            return {
                id: estudante.id_aluno,
                id_aluno: estudante.id_aluno,
                matricula: matricula ? matricula.matricula : '',
                name: estudante.nome,
                cpf: formatCPF(estudante.cpf),
                courseId: curso ? curso.id : null,
                courseName: curso ? curso.name : '',
                courseLevel: curso ? curso.level : '',
                contato: estudante.contato,
                endereco: estudante.endereco,
                psychopedagogical: estudante.precisa_atendimento_psicopedagogico === 1 || estudante.precisa_atendimento_psicopedagogico === true
            };
        });
    }

    function setupEventListeners() {
        newStudentBtn.addEventListener('click', () => openStudentModal());
        studentForm.addEventListener('submit', handleStudentSubmit);
        
        // CPF formatting
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                e.target.value = formatCPF(e.target.value);
            });
        }
        
        // Specific needs dependency
        needTypeSelect.addEventListener('change', updateSpecificNeeds);
        
        // Modal events
        setupModalEvents();
        
        // Filter events
        setupFilterEvents();
        
        // Logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }

    function setupModalEvents() {
        const closeBtn = studentModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancelStudent');
        
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(studentModal));
        if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal(studentModal));
        
        studentModal.addEventListener('click', (e) => {
            if (e.target === studentModal) closeModal(studentModal);
        });
    }

    function setupFilterEvents() {
        const filterButtons = document.querySelectorAll('#applyFilters, #clearFilters');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.id === 'applyFilters') {
                    applyFilters();
                } else {
                    clearFilters();
                }
            });
        });
    }

    function updateSpecificNeeds() {
        const selectedType = needTypeSelect.value;
        specificNeedSelect.innerHTML = '<option value="">Selecione a necessidade específica</option>';
        
        if (selectedType && specificNeeds[selectedType]) {
            specificNeeds[selectedType].forEach(need => {
                const option = document.createElement('option');
                option.value = need;
                option.textContent = need;
                specificNeedSelect.appendChild(option);
            });
        }
    }

    function populateCourseSelect() {
        courseSelect.innerHTML = '<option value="">Selecione o curso</option>';
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.name} (${course.level})`;
            courseSelect.appendChild(option);
        });
    }

    function openStudentModal(student = null) {
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('studentForm');
        
        if (student) {
            title.textContent = 'Editar Estudante';
            populateForm(student);
        } else {
            title.textContent = 'Novo Estudante';
            form.reset();
            document.getElementById('studentId').value = '';
            updateSpecificNeeds();
        }
        
        studentModal.style.display = 'block';
    }

    function populateForm(student) {
        document.getElementById('studentId').value = student.id || student.id_aluno || '';
        document.getElementById('matricula').value = student.matricula || '';
        document.getElementById('name').value = student.name || student.nome || '';
        document.getElementById('cpf').value = formatCPF(student.cpf || '');
        document.getElementById('birthDate').value = student.birthDate || '';
        document.getElementById('course').value = student.courseId || '';
        document.getElementById('entryDate').value = student.entryDate || '';
        document.getElementById('needType').value = student.needType || '';
        
        updateSpecificNeeds();
        setTimeout(() => {
            document.getElementById('specificNeed').value = student.specificNeed || '';
        }, 100);
        
        const hasMentoring = document.getElementById('hasMentoring');
        const psychopedagogical = document.getElementById('psychopedagogical');
        if (hasMentoring) {
            // Converter valor booleano/inteiro para string 'true' ou 'false'
            const mentoringValue = student.hasMentoring;
            hasMentoring.value = (mentoringValue === true || mentoringValue === 1 || mentoringValue === '1' || mentoringValue === 'true') ? 'true' : 'false';
        }
        if (psychopedagogical) {
            // Converter valor booleano/inteiro para string 'true' ou 'false'
            const psychValue = student.psychopedagogical;
            psychopedagogical.value = (psychValue === true || psychValue === 1 || psychValue === '1' || psychValue === 'true') ? 'true' : 'false';
        }
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    async function handleStudentSubmit(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('studentId').value;
        const cpfRaw = document.getElementById('cpf').value.replace(/\D/g, '');
        
        // Obter valor do select de atendimento psicopedagógico
        const psychopedagogicalSelect = document.getElementById('psychopedagogical');
        let precisaAtendimento = 0;
        if (psychopedagogicalSelect && psychopedagogicalSelect.value) {
            precisaAtendimento = (psychopedagogicalSelect.value === 'true' || psychopedagogicalSelect.value === '1') ? 1 : 0;
        }
        
        const formData = {
            cpf: cpfRaw,
            nome: document.getElementById('name').value,
            contato: document.getElementById('contato')?.value || '',
            endereco: document.getElementById('endereco')?.value || '',
            precisa_atendimento_psicopedagogico: precisaAtendimento, // Sempre inteiro: 0 ou 1
            matricula: document.getElementById('matricula')?.value || '',
            courseId: document.getElementById('course')?.value || ''
        };

        try {
            if (studentId) {
                // Editar estudante existente
                await API_CONFIG.put(`estudantes/${studentId}`, formData);
                showToast('Estudante atualizado com sucesso!', 'success');
            } else {
                // Criar novo estudante
                await API_CONFIG.post('estudantes', formData);
                showToast('Estudante cadastrado com sucesso!', 'success');
            }
            
            // Recarregar dados
            await loadData();
            loadStudentsTable();
            closeModal(studentModal);
        } catch (error) {
            console.error('Erro ao salvar estudante:', error);
            showToast(error.message || 'Erro ao salvar estudante', 'error');
        }
    }

    function loadStudentsTable() {
        studentsTableBody.innerHTML = '';
        
        const studentsWithData = getStudentsWithMatricula();
        
        if (studentsWithData.length === 0) {
            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="empty-state">
                        <i class="fas fa-user-graduate"></i>
                        <h3>Nenhum estudante cadastrado</h3>
                        <p>Clique em "Novo Estudante" para começar</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        studentsWithData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${student.matricula || 'N/A'}</strong></td>
                <td>${student.name}</td>
                <td class="cpf-input">${student.cpf}</td>
                <td>${student.courseName || 'N/A'}</td>
                <td><span class="badge ${student.courseLevel ? student.courseLevel.toLowerCase() : ''}">${student.courseLevel || 'N/A'}</span></td>
                <td>-</td>
                <td><span class="badge">Não informado</span></td>
                <td><span class="badge não">Não</span></td>
                <td><span class="badge ${student.psychopedagogical ? 'sim' : 'não'}">${student.psychopedagogical ? 'Sim' : 'Não'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editStudent(${student.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            studentsTableBody.appendChild(row);
        });
    }

    function setupFilters() {
        const filterCourse = document.getElementById('filter-course');
        const filterNeedType = document.getElementById('filter-need-type');
        
        if (filterCourse) {
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                filterCourse.appendChild(option);
            });
        }
    }

    function applyFilters() {
        showToast('Filtros aplicados!', 'info');
    }

    function clearFilters() {
        const filterSelects = document.querySelectorAll('.filter-item select');
        filterSelects.forEach(select => select.value = 'all');
        loadStudentsTable();
        showToast('Filtros limpos!', 'info');
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Global functions for buttons
    window.editStudent = function(id) {
        const studentsWithData = getStudentsWithMatricula();
        const student = studentsWithData.find(s => s.id === id);
        if (student) openStudentModal(student);
    };

    window.deleteStudent = async function(id) {
        if (confirm('Tem certeza que deseja excluir este estudante?')) {
            try {
                await API_CONFIG.delete(`estudantes/${id}`);
                showToast('Estudante excluído com sucesso!', 'success');
                await loadData();
                loadStudentsTable();
            } catch (error) {
                console.error('Erro ao excluir estudante:', error);
                showToast(error.message || 'Erro ao excluir estudante', 'error');
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
