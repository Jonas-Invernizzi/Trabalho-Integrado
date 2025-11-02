document.addEventListener('DOMContentLoaded', function() {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'professor') {
        window.location.href = 'index.html';
        return;
    }

 
    const logoutBtn = document.getElementById('logout');
    const userWelcome = document.getElementById('user-welcome');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const peiModal = document.getElementById('peiModal');
    const responseModal = document.getElementById('responseModal');
    const closeModal = document.querySelector('.close');
    const closeResponseModal = document.querySelector('#responseModal .close');
    const cancelResponseBtn = document.getElementById('cancelResponse');
    const responseForm = document.getElementById('responseForm');
    

    let peis = JSON.parse(localStorage.getItem('peis')) || [];
    

    userWelcome.textContent = `Bem-vindo, Professor ${currentUser.username}`;
    

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
    
    
    closeModal.addEventListener('click', function() {
        closeModalWindow();
    });

    if (closeResponseModal) {
        closeResponseModal.addEventListener('click', function() {
            closeModalWindow();
        });
    }

    cancelResponseBtn.addEventListener('click', function() {
        closeModalWindow();
    });

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
    responseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveResponse();
    });
    
    // Função para inicializar a página
    function initPage() {
        // Carregar e exibir PEIs
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
    
    // Função para carregar e exibir PEIs
    function loadPeis() {
        const pendingTableBody = document.getElementById('pending-table-body');
        const respondedTableBody = document.getElementById('responded-table-body');
        
        // Limpar tabelas
        pendingTableBody.innerHTML = '';
        respondedTableBody.innerHTML = '';
        
        // Filtrar PEIs atribuídos a este professor
        const professorPeis = peis.filter(pei => 
            pei.teacher === currentUser.username && pei.status !== 'deleted'
        );
        
        if (professorPeis.length === 0) {
            pendingTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI atribuído a você.</td></tr>';
            respondedTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI respondido.</td></tr>';
            return;
        }
        
        // Separar PEIs por status
        const pendingPeis = professorPeis.filter(pei => 
            pei.status === 'pending' || pei.status === 'in_progress'
        );
        
        const respondedPeis = professorPeis.filter(pei => 
            pei.status === 'completed' || pei.status === 'rejected'
        );
        
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
                    <td>${pei.specificNeed}</td>
                    <td><span class="status-badge status-${pei.status || 'pending'}">${getStatusText(pei.status)}</span></td>
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
                    <td>${pei.specificNeed}</td>
                    <td><span class="status-badge status-${pei.status}">${getStatusText(pei.status)}</span></td>
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
        const pei = peis.find(p => p.id == id);
        
        if (pei) {
            document.getElementById('modalTitle').textContent = `PEI - ${pei.subject}`;
            document.getElementById('detail-student').textContent = pei.studentName;
            document.getElementById('detail-course').textContent = pei.course;
            document.getElementById('detail-subject').textContent = pei.subject;
            document.getElementById('detail-yearSemester').textContent = pei.yearSemester;
            document.getElementById('detail-need').textContent = pei.specificNeed;
            document.getElementById('detail-ementa').textContent = pei.ementa || 'Não informado';
            document.getElementById('detail-generalObjective').textContent = pei.generalObjective || 'Não informado';
            document.getElementById('detail-specificObjectives').textContent = pei.specificObjectives || 'Não informado';
            document.getElementById('detail-contents').textContent = pei.contents || 'Não informado';
            document.getElementById('detail-methodology').textContent = pei.methodology || 'Não informado';
            document.getElementById('detail-evaluation').textContent = pei.evaluation || 'Não informado';
            document.getElementById('detail-opinion').textContent = pei.opinion || 'Não informado';
            
            // Mostrar resposta do professor se existir
            const responseSection = document.getElementById('response-section');
            const noResponseMessage = document.getElementById('no-response');
            const responseContent = document.getElementById('response-content');
            
            if (pei.professorResponse) {
                responseSection.style.display = 'block';
                noResponseMessage.style.display = 'none';
                responseContent.innerHTML = `
                    <div class="response-detail">
                        <strong>Data da Resposta:</strong> 
                        <span>${new Date(pei.responseDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="response-detail">
                        <strong>Status:</strong> 
                        <span class="status-badge status-${pei.status}">${getStatusText(pei.status)}</span>
                    </div>
                    <div class="response-detail">
                        <strong>Adaptações Propostas:</strong>
                        <p>${pei.professorResponse.adaptations || 'Não informado'}</p>
                    </div>
                    <div class="response-detail">
                        <strong>Metodologia Aplicada:</strong>
                        <p>${pei.professorResponse.methodology || 'Não informado'}</p>
                    </div>
                    <div class="response-detail">
                        <strong>Resultados Observados:</strong>
                        <p>${pei.professorResponse.results || 'Não informado'}</p>
                    </div>
                    <div class="response-detail">
                        <strong>Observações:</strong>
                        <p>${pei.professorResponse.observations || 'Nenhuma observação'}</p>
                    </div>
                `;
            } else {
                responseSection.style.display = 'none';
                noResponseMessage.style.display = 'block';
            }
            
            peiModal.style.display = 'block';
        }
    };
    
    // Função para responder ao PEI
    window.respondToPei = function(id) {
        const pei = peis.find(p => p.id == id);
        
        if (pei) {
            document.getElementById('responseModalTitle').textContent = `Responder PEI - ${pei.subject}`;
            document.getElementById('responsePeiId').value = pei.id;
            
            // Preencher informações básicas
            document.getElementById('response-student').textContent = pei.studentName;
            document.getElementById('response-course').textContent = pei.course;
            document.getElementById('response-subject').textContent = pei.subject;
            
            // Preencher formulário com dados existentes se houver
            if (pei.professorResponse) {
                document.getElementById('adaptations').value = pei.professorResponse.adaptations || '';
                document.getElementById('methodology').value = pei.professorResponse.methodology || '';
                document.getElementById('results').value = pei.professorResponse.results || '';
                document.getElementById('observations').value = pei.professorResponse.observations || '';
                document.getElementById('responseStatus').value = pei.status;
            } else {
                document.getElementById('adaptations').value = '';
                document.getElementById('methodology').value = '';
                document.getElementById('results').value = '';
                document.getElementById('observations').value = '';
                document.getElementById('responseStatus').value = 'in_progress';
            }
            
            // Mostrar modal de resposta
            document.getElementById('responseModal').style.display = 'block';
        }
    };
    
    // Função para salvar resposta
    function saveResponse() {
        const peiId = document.getElementById('responsePeiId').value;
        const adaptations = document.getElementById('adaptations').value;
        const methodology = document.getElementById('methodology').value;
        const results = document.getElementById('results').value;
        const observations = document.getElementById('observations').value;
        const status = document.getElementById('responseStatus').value;
        
        const index = peis.findIndex(p => p.id == peiId);
        if (index !== -1) {
            peis[index] = {
                ...peis[index],
                professorResponse: {
                    adaptations,
                    methodology,
                    results,
                    observations
                },
                status: status,
                responseDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Salvar no localStorage
            localStorage.setItem('peis', JSON.stringify(peis));
            
            // Fechar modal e recarregar dados
            document.getElementById('responseModal').style.display = 'none';
            loadPeis();
            
            // Mostrar mensagem de sucesso
            alert('Resposta salva com sucesso!');
        }
    }
    
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
        document.getElementById('responseModal').style.display = 'none';
    }
});document.addEventListener('DOMContentLoaded', function() {
document.addEventListener('DOMContentLoaded', function() {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'professor') {
        window.location.href = 'index.html';
        return;
    }

 
    const logoutBtn = document.getElementById('logout');
    const userWelcome = document.getElementById('user-welcome');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const peiModal = document.getElementById('peiModal');
    const responseModal = document.getElementById('responseModal');
    const closeModal = document.querySelector('.close');
    const closeResponseModal = document.querySelector('#responseModal .close');
    const cancelResponseBtn = document.getElementById('cancelResponse');
    const responseForm = document.getElementById('responseForm');
    

    let peis = JSON.parse(localStorage.getItem('peis')) || [];
    

    userWelcome.textContent = `Bem-vindo, Professor ${currentUser.username}`;
    

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
    
    
    closeModal.addEventListener('click', function() {
        closeModalWindow();
    });

    if (closeResponseModal) {
        closeResponseModal.addEventListener('click', function() {
            closeModalWindow();
        });
    }

    cancelResponseBtn.addEventListener('click', function() {
        closeModalWindow();
    });

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
    responseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveResponse();
    });
    
    // Função para inicializar a página
    function initPage() {
        // Carregar e exibir PEIs
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
    
    // Função para carregar e exibir PEIs
    function loadPeis() {
        const pendingTableBody = document.getElementById('pending-table-body');
        const respondedTableBody = document.getElementById('responded-table-body');
        
        // Limpar tabelas
        pendingTableBody.innerHTML = '';
        respondedTableBody.innerHTML = '';
        
        // Filtrar PEIs atribuídos a este professor
        const professorPeis = peis.filter(pei => 
            pei.teacher === currentUser.username && pei.status !== 'deleted'
        );
        
        if (professorPeis.length === 0) {
            pendingTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI atribuído a você.</td></tr>';
            respondedTableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum PEI respondido.</td></tr>';
            return;
        }
        
        // Separar PEIs por status
        const pendingPeis = professorPeis.filter(pei => 
            pei.status === 'pending' || pei.status === 'in_progress'
        );
        
        const respondedPeis = professorPeis.filter(pei => 
            pei.status === 'completed' || pei.status === 'rejected'
        );
        
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
                    <td>${pei.specificNeed}</td>
                    <td><span class="status-badge status-${pei.status || 'pending'}">${getStatusText(pei.status)}</span></td>
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
                    <td>${pei.specificNeed}</td>
                    <td><span class="status-badge status-${pei.status}">${getStatusText(pei.status)}</span></td>
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
        const pei = peis.find(p => p.id == id);
        
        if (pei) {
            document.getElementById('modalTitle').textContent = `PEI - ${pei.subject}`;
            document.getElementById('detail-student').textContent = pei.studentName;
            document.getElementById('detail-course').textContent = pei.course;
            document.getElementById('detail-subject').textContent = pei.subject;
            document.getElementById('detail-yearSemester').textContent = pei.yearSemester;
            document.getElementById('detail-need').textContent = pei.specificNeed;
            document.getElementById('detail-ementa').textContent = pei.ementa || 'Não informado';
            document.getElementById('detail-generalObjective').textContent = pei.generalObjective || 'Não informado';
            document.getElementById('detail-specificObjectives').textContent = pei.specificObjectives || 'Não informado';
            document.getElementById('detail-contents').textContent = pei.contents || 'Não informado';
            document.getElementById('detail-methodology').textContent = pei.methodology || 'Não informado';
            document.getElementById('detail-evaluation').textContent = pei.evaluation || 'Não informado';
            document.getElementById('detail-opinion').textContent = pei.opinion || 'Não informado';
            
            // Mostrar resposta do professor se existir
            const responseSection = document.getElementById('response-section');
            const noResponseMessage = document.getElementById('no-response');
            const responseContent = document.getElementById('response-content');
            
            if (pei.professorResponse) {
                responseSection.style.display = 'block';
                noResponseMessage.style.display = 'none';
                responseContent.innerHTML = `
                    <div class="response-detail">
                        <strong>Data da Resposta:</strong> 
                        <span>${new Date(pei.responseDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="response-detail">
                        <strong>Status:</strong> 
                        <span class="status-badge status-${pei.status}">${getStatusText(pei.status)}</span>
                    </div>
                    <div class="response-detail">
                        <strong>Adaptações Propostas:</strong>
                        <p>${pei.professorResponse.adaptations || 'Não informado'}</p>
                    </div>
                    <div class="response-detail">
                        <strong>Metodologia Aplicada:</strong>
                        <p>${pei.professorResponse.methodology || 'Não informado'}</p>
                    </div>
                    <div class="response-detail">
                        <strong>Resultados Observados:</strong>
                        <p>${pei.professorResponse.results || 'Não informado'}</p>
                    </div>
                    <div class="response-detail">
                        <strong>Observações:</strong>
                        <p>${pei.professorResponse.observations || 'Nenhuma observação'}</p>
                    </div>
                `;
            } else {
                responseSection.style.display = 'none';
                noResponseMessage.style.display = 'block';
            }
            
            peiModal.style.display = 'block';
        }
    };
    
    // Função para responder ao PEI
    window.respondToPei = function(id) {
        const pei = peis.find(p => p.id == id);
        
        if (pei) {
            document.getElementById('responseModalTitle').textContent = `Responder PEI - ${pei.subject}`;
            document.getElementById('responsePeiId').value = pei.id;
            
            // Preencher informações básicas
            document.getElementById('response-student').textContent = pei.studentName;
            document.getElementById('response-course').textContent = pei.course;
            document.getElementById('response-subject').textContent = pei.subject;
            
            // Preencher formulário com dados existentes se houver
            if (pei.professorResponse) {
                document.getElementById('adaptations').value = pei.professorResponse.adaptations || '';
                document.getElementById('methodology').value = pei.professorResponse.methodology || '';
                document.getElementById('results').value = pei.professorResponse.results || '';
                document.getElementById('observations').value = pei.professorResponse.observations || '';
                document.getElementById('responseStatus').value = pei.status;
            } else {
                document.getElementById('adaptations').value = '';
                document.getElementById('methodology').value = '';
                document.getElementById('results').value = '';
                document.getElementById('observations').value = '';
                document.getElementById('responseStatus').value = 'in_progress';
            }
            
            // Mostrar modal de resposta
            document.getElementById('responseModal').style.display = 'block';
        }
    };
    
    // Função para salvar resposta
    function saveResponse() {
        const peiId = document.getElementById('responsePeiId').value;
        const adaptations = document.getElementById('adaptations').value;
        const methodology = document.getElementById('methodology').value;
        const results = document.getElementById('results').value;
        const observations = document.getElementById('observations').value;
        const status = document.getElementById('responseStatus').value;
        
        const index = peis.findIndex(p => p.id == peiId);
        if (index !== -1) {
            peis[index] = {
                ...peis[index],
                professorResponse: {
                    adaptations,
                    methodology,
                    results,
                    observations
                },
                status: status,
                responseDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Salvar no localStorage
            localStorage.setItem('peis', JSON.stringify(peis));
            
            // Fechar modal e recarregar dados
            document.getElementById('responseModal').style.display = 'none';
            loadPeis();
            
            // Mostrar mensagem de sucesso
            alert('Resposta salva com sucesso!');
        }
    }
    
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
        document.getElementById('responseModal').style.display = 'none';
    }
});