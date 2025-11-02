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
    const newStudentBtn = document.getElementById('newStudentBtn');
    const studentModal = document.getElementById('studentModal');
    const studentForm = document.getElementById('studentForm');
    const studentsTableBody = document.getElementById('students-table-body');
    const needTypeSelect = document.getElementById('needType');
    const specificNeedSelect = document.getElementById('specificNeed');
    const courseSelect = document.getElementById('course');

    // Dados mockados (em produção viriam do backend)
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let courses = JSON.parse(localStorage.getItem('courses')) || [
        { id: 1, name: 'Técnico em Informática', level: 'Técnico' },
        { id: 2, name: 'Técnico em Agropecuária', level: 'Técnico' },
        { id: 3, name: 'Análise e Desenvolvimento de Sistemas', level: 'Superior' }
    ];

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

    function init() {
        setupEventListeners();
        loadStudentsTable();
        populateCourseSelect();
        setupFilters();
    }

    function setupEventListeners() {
        newStudentBtn.addEventListener('click', () => openStudentModal());
        studentForm.addEventListener('submit', handleStudentSubmit);
        
        // CPF formatting - using the cpfInput from the top of the file
        if (cpfInput) {
            cpfInput.addEventListener('input', formatCPF);
        }
        
        // Specific needs dependency
        needTypeSelect.addEventListener('change', updateSpecificNeeds);
        
        // Modal events
        setupModalEvents();
        
        // Filter events
        setupFilterEvents();
        
        // Logout
        document.getElementById('logout').addEventListener('click', logout);
    }

    function setupModalEvents() {
        const closeBtn = studentModal.querySelector('.close');
        const cancelBtn = document.getElementById('cancelStudent');
        
        closeBtn.addEventListener('click', () => closeModal(studentModal));
        cancelBtn.addEventListener('click', () => closeModal(studentModal));
        
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

    function formatCPF(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
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
        document.getElementById('studentId').value = student.id;
        document.getElementById('matricula').value = student.matricula;
        document.getElementById('name').value = student.name;
        document.getElementById('cpf').value = student.cpf;
        document.getElementById('birthDate').value = student.birthDate;
        document.getElementById('course').value = student.courseId;
        document.getElementById('entryDate').value = student.entryDate;
        document.getElementById('needType').value = student.needType;
        
        // Update specific needs and set value
        updateSpecificNeeds();
        setTimeout(() => {
            document.getElementById('specificNeed').value = student.specificNeed || '';
        }, 100);
        
        document.getElementById('hasMentoring').value = student.hasMentoring.toString();
        document.getElementById('psychopedagogical').value = student.psychopedagogical.toString();
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function handleStudentSubmit(e) {
        e.preventDefault();
        
        const formData = {
            matricula: document.getElementById('matricula').value,
            name: document.getElementById('name').value,
            cpf: document.getElementById('cpf').value,
            birthDate: document.getElementById('birthDate').value,
            courseId: parseInt(document.getElementById('course').value),
            entryDate: document.getElementById('entryDate').value,
            needType: document.getElementById('needType').value,
            specificNeed: document.getElementById('specificNeed').value,
            hasMentoring: document.getElementById('hasMentoring').value === 'true',
            psychopedagogical: document.getElementById('psychopedagogical').value === 'true'
        };

        // Add course name
        const course = courses.find(c => c.id === formData.courseId);
        formData.courseName = course ? course.name : '';
        formData.courseLevel = course ? course.level : '';

        const studentId = document.getElementById('studentId').value;
        
        if (studentId) {
            // Edit existing student
            const index = students.findIndex(s => s.id == studentId);
            if (index !== -1) {
                students[index] = { ...students[index], ...formData };
                showToast('Estudante atualizado com sucesso!', 'success');
            }
        } else {
            // Create new student
            const newStudent = {
                id: Date.now(),
                ...formData
            };
            students.push(newStudent);
            showToast('Estudante cadastrado com sucesso!', 'success');
        }

        localStorage.setItem('students', JSON.stringify(students));
        loadStudentsTable();
        closeModal(studentModal);
    }

    function loadStudentsTable() {
        studentsTableBody.innerHTML = '';
        
        if (students.length === 0) {
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
        
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${student.matricula}</strong></td>
                <td>${student.name}</td>
                <td class="cpf-input">${student.cpf}</td>
                <td>${student.courseName}</td>
                <td><span class="badge ${student.courseLevel.toLowerCase()}">${student.courseLevel}</span></td>
                <td>${formatDate(student.entryDate)}</td>
                <td><span class="badge ${student.needType}">${student.specificNeed || 'Não informado'}</span></td>
                <td><span class="badge ${student.hasMentoring ? 'sim' : 'não'}">${student.hasMentoring ? 'Sim' : 'Não'}</span></td>
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
        // Populate filter options
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
        // Implementation for filters would go here
        showToast('Filtros aplicados!', 'info');
    }

    function clearFilters() {
        const filterSelects = document.querySelectorAll('.filter-item select');
        filterSelects.forEach(select => select.value = 'all');
        loadStudentsTable();
        showToast('Filtros limpos!', 'info');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Global functions for buttons
    window.editStudent = function(id) {
        const student = students.find(s => s.id === id);
        if (student) openStudentModal(student);
    };

    window.deleteStudent = function(id) {
        if (confirm('Tem certeza que deseja excluir este estudante?')) {
            students = students.filter(s => s.id !== id);
            localStorage.setItem('students', JSON.stringify(students));
            loadStudentsTable();
            showToast('Estudante excluído com sucesso!', 'success');
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
