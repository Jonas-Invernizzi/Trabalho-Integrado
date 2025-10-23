document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'napne') {
        window.location.href = 'index.html';
        return;
    }

    // Elementos DOM
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const newCourseBtn = document.getElementById('newCourseBtn');
    const newSubjectBtn = document.getElementById('newSubjectBtn');
    const courseModal = document.getElementById('courseModal');
    const subjectModal = document.getElementById('subjectModal');
    const courseDetailsModal = document.getElementById('courseDetailsModal');
    const courseForm = document.getElementById('courseForm');
    const subjectForm = document.getElementById('subjectForm');
    const coursesTableBody = document.getElementById('courses-table-body');
    const subjectsTableBody = document.getElementById('subjects-table-body');
    const filterCourseSubject = document.getElementById('filter-course-subject');

    // Dados mockados (em produção viriam do backend)
    let courses = JSON.parse(localStorage.getItem('courses')) || [
        {
            id: 1,
            code: 'TEC-INFO-001',
            name: 'Técnico em Informática',
            level: 'Técnico',
            description: 'Curso técnico voltado para formação de profissionais em desenvolvimento de sistemas, redes e suporte técnico.'
        },
        {
            id: 2,
            code: 'TEC-AGRO-001',
            name: 'Técnico em Agropecuária',
            level: 'Técnico',
            description: 'Curso técnico para formação de profissionais em produção animal e vegetal, gestão rural e sustentabilidade.'
        },
        {
            id: 3,
            code: 'SUP-SIS-001',
            name: 'Análise e Desenvolvimento de Sistemas',
            level: 'Superior',
            description: 'Curso superior de tecnologia em desenvolvimento de software, análise de sistemas e gestão de projetos.'
        }
    ];

    let subjects = JSON.parse(localStorage.getItem('subjects')) || [
        {
            id: 1,
            name: 'Matemática Aplicada',
            courseId: 1,
            courseName: 'Técnico em Informática',
            period: '1º Semestre',
            type: 'médio',
            description: 'Fundamentos matemáticos aplicados à informática, lógica matemática e estatística básica.'
        },
        {
            id: 2,
            name: 'Inglês Técnico',
            courseId: 1,
            courseName: 'Técnico em Informática',
            period: '1º Semestre',
            type: 'médio',
            description: 'Inglês voltado para área de tecnologia, terminologias técnicas e documentação em inglês.'
        },
        {
            id: 3,
            name: 'Zootecnia Geral',
            courseId: 2,
            courseName: 'Técnico em Agropecuária',
            period: '1º Semestre',
            type: 'médio',
            description: 'Princípios da criação animal, nutrição, reprodução e manejo de rebanhos.'
        },
        {
            id: 4,
            name: 'Programação Orientada a Objetos',
            courseId: 3,
            courseName: 'Análise e Desenvolvimento de Sistemas',
            period: '1º Semestre',
            type: 'superior',
            description: 'Conceitos de POO, classes, herança, polimorfismo e encapsulamento.'
        }
    ];

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        loadCoursesTable();
        loadSubjectsTable();
        populateCourseSelects();
        populateFilterOptions();
    }

    function setupEventListeners() {
        // Tabs
        tabButtons.forEach(button => {
            button.addEventListener('click', () => switchTab(button.dataset.tab));
        });

        // Botões principais
        newCourseBtn.addEventListener('click', () => openCourseModal());
        newSubjectBtn.addEventListener('click', () => openSubjectModal());

        // Formulários
        courseForm.addEventListener('submit', handleCourseSubmit);
        subjectForm.addEventListener('submit', handleSubjectSubmit);

        // Modais
        setupModalEvents();

        // Filtros
        filterCourseSubject.addEventListener('change', filterSubjects);

        // Logout
        document.getElementById('logout').addEventListener('click', logout);
    }

    function setupModalEvents() {
        const modals = [courseModal, subjectModal, courseDetailsModal];
        
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => closeModal(modal));
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });

        // Botões de cancelar
        document.getElementById('cancelCourse').addEventListener('click', () => closeModal(courseModal));
        document.getElementById('cancelSubject').addEventListener('click', () => closeModal(subjectModal));
    }

    function switchTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    function openCourseModal(course = null) {
        const title = document.getElementById('courseModalTitle');
        const form = document.getElementById('courseForm');
        
        if (course) {
            title.textContent = 'Editar Curso';
            document.getElementById('courseId').value = course.id;
            document.getElementById('courseCode').value = course.code;
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseLevel').value = course.level;
            document.getElementById('courseDescription').value = course.description || '';
        } else {
            title.textContent = 'Novo Curso';
            form.reset();
            document.getElementById('courseId').value = '';
        }
        
        courseModal.style.display = 'block';
    }

    function openSubjectModal(subject = null) {
        const title = document.getElementById('subjectModalTitle');
        const form = document.getElementById('subjectForm');
        
        if (subject) {
            title.textContent = 'Editar Matéria';
            document.getElementById('subjectId').value = subject.id;
            document.getElementById('subjectCourse').value = subject.courseId;
            document.getElementById('subjectName').value = subject.name;
            document.getElementById('subjectPeriod').value = subject.period;
            document.getElementById('subjectType').value = subject.type;
            document.getElementById('subjectDescription').value = subject.description || '';
        } else {
            title.textContent = 'Nova Matéria';
            form.reset();
            document.getElementById('subjectId').value = '';
        }
        
        subjectModal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function handleCourseSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const courseData = {
            code: document.getElementById('courseCode').value,
            name: document.getElementById('courseName').value,
            level: document.getElementById('courseLevel').value,
            description: document.getElementById('courseDescription').value
        };

        const courseId = document.getElementById('courseId').value;
        
        if (courseId) {
            // Editar curso existente
            const index = courses.findIndex(c => c.id == courseId);
            if (index !== -1) {
                courses[index] = { ...courses[index], ...courseData };
                showToast('Curso atualizado com sucesso!', 'success');
            }
        } else {
            // Criar novo curso
            const newCourse = {
                id: Date.now(),
                ...courseData
            };
            courses.push(newCourse);
            showToast('Curso criado com sucesso!', 'success');
        }

        localStorage.setItem('courses', JSON.stringify(courses));
        loadCoursesTable();
        populateCourseSelects();
        populateFilterOptions();
        closeModal(courseModal);
    }

    function handleSubjectSubmit(e) {
        e.preventDefault();
        
        const subjectData = {
            name: document.getElementById('subjectName').value,
            courseId: parseInt(document.getElementById('subjectCourse').value),
            period: document.getElementById('subjectPeriod').value,
            type: document.getElementById('subjectType').value,
            description: document.getElementById('subjectDescription').value
        };

        // Adicionar nome do curso
        const course = courses.find(c => c.id === subjectData.courseId);
        subjectData.courseName = course ? course.name : '';

        const subjectId = document.getElementById('subjectId').value;
        
        if (subjectId) {
            // Editar matéria existente
            const index = subjects.findIndex(s => s.id == subjectId);
            if (index !== -1) {
                subjects[index] = { ...subjects[index], ...subjectData };
                showToast('Matéria atualizada com sucesso!', 'success');
            }
        } else {
            // Criar nova matéria
            const newSubject = {
                id: Date.now(),
                ...subjectData
            };
            subjects.push(newSubject);
            showToast('Matéria criada com sucesso!', 'success');
        }

        localStorage.setItem('subjects', JSON.stringify(subjects));
        loadSubjectsTable();
        closeModal(subjectModal);
    }

    function loadCoursesTable() {
        coursesTableBody.innerHTML = '';
        
        courses.forEach(course => {
            const subjectCount = subjects.filter(s => s.courseId === course.id).length;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td><span class="badge ${course.level.toLowerCase()}">${course.level}</span></td>
                <td>${subjectCount}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewCourseDetails(${course.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            coursesTableBody.appendChild(row);
        });
    }

    function loadSubjectsTable() {
        const filteredSubjects = getFilteredSubjects();
        subjectsTableBody.innerHTML = '';
        
        filteredSubjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td>${subject.courseName}</td>
                <td>${subject.period}</td>
                <td><span class="badge ${subject.type}">${subject.type === 'médio' ? 'Ensino Médio' : 'Ensino Superior'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editSubject(${subject.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSubject(${subject.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            subjectsTableBody.appendChild(row);
        });
    }

    function populateCourseSelects() {
        const selects = [document.getElementById('subjectCourse')];
        
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Selecione o curso</option>';
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = `${course.name} (${course.level})`;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        });
    }

    function populateFilterOptions() {
        filterCourseSubject.innerHTML = '<option value="all">Todos os Cursos</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            filterCourseSubject.appendChild(option);
        });
    }

    function getFilteredSubjects() {
        const courseFilter = filterCourseSubject.value;
        
        if (courseFilter === 'all') {
            return subjects;
        }
        
        return subjects.filter(subject => subject.courseId == courseFilter);
    }

    function filterSubjects() {
        loadSubjectsTable();
    }

    // Funções globais para os botões
    window.editCourse = function(id) {
        const course = courses.find(c => c.id === id);
        if (course) openCourseModal(course);
    };

    window.deleteCourse = function(id) {
        if (confirm('Tem certeza que deseja excluir este curso? Todas as matérias associadas também serão removidas.')) {
            courses = courses.filter(c => c.id !== id);
            subjects = subjects.filter(s => s.courseId !== id);
            
            localStorage.setItem('courses', JSON.stringify(courses));
            localStorage.setItem('subjects', JSON.stringify(subjects));
            
            loadCoursesTable();
            loadSubjectsTable();
            populateCourseSelects();
            populateFilterOptions();
            
            showToast('Curso excluído com sucesso!', 'success');
        }
    };

    window.viewCourseDetails = function(id) {
        const course = courses.find(c => c.id === id);
        if (!course) return;

        document.getElementById('courseDetailsTitle').textContent = `Detalhes: ${course.name}`;
        document.getElementById('detail-course-code').textContent = course.code;
        document.getElementById('detail-course-name').textContent = course.name;
        document.getElementById('detail-course-level').textContent = course.level;
        document.getElementById('detail-course-description').textContent = course.description || 'Nenhuma descrição disponível.';

        // Listar matérias do curso
        const courseSubjects = subjects.filter(s => s.courseId === id);
        const subjectsList = document.getElementById('course-subjects-list');
        
        if (courseSubjects.length === 0) {
            subjectsList.innerHTML = '<p class="empty-message">Nenhuma matéria cadastrada para este curso.</p>';
        } else {
            subjectsList.innerHTML = courseSubjects.map(subject => `
                <div class="subject-item">
                    <h4>${subject.name}</h4>
                    <p><strong>Período:</strong> ${subject.period}</p>
                    <p><strong>Tipo:</strong> ${subject.type === 'médio' ? 'Ensino Médio' : 'Ensino Superior'}</p>
                    <p><strong>Ementa:</strong> ${subject.description || 'Não informada'}</p>
                </div>
            `).join('');
        }

        courseDetailsModal.style.display = 'block';
    };

    window.editSubject = function(id) {
        const subject = subjects.find(s => s.id === id);
        if (subject) openSubjectModal(subject);
    };

    window.deleteSubject = function(id) {
        if (confirm('Tem certeza que deseja excluir esta matéria?')) {
            subjects = subjects.filter(s => s.id !== id);
            localStorage.setItem('subjects', JSON.stringify(subjects));
            loadSubjectsTable();
            loadCoursesTable(); // Atualizar contagem de matérias
            showToast('Matéria excluída com sucesso!', 'success');
        }
    };

    function showToast(message, type) {
        // Criar toast se não existir
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
