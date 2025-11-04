// Incluir o script de configuração da API antes deste arquivo
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

    // Dados carregados do backend
    let courses = [];
    let subjects = [];

    // Inicialização
    init();

    async function init() {
        setupEventListeners();
        await loadData();
        loadCoursesTable();
        loadSubjectsTable();
        populateCourseSelects();
        populateFilterOptions();
    }

    async function loadData() {
        try {
            [courses, subjects] = await Promise.all([
                API_CONFIG.get('cursos'),
                API_CONFIG.get('componentes')
            ]);

            // Mapear cursos para formato esperado pelo frontend
            courses = courses.map(c => ({
                id: c.codigo,
                code: c.codigo,
                name: c.nome,
                level: c.modalidade || 'Técnico',
                description: c.duracao || ''
            }));

            // Mapear componentes curriculares para formato esperado pelo frontend
            subjects = subjects.map(s => ({
                id: s.codigo_componente,
                name: s.componente,
                cargaHoraria: s.carga_horaria,
                courseId: null, // Componentes não estão diretamente ligados a cursos na estrutura atual
                courseName: 'Geral'
            }));
        } catch (error) {
            // Melhorar tratamento de erro
            let errorMessage = 'Erro ao carregar dados do servidor';
            
            if (error instanceof SyntaxError) {
                errorMessage = 'Erro ao processar resposta do servidor. Tente novamente.';
            } else if (error instanceof TypeError && error.message.includes('JSON')) {
                errorMessage = 'Erro ao processar dados recebidos.';
            } else if (error instanceof Error) {
                errorMessage = error.message || errorMessage;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            // Log detalhado do erro
            console.error('Erro ao carregar dados:', errorMessage, error);
            
            // Mostrar mensagem amigável ao usuário
            showToast(errorMessage, 'error');
            
            // Inicializar arrays vazios para evitar erros
            courses = [];
            subjects = [];
        }
    }

    function setupEventListeners() {
        // Tabs
        tabButtons.forEach(button => {
            button.addEventListener('click', () => switchTab(button.dataset.tab));
        });

        // Botões principais
        if (newCourseBtn) newCourseBtn.addEventListener('click', () => openCourseModal());
        if (newSubjectBtn) newSubjectBtn.addEventListener('click', () => openSubjectModal());

        // Formulários
        if (courseForm) courseForm.addEventListener('submit', handleCourseSubmit);
        if (subjectForm) subjectForm.addEventListener('submit', handleSubjectSubmit);

        // Modais
        setupModalEvents();

        // Filtros
        if (filterCourseSubject) {
            filterCourseSubject.addEventListener('change', filterSubjects);
        }

        // Logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }

    function setupModalEvents() {
        const modals = [courseModal, subjectModal, courseDetailsModal];
        
        modals.forEach(modal => {
            if (!modal) return;
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });

        // Botões de cancelar
        const cancelCourse = document.getElementById('cancelCourse');
        const cancelSubject = document.getElementById('cancelSubject');
        if (cancelCourse) cancelCourse.addEventListener('click', () => closeModal(courseModal));
        if (cancelSubject) cancelSubject.addEventListener('click', () => closeModal(subjectModal));
    }

    function switchTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-content`);
        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }

    function openCourseModal(course = null) {
        const title = document.getElementById('courseModalTitle');
        const form = document.getElementById('courseForm');
        
        if (course) {
            if (title) title.textContent = 'Editar Curso';
            if (document.getElementById('courseId')) document.getElementById('courseId').value = course.id || course.codigo;
            if (document.getElementById('courseCode')) document.getElementById('courseCode').value = course.code || course.codigo || '';
            if (document.getElementById('courseName')) document.getElementById('courseName').value = course.name || course.nome || '';
            if (document.getElementById('courseLevel')) document.getElementById('courseLevel').value = course.level || course.modalidade || '';
            if (document.getElementById('courseDescription')) document.getElementById('courseDescription').value = course.description || '';
        } else {
            if (title) title.textContent = 'Novo Curso';
            if (form) form.reset();
            if (document.getElementById('courseId')) document.getElementById('courseId').value = '';
        }
        
        if (courseModal) courseModal.style.display = 'block';
    }

    function openSubjectModal(subject = null) {
        const title = document.getElementById('subjectModalTitle');
        const form = document.getElementById('subjectForm');
        
        if (subject) {
            if (title) title.textContent = 'Editar Matéria';
            // Usar apenas id, não codigo_componente (que pode ser diferente)
            if (document.getElementById('subjectId')) document.getElementById('subjectId').value = subject.id || '';
            if (document.getElementById('subjectCourse')) document.getElementById('subjectCourse').value = subject.courseId || '';
            if (document.getElementById('subjectName')) document.getElementById('subjectName').value = subject.name || subject.componente || '';
            if (document.getElementById('subjectPeriod')) document.getElementById('subjectPeriod').value = subject.period || '';
            if (document.getElementById('subjectType')) document.getElementById('subjectType').value = subject.type || '';
            if (document.getElementById('subjectDescription')) document.getElementById('subjectDescription').value = subject.description || '';
        } else {
            if (title) title.textContent = 'Nova Matéria';
            if (form) form.reset();
            if (document.getElementById('subjectId')) document.getElementById('subjectId').value = '';
        }
        
        if (subjectModal) subjectModal.style.display = 'block';
    }

    function closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }

    async function handleCourseSubmit(e) {
        e.preventDefault();
        
        const courseId = document.getElementById('courseId')?.value;
        
        const courseData = {
            code: document.getElementById('courseCode')?.value || '',
            name: document.getElementById('courseName')?.value || '',
            level: document.getElementById('courseLevel')?.value || '',
            description: document.getElementById('courseDescription')?.value || '',
            workload: null,
            duration: document.getElementById('courseDescription')?.value || ''
        };

        // Mapear para formato do backend
        const backendData = {
            codigo: courseData.code || undefined,
            nome: courseData.name,
            modalidade: courseData.level,
            carga_horaria: courseData.workload,
            duracao: courseData.duration,
            coordenador_cpf: null
        };

        try {
            if (courseId) {
                // Editar curso existente
                await API_CONFIG.put(`cursos/${courseId}`, backendData);
                showToast('Curso atualizado com sucesso!', 'success');
            } else {
                // Criar novo curso
                await API_CONFIG.post('cursos', backendData);
                showToast('Curso criado com sucesso!', 'success');
            }
            
            await loadData();
            loadCoursesTable();
            populateCourseSelects();
            populateFilterOptions();
            closeModal(courseModal);
        } catch (error) {
            console.error('Erro ao salvar curso:', error);
            showToast(error.message || 'Erro ao salvar curso', 'error');
        }
    }

    async function handleSubjectSubmit(e) {
        e.preventDefault();
        
        const subjectId = document.getElementById('subjectId')?.value;
        
        // Garantir que não há codigo_componente no objeto
        const subjectData = {
            componente: document.getElementById('subjectName')?.value || '',
            carga_horaria: parseInt(document.getElementById('subjectDescription')?.value) || 0
        };
        
        // Remover explicitamente qualquer codigo_componente
        delete subjectData.codigo_componente;

        try {
            if (subjectId) {
                // Editar matéria existente
                await API_CONFIG.put(`componentes/${subjectId}`, subjectData);
                showToast('Matéria atualizada com sucesso!', 'success');
            } else {
                // Criar nova matéria - o backend vai gerar o código automaticamente
                await API_CONFIG.post('componentes', subjectData);
                showToast('Matéria criada com sucesso!', 'success');
            }
            
            await loadData();
            loadSubjectsTable();
            closeModal(subjectModal);
        } catch (error) {
            console.error('Erro ao salvar matéria:', error);
            showToast(error.message || 'Erro ao salvar matéria', 'error');
        }
    }

    function loadCoursesTable() {
        if (!coursesTableBody) return;
        coursesTableBody.innerHTML = '';
        
        courses.forEach(course => {
            const subjectCount = subjects.filter(s => s.courseId === course.id).length;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.code || ''}</td>
                <td>${course.name}</td>
                <td><span class="badge ${course.level ? course.level.toLowerCase() : ''}">${course.level || ''}</span></td>
                <td>${subjectCount}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewCourseDetails('${course.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editCourse('${course.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            coursesTableBody.appendChild(row);
        });
    }

    function loadSubjectsTable() {
        if (!subjectsTableBody) return;
        const filteredSubjects = getFilteredSubjects();
        subjectsTableBody.innerHTML = '';
        
        filteredSubjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td>${subject.courseName || 'Geral'}</td>
                <td>-</td>
                <td><span class="badge">Geral</span></td>
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
            if (!select) return;
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
        if (!filterCourseSubject) return;
        filterCourseSubject.innerHTML = '<option value="all">Todos os Cursos</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            filterCourseSubject.appendChild(option);
        });
    }

    function getFilteredSubjects() {
        if (!filterCourseSubject) return subjects;
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
        const course = courses.find(c => c.id === id || c.codigo === id);
        if (course) openCourseModal(course);
    };

    window.deleteCourse = async function(id) {
        if (confirm('Tem certeza que deseja excluir este curso? Todas as matérias associadas também serão removidas.')) {
            try {
                await API_CONFIG.delete(`cursos/${id}`);
                showToast('Curso excluído com sucesso!', 'success');
                await loadData();
                loadCoursesTable();
                loadSubjectsTable();
                populateCourseSelects();
                populateFilterOptions();
            } catch (error) {
                console.error('Erro ao excluir curso:', error);
                showToast(error.message || 'Erro ao excluir curso', 'error');
            }
        }
    };

    window.viewCourseDetails = function(id) {
        const course = courses.find(c => c.id === id || c.codigo === id);
        if (!course) return;

        const title = document.getElementById('courseDetailsTitle');
        if (title) title.textContent = `Detalhes: ${course.name}`;
        
        const detailCode = document.getElementById('detail-course-code');
        const detailName = document.getElementById('detail-course-name');
        const detailLevel = document.getElementById('detail-course-level');
        const detailDescription = document.getElementById('detail-course-description');
        
        if (detailCode) detailCode.textContent = course.code || '';
        if (detailName) detailName.textContent = course.name || '';
        if (detailLevel) detailLevel.textContent = course.level || '';
        if (detailDescription) detailDescription.textContent = course.description || 'Nenhuma descrição disponível.';

        // Listar matérias do curso
        const courseSubjects = subjects.filter(s => s.courseId === id);
        const subjectsList = document.getElementById('course-subjects-list');
        
        if (subjectsList) {
            if (courseSubjects.length === 0) {
                subjectsList.innerHTML = '<p class="empty-message">Nenhuma matéria cadastrada para este curso.</p>';
            } else {
                subjectsList.innerHTML = courseSubjects.map(subject => `
                    <div class="subject-item">
                        <h4>${subject.name}</h4>
                        <p><strong>Carga Horária:</strong> ${subject.cargaHoraria || 'N/A'} horas</p>
                    </div>
                `).join('');
            }
        }

        if (courseDetailsModal) courseDetailsModal.style.display = 'block';
    };

    window.editSubject = function(id) {
        const subject = subjects.find(s => s.id === id);
        if (subject) openSubjectModal(subject);
    };

    window.deleteSubject = async function(id) {
        if (confirm('Tem certeza que deseja excluir esta matéria?')) {
            try {
                await API_CONFIG.delete(`componentes/${id}`);
                showToast('Matéria excluída com sucesso!', 'success');
                await loadData();
                loadSubjectsTable();
                loadCoursesTable();
            } catch (error) {
                console.error('Erro ao excluir matéria:', error);
                showToast(error.message || 'Erro ao excluir matéria', 'error');
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
