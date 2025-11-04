// Incluir o script de configuração da API antes deste arquivo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'professor') {
        window.location.href = 'index.html';
        return;
    }

    // Elementos DOM
    const logoutBtn = document.getElementById('logout');
    const userWelcome = document.getElementById('user-welcome');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const peiModal = document.getElementById('peiModal');
    const responseModal = document.getElementById('responseModal');
    const closeModal = document.querySelector('.close');
    const closeResponseModal = document.querySelector('#responseModal .close');
    const cancelResponseBtn = document.getElementById('cancelResponse');
    const responseForm = document.getElementById('responseForm');
    
    // Dados carregados do backend
    let peisAdaptacao = [];
    let peisGeral = [];
    let students = [];
    let courses = [];
    let subjects = [];
    let matriculas = [];

    userWelcome.textContent = `Bem-vindo, Professor ${currentUser.username || currentUser.name || 'Professor'}`;

    // Inicialização
    initPage();

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeModalWindow();
        });
    }

    if (closeResponseModal) {
        closeResponseModal.addEventListener('click', function() {
            closeModalWindow();
        });
    }

    if (cancelResponseBtn) {
        cancelResponseBtn.addEventListener('click', function() {
            closeModalWindow();
        });
    }

    // Clicar fora do modal para fechar
    window.addEventListener('click', function(event) {
        if (event.target === peiModal) {
            closeModalWindow();
        }
        if (event.target === responseModal) {
            closeModalWindow();
        }
    });

    // Enviar resposta do PEI
    if (responseForm) {
        responseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveResponse();
        });
    }

    // Função para inicializar a página
    async function initPage() {
        await loadData();
        loadPeis();
        
        // Verificar se há parâmetros na URL (para visualização/resposta)
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const id = urlParams.get('id');
        
        if (action && id) {
            if (action === 'view') {
                viewPei(id);
            } else if (action === 'respond') {
                respondToPei(id);
            }
        }
    }

    // Função para carregar dados do backend
    async function loadData() {
        try {
            [peisGeral, peisAdaptacao, students, courses, subjects, matriculas] = await Promise.all([
                API_CONFIG.get('peis'),
                API_CONFIG.get('adaptacoes'),
                API_CONFIG.get('estudantes'),
                API_CONFIG.get('cursos'),
                API_CONFIG.get('componentes'),
                API_CONFIG.get('matriculas')
            ]);
        } catch (error) {
            let errorMessage = 'Erro ao carregar dados do servidor';
            
            if (error instanceof SyntaxError) {
                errorMessage = 'Erro ao processar resposta do servidor. Tente novamente.';
            } else if (error instanceof Error) {
                errorMessage = error.message || errorMessage;
            }
            
            console.error('Erro ao carregar dados:', errorMessage, error);
            peisGeral = [];
            peisAdaptacao = [];
            students = [];
            courses = [];
            subjects = [];
            matriculas = [];
        }
    }

    // Função para carregar e exibir PEIs
    function loadPeis() {
        const pendingTableBody = document.getElementById('pending-table-body');
        const respondedTableBody = document.getElementById('responded-table-body');
        
        if (!pendingTableBody || !respondedTableBody) return;
        
        // Limpar tabelas
        pendingTableBody.innerHTML = '';
        respondedTableBody.innerHTML = '';
        
        // Combinar dados de PEI_ADAPTACAO com PEI_GERAL e outras informações
        const peisCompletos = peisAdaptacao.map(pa => {
            const peiGeral = peisGeral.find(pg => pg.id === pa.pei_geral_id);
            const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
            const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
            const course = courses.find(c => matricula && c.codigo === matricula.curso_id);
            const subject = subjects.find(s => s.codigo_componente === pa.codigo_componente);
            
            return {
                id: pa.id,
                pei_geral_id: pa.pei_geral_id,
                studentName: student ? student.nome : 'N/A',
                course: course ? course.nome : 'N/A',
                subject: subject ? subject.componente : 'N/A',
                teacher: pa.docente || 'N/A',
                yearSemester: peiGeral ? peiGeral.periodo : 'N/A',
                ementa: pa.ementa || '',
                generalObjective: pa.objetivo_geral || '',
                specificObjectives: pa.objetivos_especificos || '',
                contents: pa.conteudos || '',
                methodology: pa.metodologia || '',
                evaluation: pa.avaliacao || '',
                opinion: pa.comentarios_napne || '',
                // Verificar se o professor atual é o responsável
                isAssigned: pa.docente === currentUser.username || pa.docente === currentUser.name
            };
        });
        
        // Filtrar PEIs atribuídos a este professor
        const professorPeis = peisCompletos.filter(pei => pei.isAssigned);
        
        if (professorPeis.length === 0) {
            pendingTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI atribuído a você.</td></tr>';
            respondedTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI respondido.</td></tr>';
            return;
        }
        
        // Separar PEIs por status (assumindo que sem parecer = pendente)
        const pendingPeis = professorPeis; // Todos pendentes por enquanto
        const respondedPeis = []; // Implementar quando tiver sistema de pareceres
        
        // Preencher tabela de PEIs pendentes
        if (pendingPeis.length === 0) {
            pendingTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI pendente.</td></tr>';
        } else {
            pendingPeis.forEach(pei => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pei.studentName}</td>
                    <td>${pei.course}</td>
                    <td>${pei.subject}</td>
                    <td>${pei.teacher}</td>
                    <td>${pei.yearSemester}</td>
                    <td>-</td>
                    <td><span class="status-badge status-pending">Pendente</span></td>
                    <td>
                        <button class="btn btn-view" onclick="viewPei(${pei.id})">Ver</button>
                        <button class="btn btn-respond" onclick="respondToPei(${pei.id})">Responder</button>
                    </td>
                `;
                pendingTableBody.appendChild(row);
            });
        }
        
        // Preencher tabela de PEIs respondidos
        if (respondedPeis.length === 0) {
            respondedTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI respondido.</td></tr>';
        } else {
            respondedPeis.forEach(pei => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pei.studentName}</td>
                    <td>${pei.course}</td>
                    <td>${pei.subject}</td>
                    <td>${pei.yearSemester}</td>
                    <td>-</td>
                    <td><span class="status-badge status-completed">Concluído</span></td>
                    <td>
                        <button class="btn btn-view" onclick="viewPei(${pei.id})">Ver</button>
                    </td>
                `;
                respondedTableBody.appendChild(row);
            });
        }
    }
    
    // Função para obter texto do status
    function getStatusText(status) {
        const statusMap = {
            'pending': 'Pendente',
            'in_progress': 'Em Andamento',
            'completed': 'Concluído',
            'rejected': 'Rejeitado'
        };
        return statusMap[status] || 'Pendente';
    }
    
    // Função para visualizar PEI
    window.viewPei = function(id) {
        const peiAdaptacao = peisAdaptacao.find(p => p.id == id);
        
        if (peiAdaptacao) {
            const peiGeral = peisGeral.find(pg => pg.id === peiAdaptacao.pei_geral_id);
            const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
            const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
            const course = courses.find(c => matricula && c.codigo === matricula.curso_id);
            const subject = subjects.find(s => s.codigo_componente === peiAdaptacao.codigo_componente);
            
            if (document.getElementById('modalTitle')) {
                document.getElementById('modalTitle').textContent = `PEI - ${subject ? subject.componente : 'N/A'}`;
            }
            if (document.getElementById('detail-student')) {
                document.getElementById('detail-student').textContent = student ? student.nome : 'N/A';
            }
            if (document.getElementById('detail-course')) {
                document.getElementById('detail-course').textContent = course ? course.nome : 'N/A';
            }
            if (document.getElementById('detail-subject')) {
                document.getElementById('detail-subject').textContent = subject ? subject.componente : 'N/A';
            }
            if (document.getElementById('detail-yearSemester')) {
                document.getElementById('detail-yearSemester').textContent = peiGeral ? peiGeral.periodo : 'N/A';
            }
            if (document.getElementById('detail-need')) {
                document.getElementById('detail-need').textContent = peiGeral ? peiGeral.dificuldades || 'Não informado' : 'Não informado';
            }
            if (document.getElementById('detail-ementa')) {
                document.getElementById('detail-ementa').textContent = peiAdaptacao.ementa || 'Não informado';
            }
            if (document.getElementById('detail-generalObjective')) {
                document.getElementById('detail-generalObjective').textContent = peiAdaptacao.objetivo_geral || 'Não informado';
            }
            if (document.getElementById('detail-specificObjectives')) {
                document.getElementById('detail-specificObjectives').textContent = peiAdaptacao.objetivos_especificos || 'Não informado';
            }
            if (document.getElementById('detail-contents')) {
                document.getElementById('detail-contents').textContent = peiAdaptacao.conteudos || 'Não informado';
            }
            if (document.getElementById('detail-methodology')) {
                document.getElementById('detail-methodology').textContent = peiAdaptacao.metodologia || 'Não informado';
            }
            if (document.getElementById('detail-evaluation')) {
                document.getElementById('detail-evaluation').textContent = peiAdaptacao.avaliacao || 'Não informado';
            }
            if (document.getElementById('detail-opinion')) {
                document.getElementById('detail-opinion').textContent = peiAdaptacao.comentarios_napne || 'Não informado';
            }
            
            // Mostrar resposta do professor se existir (implementar quando tiver sistema de pareceres)
            const responseSection = document.getElementById('response-section');
            const noResponseMessage = document.getElementById('no-response');
            const responseContent = document.getElementById('response-content');
            
            if (responseSection && noResponseMessage && responseContent) {
                responseSection.style.display = 'none';
                noResponseMessage.style.display = 'block';
            }
            
            if (peiModal) {
                peiModal.style.display = 'block';
            }
        }
    };
    
    // Função para responder ao PEI
    window.respondToPei = function(id) {
        const peiAdaptacao = peisAdaptacao.find(p => p.id == id);
        
        if (peiAdaptacao) {
            const peiGeral = peisGeral.find(pg => pg.id === peiAdaptacao.pei_geral_id);
            const matricula = matriculas.find(m => peiGeral && m.matricula === peiGeral.matricula);
            const student = students.find(s => matricula && s.id_aluno === matricula.estudante_id);
            const course = courses.find(c => matricula && c.codigo === matricula.curso_id);
            const subject = subjects.find(s => s.codigo_componente === peiAdaptacao.codigo_componente);
            
            if (document.getElementById('responseModalTitle')) {
                document.getElementById('responseModalTitle').textContent = `Responder PEI - ${subject ? subject.componente : 'N/A'}`;
            }
            if (document.getElementById('responsePeiId')) {
                document.getElementById('responsePeiId').value = peiAdaptacao.id;
            }
            
            // Preencher informações básicas
            if (document.getElementById('response-student')) {
                document.getElementById('response-student').textContent = student ? student.nome : 'N/A';
            }
            if (document.getElementById('response-course')) {
                document.getElementById('response-course').textContent = course ? course.nome : 'N/A';
            }
            if (document.getElementById('response-subject')) {
                document.getElementById('response-subject').textContent = subject ? subject.componente : 'N/A';
            }
            
            // Limpar formulário
            if (document.getElementById('adaptations')) {
                document.getElementById('adaptations').value = '';
            }
            if (document.getElementById('methodology')) {
                document.getElementById('methodology').value = '';
            }
            if (document.getElementById('results')) {
                document.getElementById('results').value = '';
            }
            if (document.getElementById('observations')) {
                document.getElementById('observations').value = '';
            }
            if (document.getElementById('responseStatus')) {
                document.getElementById('responseStatus').value = 'in_progress';
            }
            
            // Mostrar modal de resposta
            if (responseModal) {
                responseModal.style.display = 'block';
            }
        }
    };
    
    // Função para salvar resposta
    async function saveResponse() {
        const peiId = document.getElementById('responsePeiId')?.value;
        const adaptations = document.getElementById('adaptations')?.value || '';
        const methodology = document.getElementById('methodology')?.value || '';
        const results = document.getElementById('results')?.value || '';
        const observations = document.getElementById('observations')?.value || '';
        const status = document.getElementById('responseStatus')?.value || 'in_progress';
        
        if (!peiId) {
            alert('Erro: ID do PEI não encontrado');
            return;
        }
        
        try {
            // Buscar o PEI de adaptação
            const peiAdaptacao = peisAdaptacao.find(p => p.id == peiId);
            if (!peiAdaptacao) {
                alert('PEI não encontrado');
                return;
            }
            
            // Criar parecer (resposta do professor)
            // TODO: Implementar endpoint de pareceres quando disponível
            // Por enquanto, atualizar comentários do PEI
            const updatedData = {
                pei_geral_id: peiAdaptacao.pei_geral_id,
                codigo_componente: peiAdaptacao.codigo_componente,
                ementa: peiAdaptacao.ementa,
                objetivo_geral: peiAdaptacao.objetivo_geral,
                objetivos_especificos: peiAdaptacao.objetivos_especificos,
                conteudos: peiAdaptacao.conteudos,
                metodologia: methodology || peiAdaptacao.metodologia,
                avaliacao: results || peiAdaptacao.avaliacao,
                comentarios_napne: observations || peiAdaptacao.comentarios_napne,
                docente: peiAdaptacao.docente
            };
            
            await API_CONFIG.put(`adaptacoes/${peiId}`, updatedData);
            
            // Fechar modal e recarregar dados
            if (responseModal) {
                responseModal.style.display = 'none';
            }
            await loadData();
            loadPeis();
            
            // Mostrar mensagem de sucesso
            alert('Resposta salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar resposta:', error);
            alert('Erro ao salvar resposta: ' + (error.message || 'Erro desconhecido'));
        }
    }
    
    // Função para alternar entre abas
    function switchTab(tab) {
        // Remover classe active de todas as abas e conteúdos
        tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Adicionar classe active à aba clicada e ao conteúdo correspondente
        const activeBtn = document.querySelector(`[data-tab="${tab}"]`);
        const activeContent = document.getElementById(`${tab}-content`);
        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }
    
    // Função para fechar modal
    function closeModalWindow() {
        if (peiModal) {
            peiModal.style.display = 'none';
        }
        if (responseModal) {
            responseModal.style.display = 'none';
        }
    }
});
