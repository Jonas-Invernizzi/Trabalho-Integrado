document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está logado e se é um professor
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Verificar se o usuário é um professor
    if (currentUser.role !== 'professor' && currentUser.role !== 'napne') { // NAPNE também pode gerenciar PEIs
        alert('Apenas usuários autorizados (Professores ou NAPNE) podem acessar a gestão de PEIs.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Elementos do DOM
    const logoutBtn = document.getElementById('logout');
    const newPeiBtn = document.getElementById('newPeiBtn');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const peiModal = document.getElementById('peiModal');
    const closeModal = document.querySelector('.close');
    const cancelPeiBtn = document.getElementById('cancelPei');
    const peiForm = document.getElementById('peiForm');
    const generatePdfBtn = document.getElementById('generatePdf');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const needTypeFilter = document.getElementById('filter-need-type');
    const specificNeedFilter = document.getElementById('filter-specific');
    const courseFilter = document.getElementById('filter-course');
    const needTypeSelect = document.getElementById('needType');
    const studentNameSelect = document.getElementById('studentName');
    const studentCourseSelect = document.getElementById('studentCourse');
    const teacherInput = document.getElementById('teacher'); // Adicionado
    
    // Dados carregados do backend
    let peisGeral = [];
    let peisAdaptacao = [];
    let students = [];
    let courses = [];
    let teachers = [];
    let subjects = [];
    let matriculas = [];
    
    // Mapeamento de necessidades específicas
    const specificNeeds = {
        'deficiencia': [
            'Baixa visão', 'Cegueira', 'Visão monocular',
            'Deficiência auditiva', 'Surdez', 'Surdocegueira',
            'Deficiência física', 'Deficiência intelectual', 'Deficiência múltipla'
        ],
        'tea': [
            'Transtorno do Espectro Autista'
        ],
        'altas-habilidades': [
            'Altas habilidades ou superdotação'
        ],
        'transtornos': [
            'Dislexia',
            'Dislalia ou outro transtorno da linguagem e comunicação',
            'Disgrafia, Disortografia ou outro transtorno da escrita e ortografia',
            'Discalculia ou outro transtorno da matemática e raciocínio lógico',
            'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)',
            'Transtorno do Processamento Auditivo Central (TPAC)'
        ]
    };
    
    // Inicializar a página
    initPage();
    
    // Logout
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Abrir modal para novo PEI
    newPeiBtn.addEventListener('click', function() {
        openModal();
    });
    
    // Fechar modal
    closeModal.addEventListener('click', function() {
        closeModalWindow();
    });
    
    cancelPeiBtn.addEventListener('click', function() {
        closeModalWindow();
    });
    
    // Clicar fora do modal para fechar
    window.addEventListener('click', function(event) {
        if (event.target === peiModal) {
            closeModalWindow();
        }
    });
    
    // Alternar entre abas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Aplicar filtros
    applyFiltersBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    // Limpar filtros
    clearFiltersBtn.addEventListener('click', function() {
        clearFilters();
    });
    
    // Gerar PDF
    generatePdfBtn.addEventListener('click', function() {
        generatePdf();
    });
    
    // Alterar tipo de necessidade no modal
    needTypeSelect.addEventListener('change', function() {
        updateSpecificNeedsOptions(this.value);
    });
    
    // Alterar tipo de necessidade no filtro
    needTypeFilter.addEventListener('change', function() {
        updateFilterSpecificNeedsOptions(this.value);
    });
    
    // Alterar estudante selecionado
    studentNameSelect.addEventListener('change', function() {
        updateStudentInfo(this.value); // Chamada para a nova função
    });

    // Alterar curso selecionado
    studentCourseSelect.addEventListener('change', function() {
        populateSubjectOptions(this.value);
    });

    // Alterar matéria selecionada
    document.getElementById('subject').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption) {
            const description = selectedOption.dataset.description;
            document.getElementById('ementa').value = description || '';
        }
    });

    // Enviar formulário de PEI
    peiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        savePei();
    });
    
    // Função para inicializar a página
    async function initPage() {
        await loadData();
        
        // Preencher opções de cursos
        populateCourseOptions();

        // Preencher opções de alunos
        populateStudentOptions();

        // Preencher opções de professores
        populateTeacherOptions();

        // Preencher opções de necessidades específicas
        updateFilterSpecificNeedsOptions('all');

        // Carregar e exibir PEIs
        loadPeis();

        // Verificar se há parâmetros na URL (para edição/visualização)
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const id = urlParams.get('id');

        if (action && id) {
            if (action === 'edit') {
                openModal(id);
            } else if (action === 'view') {
                viewPei(id);
            }
        }
    }

    // Carregar dados do backend
    async function loadData() {
        try {
            [students, courses, subjects, servidores, peisGeral, peisAdaptacao, matriculas] = await Promise.all([
                API_CONFIG.get('estudantes'),
                API_CONFIG.get('cursos'),
                API_CONFIG.get('componentes'),
                API_CONFIG.get('servidores'),
                API_CONFIG.get('peis'),
                API_CONFIG.get('adaptacoes'),
                API_CONFIG.get('matriculas')
            ]);

            // Mapear servidores para teachers (apenas Docentes)
            teachers = servidores.filter(s => s.tipo === 'Docente').map(t => ({
                id: t.siape,
                name: t.nome,
                email: t.email,
                tipo: t.tipo
            }));

            // Mapear cursos para formato esperado
            courses = courses.map(c => ({
                codigo: c.codigo,
                id: c.codigo,
                nome: c.nome,
                name: c.nome,
                modalidade: c.modalidade,
                level: c.modalidade || 'Técnico'
            }));

            // Mapear componentes (subjects) para formato esperado
            subjects = subjects.map(s => ({
                codigo_componente: s.codigo_componente,
                id: s.codigo_componente,
                componente: s.componente,
                name: s.componente,
                carga_horaria: s.carga_horaria,
                cargaHoraria: s.carga_horaria
            }));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            students = [];
            courses = [];
            teachers = [];
            subjects = [];
            peisGeral = [];
            peisAdaptacao = [];
            matriculas = [];
        }
    }
    
    // Função para preencher opções de cursos
    function populateCourseOptions() {
        const filterCourseSelect = document.getElementById('filter-course');

        // Limpar opções existentes
        studentCourseSelect.innerHTML = '<option value="">Selecione o curso</option>';
        filterCourseSelect.innerHTML = '<option value="all">Todos</option>';

        // Adicionar cursos
        courses.forEach(course => {
            const courseId = course.id;
            const courseName = course.name;
            studentCourseSelect.innerHTML += `<option value="${courseId}">${courseName}</option>`;
            filterCourseSelect.innerHTML += `<option value="${courseName}">${courseName}</option>`;
        });
    }
    
    // Função para preencher opções de alunos
    function populateStudentOptions() {
        if (!studentNameSelect) return;
        // Limpar opções existentes
        studentNameSelect.innerHTML = '<option value="">Selecione o estudante</option>';

        // Adicionar alunos com matrícula e curso
        students.forEach(student => {
            // Buscar matrícula do estudante
            const matricula = matriculas.find(m => m.estudante_id === student.id_aluno);
            const course = courses.find(c => matricula && c.id === matricula.curso_id);
            const courseName = course ? course.name : 'Curso não informado';
            
            studentNameSelect.innerHTML += `<option value="${student.nome}" data-matricula="${matricula ? matricula.matricula : ''}" data-course-id="${course ? course.id : ''}" data-course="${courseName}">${student.nome}</option>`;
        });
    }

    // Função para preencher opções de professores
    function populateTeacherOptions() {
        const teacherSelect = document.getElementById('teacher');
        teacherSelect.innerHTML = '<option value="">Selecione o docente</option>';

        teachers.forEach(teacher => {
            teacherSelect.innerHTML += `<option value="${teacher.name}">${teacher.name}</option>`;
        });
    }

    // Função para preencher opções de matérias baseado no curso
    function populateSubjectOptions(courseId) {
        const subjectSelect = document.getElementById('subject');
        const ementaTextarea = document.getElementById('ementa');
        subjectSelect.innerHTML = '<option value="">Selecione a matéria</option>';
        ementaTextarea.value = ''; // Clear ementa when course changes

        if (courseId) {
            const courseSubjects = subjects.filter(s => s.courseId == courseId);
            courseSubjects.forEach(subject => {
                subjectSelect.innerHTML += `<option value="${subject.name}" data-description="${subject.description}">${subject.name}</option>`;
            });
        }
    }
    
    // Nova função para atualizar curso e necessidade específica baseado no aluno selecionado
    function updateStudentInfo(studentName) {
        const selectedOption = studentNameSelect.options[studentNameSelect.selectedIndex];
        if (selectedOption) {
            const courseId = selectedOption.dataset.courseId;
            const courseName = selectedOption.dataset.course;
            const specificNeed = selectedOption.dataset.specificNeed;

            studentCourseSelect.value = courseId;
            populateSubjectOptions(courseId); // Preencher matérias do curso

            // Encontrar o tipo de necessidade correspondente à necessidade específica
            let needType = '';
            for (const type in specificNeeds) {
                if (specificNeeds[type].includes(specificNeed)) {
                    needType = type;
                    break;
                }
            }
            needTypeSelect.value = needType;
            updateSpecificNeedsOptions(needType); // Atualizar as opções de necessidade específica

            // Definir a necessidade específica
            setTimeout(() => {
                document.getElementById('specificNeed').value = specificNeed;
            }, 100);

            // Atualizar o filtro de tipo de necessidade para refletir o aluno selecionado
            needTypeFilter.value = needType;
            updateFilterSpecificNeedsOptions(needType);

            // Definir a necessidade específica no filtro
            setTimeout(() => {
                specificNeedFilter.value = specificNeed;
            }, 100);
        }
    }
    
    // Função para atualizar opções de necessidades específicas no modal
    function updateSpecificNeedsOptions(needType) {
        const specificNeedSelect = document.getElementById('specificNeed');
        
        // Limpar opções existentes
        specificNeedSelect.innerHTML = '<option value="">Selecione a necessidade específica</option>';
        
        // Adicionar opções baseadas no tipo selecionado
        if (needType && specificNeeds[needType]) {
            specificNeeds[needType].forEach(need => {
                specificNeedSelect.innerHTML += `<option value="${need}">${need}</option>`;
            });
        }
    }
    
    // Função para atualizar opções de necessidades específicas no filtro
    function updateFilterSpecificNeedsOptions(needType) {
        // Limpar opções existentes
        specificNeedFilter.innerHTML = '<option value="all">Todos</option>';
        
        // Adicionar opções baseadas no tipo selecionado
        if (needType && needType !== 'all' && specificNeeds[needType]) {
            specificNeeds[needType].forEach(need => {
                specificNeedFilter.innerHTML += `<option value="${need}">${need}</option>`;
            });
        } else if (needType === 'all') {
            // Adicionar todas as necessidades
            Object.values(specificNeeds).flat().forEach(need => {
                specificNeedFilter.innerHTML += `<option value="${need}">${need}</option>`;
            });
        }
    }
    
    // Função para carregar e exibir PEIs
    function loadPeis() {
        const peiTableBody = document.getElementById('pei-table-body');
        const historicoTableBody = document.getElementById('pei-historico-table-body');
        
        if (!peiTableBody || !historicoTableBody) return;
        
        // Limpar tabelas
        peiTableBody.innerHTML = '';
        historicoTableBody.innerHTML = '';
        
        // Combinar dados de PEI_ADAPTACAO com PEI_GERAL e outras informações
        const peisCompletos = peisAdaptacao.map(pa => {
            const peiGeral = peisGeral.find(pg => pg.id === pa.pei_geral_id);
            const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
            const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
            const course = courses.find(c => matricula && c.id === matricula.curso_id);
            const subject = subjects.find(s => s.id === pa.codigo_componente);
            
            return {
                id: pa.id,
                pei_geral_id: pa.pei_geral_id,
                studentName: student ? student.nome : 'N/A',
                course: course ? course.name : 'N/A',
                subject: subject ? subject.name : 'N/A',
                teacher: pa.docente || 'N/A',
                yearSemester: peiGeral ? peiGeral.periodo : 'N/A',
                ementa: pa.ementa || '',
                generalObjective: pa.objetivo_geral || '',
                specificObjectives: pa.objetivos_especificos || '',
                contents: pa.conteudos || '',
                methodology: pa.metodologia || '',
                evaluation: pa.avaliacao || '',
                opinion: pa.comentarios_napne || '',
                data_criacao: pa.data_criacao
            };
        });
        
        // Preencher tabela de adaptação curricular
        if (peisCompletos.length === 0) {
            peiTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI de adaptação curricular cadastrado.</td></tr>';
        } else {
            peisCompletos.forEach(pei => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pei.studentName}</td>
                    <td>${pei.course}</td>
                    <td>${pei.subject}</td>
                    <td>${pei.teacher}</td>
                    <td>${pei.yearSemester}</td>
                    <td>-</td>
                    <td>
                        <button class="btn btn-view" onclick="viewPei(${pei.id})">Visualizar</button>
                        <button class="btn btn-edit" onclick="editPei(${pei.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletePei(${pei.id})">Excluir</button>
                    </td>
                `;
                peiTableBody.appendChild(row);
            });
        }
        
        // Histórico (PEIs gerais sem adaptação ainda)
        const peisGeralSemAdaptacao = peisGeral.filter(pg => 
            !peisAdaptacao.some(pa => pa.pei_geral_id === pg.id)
        );
        
        if (peisGeralSemAdaptacao.length === 0) {
            historicoTableBody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum PEI histórico cadastrado.</td></tr>';
        } else {
            peisGeralSemAdaptacao.forEach(pei => {
                const matricula = matriculas.find(m => m.matricula === pei.matricula);
                const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
                const course = courses.find(c => matricula && c.id === matricula.curso_id);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student ? student.nome : 'N/A'}</td>
                    <td>${course ? course.name : 'N/A'}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${pei.periodo || 'N/A'}</td>
                    <td>
                        <button class="btn btn-view" onclick="viewPeiGeral(${pei.id})">Visualizar</button>
                    </td>
                `;
                historicoTableBody.appendChild(row);
            });
        }
    }
    
    window.viewPeiGeral = function(id) {
        const pei = peisGeral.find(p => p.id == id);
        if (pei) {
            alert(`PEI Geral ID: ${pei.id}\nMatrícula: ${pei.matricula}\nPeríodo: ${pei.periodo}\nDificuldades: ${pei.dificuldades || 'N/A'}`);
        }
    };
    
    // Função para abrir modal (novo, edição ou visualização)
    function openModal(id = null, readOnly = false) {
        const modalTitle = document.getElementById('modalTitle');
        const peiIdField = document.getElementById('peiId');
        const peiTypeField = document.getElementById('peiType');
        const saveBtn = document.getElementById('savePei');
        const generatePdfBtn = document.getElementById('generatePdf');

        if (id) {
            // Modo edição ou visualização
            // Buscar PEI de adaptação
            const peiAdaptacao = peisAdaptacao.find(p => p.id == id);
            if (peiAdaptacao) {
                const peiGeral = peisGeral.find(pg => pg.id === peiAdaptacao.pei_geral_id);
                const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
                const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
                const course = courses.find(c => matricula && c.id === matricula.curso_id);
                const subject = subjects.find(s => s.id === peiAdaptacao.codigo_componente);
                
                const pei = {
                    id: peiAdaptacao.id,
                    studentName: student ? student.nome : '',
                    course: course ? course.id : '',
                    subject: subject ? subject.id.toString() : '',
                    teacher: peiAdaptacao.docente || '',
                    yearSemester: peiGeral ? peiGeral.periodo : '',
                    ementa: peiAdaptacao.ementa || '',
                    generalObjective: peiAdaptacao.objetivo_geral || '',
                    specificObjectives: peiAdaptacao.objetivos_especificos || '',
                    contents: peiAdaptacao.conteudos || '',
                    methodology: peiAdaptacao.metodologia || '',
                    evaluation: peiAdaptacao.avaliacao || '',
                    opinion: peiAdaptacao.comentarios_napne || '',
                    type: 'adaptacao'
                };
                
                if (readOnly) {
                    modalTitle.textContent = 'Visualizar PEI - Adaptação Curricular';
                    // Desabilitar todos os campos
                    const inputs = peiForm.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => input.disabled = true);
                    saveBtn.style.display = 'none';
                    generatePdfBtn.style.display = 'inline-block';
                } else {
                    modalTitle.textContent = 'Editar PEI - Adaptação Curricular';
                    // Habilitar campos
                    const inputs = peiForm.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => input.disabled = false);
                    saveBtn.style.display = 'inline-block';
                    generatePdfBtn.style.display = 'inline-block';
                }
                peiIdField.value = pei.id;
                peiTypeField.value = pei.type;

                // Preencher formulário com dados existentes
                document.getElementById('studentName').value = pei.studentName;
                document.getElementById('studentCourse').value = pei.course;
                document.getElementById('subject').value = pei.subject;
                teacherInput.value = pei.teacher; // Preencher o campo do professor
                document.getElementById('yearSemester').value = pei.yearSemester;
                document.getElementById('needType').value = pei.needType;

                // Atualizar opções de necessidades específicas
                updateSpecificNeedsOptions(pei.needType);

                // Definir valor após um pequeno delay para garantir que as opções foram carregadas
                setTimeout(() => {
                    document.getElementById('specificNeed').value = pei.specificNeed;
                }, 100);

                // Preencher ementa baseada na matéria selecionada
                setTimeout(() => {
                    const subjectSelect = document.getElementById('subject');
                    const selectedOption = subjectSelect.options[subjectSelect.selectedIndex];
                    if (selectedOption) {
                        const description = selectedOption.dataset.description;
                        document.getElementById('ementa').value = description || pei.ementa || '';
                    } else {
                        document.getElementById('ementa').value = pei.ementa || '';
                    }
                }, 200);
                document.getElementById('generalObjective').value = pei.generalObjective || '';
                document.getElementById('specificObjectives').value = pei.specificObjectives || '';
                document.getElementById('contents').value = pei.contents || '';
                document.getElementById('methodology').value = pei.methodology || '';
                document.getElementById('evaluation').value = pei.evaluation || '';
                document.getElementById('opinion').value = pei.opinion || '';
            }
        } else {
            // Modo novo
            modalTitle.textContent = 'Novo PEI - Adaptação Curricular';
            peiForm.reset();
            peiIdField.value = '';
            peiTypeField.value = 'adaptacao';
            // Habilitar campos
            const inputs = peiForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.disabled = false);
            saveBtn.style.display = 'inline-block';
            generatePdfBtn.style.display = 'inline-block';
        }

        peiModal.style.display = 'block';
    }
    
    // Função para fechar modal
    function closeModalWindow() {
        peiModal.style.display = 'none';
    }
    
    // Função para salvar PEI
    async function savePei() {
        const peiId = document.getElementById('peiId').value;
        const peiType = document.getElementById('peiType').value;
        const studentName = document.getElementById('studentName').value;
        const courseId = document.getElementById('studentCourse').value;
        const subjectId = document.getElementById('subject').value;
        const teacher = document.getElementById('teacher').value;
        const yearSemester = document.getElementById('yearSemester').value;
        const needType = document.getElementById('needType').value;
        const specificNeed = document.getElementById('specificNeed').value;
        const ementa = document.getElementById('ementa').value;
        const generalObjective = document.getElementById('generalObjective').value;
        const specificObjectives = document.getElementById('specificObjectives').value;
        const contents = document.getElementById('contents').value;
        const methodology = document.getElementById('methodology').value;
        const evaluation = document.getElementById('evaluation').value;
        const opinion = document.getElementById('opinion').value;
        
        try {
            // Buscar estudante e matrícula
            const student = students.find(s => s.nome === studentName);
            if (!student) {
                alert('Estudante não encontrado!');
                return;
            }

            const matricula = matriculas.find(m => m.estudante_id === student.id_aluno);
            if (!matricula || !matricula.matricula) {
                alert('Matrícula não encontrada para este estudante!');
                return;
            }

            if (peiId) {
                // Editar PEI existente
                const peiAdaptacao = peisAdaptacao.find(p => p.id == peiId);
                if (peiAdaptacao) {
                    const peiData = {
                        pei_geral_id: peiAdaptacao.pei_geral_id,
                        codigo_componente: parseInt(subjectId) || 0,
                        ementa: ementa,
                        objetivo_geral: generalObjective,
                        objetivos_especificos: specificObjectives,
                        conteudos: contents,
                        metodologia: methodology,
                        avaliacao: evaluation,
                        comentarios_napne: opinion,
                        docente: teacher
                    };
                    await API_CONFIG.put(`adaptacoes/${peiId}`, peiData);
                    showToast('PEI atualizado com sucesso!', 'success');
                }
            } else {
                // Criar novo PEI
                // Primeiro criar PEI_GERAL
                const peiGeralData = {
                    matricula: matricula.matricula,
                    periodo: yearSemester,
                    dificuldades: specificNeed || '',
                    interesses_habilidades: '',
                    estrategias: ''
                };
                
                const peiGeral = await API_CONFIG.post('peis', peiGeralData);
                
                // Depois criar PEI_ADAPTACAO
                const peiAdaptacaoData = {
                    pei_geral_id: peiGeral.id,
                    codigo_componente: parseInt(subjectId) || 0,
                    ementa: ementa,
                    objetivo_geral: generalObjective,
                    objetivos_especificos: specificObjectives,
                    conteudos: contents,
                    metodologia: methodology,
                    avaliacao: evaluation,
                    comentarios_napne: opinion,
                    docente: teacher
                };
                
                await API_CONFIG.post('adaptacoes', peiAdaptacaoData);
                showToast('PEI salvo com sucesso!', 'success');
            }
            
            // Recarregar dados
            await loadData();
            
            // Fechar modal e recarregar exibição
            closeModalWindow();
            loadPeis();
            
        } catch (error) {
            console.error('Erro ao salvar PEI:', error);
            alert('Erro ao salvar PEI: ' + (error.message || 'Erro desconhecido'));
        }
    }

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
    
    // Função para visualizar PEI
    window.viewPei = function(id) {
        openModal(id, true);
    };

    // Função para visualizar detalhes do aluno
    window.viewStudentDetails = function(studentName) {
        const student = students.find(s => s.nome === studentName);
        if (!student) {
            alert('Detalhes do aluno não encontrados.');
            return;
        }
        // Buscar matrícula e curso
        const matricula = matriculas.find(m => m.estudante_id === student.id_aluno);
        const course = courses.find(c => matricula && c.codigo === matricula.curso_id);
        const courseName = course ? course.nome : 'Curso não informado';
        
        const details = `
            Nome: ${student.nome}
            CPF: ${student.cpf}
            Curso: ${courseName}
            Contato: ${student.contato || 'Não informado'}
        `;
        alert(details);
    };

    // Função para visualizar detalhes do professor
    window.viewProfessorDetails = function(professorName) {
        const professor = servidores.find(t => t.nome === professorName || t.docente === professorName);
        if (!professor) {
            alert('Detalhes do professor não encontrados.');
            return;
        }
        // Construir mensagem com detalhes do professor
        const details = `
            Nome: ${professor.nome}
            Email: ${professor.email || 'Não informado'}
            Tipo: ${professor.tipo || 'Não informado'}
        `;
        alert(details);
    };

    // Função para editar PEI
    window.editPei = function(id) {
        openModal(id);
    };
    
    // Função para excluir PEI
    window.deletePei = async function(id) {
        if (confirm('Tem certeza que deseja excluir este PEI?')) {
            try {
                await API_CONFIG.delete(`adaptacoes/${id}`);
                showToast('PEI excluído com sucesso!', 'success');
                await loadData();
                loadPeis();
            } catch (error) {
                console.error('Erro ao excluir PEI:', error);
                alert('Erro ao excluir PEI: ' + (error.message || 'Erro desconhecido'));
            }
        }
    };
    
    // Função para alternar entre abas
    function switchTab(tab) {
        // Remover classe active de todas as abas e conteúdos
        tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Adicionar classe active à aba clicada e ao conteúdo correspondente
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-content`).classList.add('active');
    }
    
    // Função para aplicar filtros
    function applyFilters() {
        const needType = document.getElementById('filter-need-type')?.value || 'all';
        const specificNeed = document.getElementById('filter-specific')?.value || 'all';
        const course = document.getElementById('filter-course')?.value || 'all';
        
        // Combinar dados de PEI_ADAPTACAO com PEI_GERAL e outras informações (mesma lógica de loadPeis)
        const peisCompletos = peisAdaptacao.map(pa => {
            const peiGeral = peisGeral.find(pg => pg.id === pa.pei_geral_id);
            const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
            const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
            const courseObj = courses.find(c => matricula && c.codigo === matricula.curso_id);
            const subject = subjects.find(s => s.codigo_componente === pa.codigo_componente);
            
            return {
                id: pa.id,
                pei_geral_id: pa.pei_geral_id,
                studentName: student ? student.nome : 'N/A',
                course: courseObj ? courseObj.nome : 'N/A',
                courseId: courseObj ? courseObj.codigo : null,
                subject: subject ? subject.componente : 'N/A',
                teacher: pa.docente || 'N/A',
                yearSemester: peiGeral ? peiGeral.periodo : 'N/A',
                specificNeed: peiGeral ? peiGeral.dificuldades : '',
                needType: 'all' // TODO: Implementar mapeamento de necessidade específica
            };
        });
        
        // Filtrar PEIs
        let filteredPeis = peisCompletos;
        
        if (needType !== 'all') {
            // TODO: Implementar filtro por tipo de necessidade quando tiver mapeamento
        }
        
        if (specificNeed !== 'all') {
            filteredPeis = filteredPeis.filter(pei => pei.specificNeed === specificNeed);
        }
        
        if (course !== 'all') {
            filteredPeis = filteredPeis.filter(pei => pei.courseId === course);
        }
        
        // Exibir PEIs filtrados usando a mesma estrutura de loadPeis
        displayFilteredPeis(filteredPeis);
    }
    
    // Função para exibir PEIs filtrados
    function displayFilteredPeis(filteredPeis) {
        const peiTableBody = document.getElementById('pei-table-body');
        const historicoTableBody = document.getElementById('pei-historico-table-body');
        
        if (!peiTableBody || !historicoTableBody) return;
        
        // Limpar tabelas
        peiTableBody.innerHTML = '';
        historicoTableBody.innerHTML = '';
        
        if (filteredPeis.length === 0) {
            peiTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI encontrado com os filtros aplicados.</td></tr>';
            historicoTableBody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum PEI encontrado com os filtros aplicados.</td></tr>';
            return;
        }
        
        // Preencher tabela de adaptação curricular
        if (filteredPeis.length === 0) {
            peiTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI de adaptação curricular encontrado.</td></tr>';
        } else {
            filteredPeis.forEach(pei => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pei.studentName}</td>
                    <td>${pei.course}</td>
                    <td>${pei.subject}</td>
                    <td>${pei.teacher}</td>
                    <td>${pei.yearSemester}</td>
                    <td>-</td>
                    <td>
                        <button class="btn btn-view" onclick="viewPei(${pei.id})">Visualizar</button>
                        <button class="btn btn-edit" onclick="editPei(${pei.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletePei(${pei.id})">Excluir</button>
                    </td>
                `;
                peiTableBody.appendChild(row);
            });
        }
        
        // Histórico vazio (filtros aplicam apenas a adaptações)
        historicoTableBody.innerHTML = '<tr><td colspan="6" class="empty-message">Use a aba "Histórico" para ver todos os PEIs gerais.</td></tr>';
    }
    
    // Função para limpar filtros
    function clearFilters() {
        document.getElementById('filter-need-type').value = 'all';
        document.getElementById('filter-specific').value = 'all';
        document.getElementById('filter-course').value = 'all';
        
        // Recarregar todos os PEIs
        loadPeis();
    }
    
    // Função para gerar PDF
    function generatePdf() {
        const peiId = document.getElementById('peiId').value;
        let content = '';

        if (peiId) {
            // Usar dados do PEI salvo
            const peiAdaptacao = peisAdaptacao.find(p => p.id == peiId);
            if (!peiAdaptacao) return;
            
            const peiGeral = peisGeral.find(pg => pg.id === peiAdaptacao.pei_geral_id);
            const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
            const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
            const course = courses.find(c => matricula && c.codigo === matricula.curso_id);
            const subject = subjects.find(s => s.codigo_componente === peiAdaptacao.codigo_componente);
            
            const pei = {
                studentName: student ? student.nome : 'N/A',
                course: course ? course.nome : 'N/A',
                subject: subject ? subject.componente : 'N/A',
                teacher: peiAdaptacao.docente || 'N/A',
                yearSemester: peiGeral ? peiGeral.periodo : 'N/A',
                ementa: peiAdaptacao.ementa || '',
                generalObjective: peiAdaptacao.objetivo_geral || '',
                specificObjectives: peiAdaptacao.objetivos_especificos || '',
                contents: peiAdaptacao.conteudos || '',
                methodology: peiAdaptacao.metodologia || '',
                evaluation: peiAdaptacao.avaliacao || '',
                opinion: peiAdaptacao.comentarios_napne || ''
            };
            
            if (pei) {
                content = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>PEI - Adaptação Curricular</h1>
                        <p><strong>Estudante:</strong> ${pei.studentName}</p>
                        <p><strong>Curso:</strong> ${pei.course}</p>
                        <p><strong>Matéria:</strong> ${pei.subject}</p>
                        <p><strong>Professor:</strong> ${pei.teacher}</p>
                        <p><strong>Ano/Semestre:</strong> ${pei.yearSemester}</p>
                        <p><strong>Tipo de Necessidade:</strong> ${pei.needType}</p>
                        <p><strong>Necessidade Específica:</strong> ${pei.specificNeed}</p>
                        <p><strong>Ementa:</strong> ${pei.ementa}</p>
                        <p><strong>Objetivo Geral:</strong> ${pei.generalObjective}</p>
                        <p><strong>Objetivos Específicos:</strong> ${pei.specificObjectives}</p>
                        <p><strong>Conteúdos:</strong> ${pei.contents}</p>
                        <p><strong>Metodologia:</strong> ${pei.methodology}</p>
                        <p><strong>Avaliação:</strong> ${pei.evaluation}</p>
                        <p><strong>Parecer:</strong> ${pei.opinion}</p>
                    </div>
                `;
            }
        } else {
            // Usar formulário atual
            const peiForm = document.querySelector("#peiForm");
            const clone = peiForm.cloneNode(true);
            clone.querySelector(".form-actions")?.remove();
            content = clone.innerHTML;
        }

        // Pega o nome do aluno para ser o nome do arquivo pdf
        const select = document.getElementById("studentName");
        const valor = select.value || 'PEI';

        // Configuração do pdf (final)
        const options = {
            margin: [10, 10, 10, 10],
            filename: valor,
            html2canvas: {scale: 2},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
        }

        // Gerar e baixar PDF
        html2pdf().set(options).from(content).save();
    }
    
    // Funções globais já definidas acima (viewPei, editPei, deletePei, viewStudentDetails, viewProfessorDetails)
});