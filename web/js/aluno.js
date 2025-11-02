document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o aluno está logado
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent'));
    if (!currentStudent) {
        window.location.href = 'index.html';
        return;
    }

    // Elementos do DOM
    const logoutBtn = document.getElementById('logout');
    const studentWelcome = document.getElementById('student-welcome');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const peiModal = document.getElementById('peiModal');
    const closeModal = document.querySelector('.close');
    
    // Preencher informações do aluno
    studentWelcome.textContent = `Bem-vindo(a), ${currentStudent.name}`;
    document.getElementById('info-name').textContent = currentStudent.name;
    document.getElementById('info-id').textContent = currentStudent.id;
    document.getElementById('info-course').textContent = currentStudent.course;
    document.getElementById('info-level').textContent = currentStudent.level;
    document.getElementById('info-year').textContent = currentStudent.entryYear;
    document.getElementById('info-need').textContent = currentStudent.specificNeed;
    
    // Carregar PEIs do aluno
    loadStudentPeis();
    
    // Logout
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentStudent');
        window.location.href = 'index.html';
    });
    
    // Alternar entre abas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Fechar modal
    closeModal.addEventListener('click', function() {
        closeModalWindow();
    });
    
    // Clicar fora do modal para fechar
    window.addEventListener('click', function(event) {
        if (event.target === peiModal) {
            closeModalWindow();
        }
    });
    
    // Função para carregar PEIs do aluno
    function loadStudentPeis() {
        const peis = JSON.parse(localStorage.getItem('peis')) || [];
        
        // Filtrar PEIs do aluno atual
        const studentPeis = peis.filter(pei => pei.studentName === currentStudent.name);
        
        // Separar por tipo
        const adaptacaoPeis = studentPeis.filter(pei => pei.type === 'adaptacao');
        const historicoPeis = studentPeis.filter(pei => pei.type === 'historico');
        
        // Exibir PEIs de adaptação curricular
        displayPeisList(adaptacaoPeis, 'adaptacao-peis');
        
        // Exibir PEIs históricos
        displayPeisList(historicoPeis, 'historico-peis');
    }
    
    // Função para exibir lista de PEIs
    function displayPeisList(peis, containerId) {
        const container = document.getElementById(containerId);
        
        if (peis.length === 0) {
            container.innerHTML = '<p class="empty-message">Nenhum PEI encontrado.</p>';
            return;
        }
        
        let html = '';
        peis.forEach(pei => {
            html += `
                <div class="pei-item">
                    <div class="pei-info">
                        <h3>${pei.subject}</h3>
                        <p>Docente: ${pei.teacher} | ${pei.yearSemester}</p>
                    </div>
                    <div class="pei-actions">
                        <button class="btn btn-view" onclick="viewPeiDetail(${pei.id})">Ver Detalhes</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Função para visualizar detalhes do PEI
    window.viewPeiDetail = function(peiId) {
        const peis = JSON.parse(localStorage.getItem('peis')) || [];
        const pei = peis.find(p => p.id == peiId);
        
        if (pei) {
            document.getElementById('modalTitle').textContent = `PEI - ${pei.subject}`;
            document.getElementById('detail-subject').textContent = pei.subject;
            document.getElementById('detail-teacher').textContent = pei.teacher;
            document.getElementById('detail-yearSemester').textContent = pei.yearSemester;
            document.getElementById('detail-ementa').textContent = pei.ementa || 'Não informado';
            document.getElementById('detail-generalObjective').textContent = pei.generalObjective || 'Não informado';
            document.getElementById('detail-specificObjectives').textContent = pei.specificObjectives || 'Não informado';
            document.getElementById('detail-contents').textContent = pei.contents || 'Não informado';
            document.getElementById('detail-methodology').textContent = pei.methodology || 'Não informado';
            document.getElementById('detail-evaluation').textContent = pei.evaluation || 'Não informado';
            document.getElementById('detail-opinion').textContent = pei.opinion || 'Não informado';
            
            peiModal.style.display = 'block';
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
    
    // Função para fechar modal
    function closeModalWindow() {
        peiModal.style.display = 'none';
    }
});