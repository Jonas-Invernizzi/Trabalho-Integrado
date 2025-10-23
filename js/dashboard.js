document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'napne') {
        window.location.href = 'index.html';
        return;
    }

    // Elementos DOM
    const userWelcome = document.getElementById('user-welcome');
    const totalStudents = document.getElementById('total-students');
    const totalPeis = document.getElementById('total-peis');
    const totalTeachers = document.getElementById('total-teachers');
    const totalCourses = document.getElementById('total-courses');
    const recentPeis = document.getElementById('recent-peis');

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        loadUserInfo();
        loadStats();
        loadRecentPeis();
    }

    function setupEventListeners() {
        // Logout
        document.getElementById('logout').addEventListener('click', logout);
        
        // Stats cards click events
        setupStatsClickEvents();
    }

    function setupStatsClickEvents() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                switch(index) {
                    case 0: // Estudantes
                        window.location.href = 'alunos.html';
                        break;
                    case 1: // PEIs
                        window.location.href = 'peis.html';
                        break;
                    case 2: // Professores
                        window.location.href = 'professores.html';
                        break;
                    case 3: // Cursos
                        window.location.href = 'cursos.html';
                        break;
                }
            });
            
            // Add cursor pointer
            card.style.cursor = 'pointer';
        });
    }

    function loadUserInfo() {
        if (userWelcome) {
            userWelcome.textContent = `Olá, ${currentUser.username}!`;
        }
    }

    function loadStats() {
        // Get data from localStorage
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        const peis = JSON.parse(localStorage.getItem('peis')) || [];

        // Update counters with animation
        animateCounter(totalStudents, students.length);
        animateCounter(totalTeachers, teachers.length);
        animateCounter(totalCourses, courses.length);
        animateCounter(totalPeis, peis.length);
    }

    function animateCounter(element, targetValue) {
        if (!element) return;
        
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    function loadRecentPeis() {
        if (!recentPeis) return;
        
        const peis = JSON.parse(localStorage.getItem('peis')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        
        // Sort by creation date (most recent first)
        const recentPeisList = peis
            .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
            .slice(0, 5);

        if (recentPeisList.length === 0) {
            recentPeis.innerHTML = '<p class="empty-message">Nenhum PEI cadastrado ainda.</p>';
            return;
        }

        recentPeis.innerHTML = '';
        
        recentPeisList.forEach(pei => {
            const student = students.find(s => s.id === pei.studentId);
            const studentName = student ? student.name : 'Estudante não encontrado';
            
            const peiItem = document.createElement('div');
            peiItem.className = 'recent-item';
            peiItem.innerHTML = `
                <div class="recent-item-info">
                    <div class="recent-item-title">${studentName}</div>
                    <div class="recent-item-subtitle">${pei.subject || 'Matéria não informada'}</div>
                    <div class="recent-item-date">${formatDate(pei.createdAt || Date.now())}</div>
                </div>
                <div class="status-badge ${getStatusClass(pei.status || 'active')}">${getStatusText(pei.status || 'active')}</div>
            `;
            
            // Add click event to view PEI details
            peiItem.addEventListener('click', () => {
                window.location.href = `peis.html?id=${pei.id}`;
            });
            
            recentPeis.appendChild(peiItem);
        });
    }

    function getStatusClass(status) {
        const statusMap = {
            'active': 'active',
            'pending': 'pending',
            'completed': 'completed',
            'draft': 'pending'
        };
        return statusMap[status] || 'active';
    }

    function getStatusText(status) {
        const statusMap = {
            'active': 'Ativo',
            'pending': 'Pendente',
            'completed': 'Concluído',
            'draft': 'Rascunho'
        };
        return statusMap[status] || 'Ativo';
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Hoje';
        } else if (diffDays === 2) {
            return 'Ontem';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} dias atrás`;
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // Auto-refresh stats every 30 seconds
    setInterval(() => {
        loadStats();
        loadRecentPeis();
    }, 30000);

    // Add some sample data if none exists
    initializeSampleData();

    function initializeSampleData() {
        // Add sample students if none exist
        if (!localStorage.getItem('students')) {
            const sampleStudents = [
                {
                    id: 1,
                    matricula: '2024001',
                    name: 'Pedro Henrique Silva',
                    cpf: '111.222.333-44',
                    birthDate: '2005-06-15',
                    courseId: 1,
                    courseName: 'Técnico em Informática',
                    courseLevel: 'Técnico',
                    entryDate: '2024-02-01',
                    needType: 'deficiencia',
                    specificNeed: 'Deficiência Visual - Baixa Visão',
                    hasMentoring: true,
                    psychopedagogical: false
                },
                {
                    id: 2,
                    matricula: '2024002',
                    name: 'Ana Clara Santos',
                    cpf: '222.333.444-55',
                    birthDate: '2004-09-20',
                    courseId: 2,
                    courseName: 'Técnico em Agropecuária',
                    courseLevel: 'Técnico',
                    entryDate: '2024-02-01',
                    needType: 'tea',
                    specificNeed: 'Transtorno do Espectro Autista - Nível 1',
                    hasMentoring: false,
                    psychopedagogical: true
                }
            ];
            localStorage.setItem('students', JSON.stringify(sampleStudents));
        }

        // Add sample teachers if none exist
        if (!localStorage.getItem('teachers')) {
            const sampleTeachers = [
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
            localStorage.setItem('teachers', JSON.stringify(sampleTeachers));
        }

        // Add sample courses if none exist
        if (!localStorage.getItem('courses')) {
            const sampleCourses = [
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
            localStorage.setItem('courses', JSON.stringify(sampleCourses));
        }

        // Add sample PEIs if none exist
        if (!localStorage.getItem('peis')) {
            const samplePeis = [
                {
                    id: 1,
                    studentId: 1,
                    subject: 'Matemática Aplicada',
                    teacherId: 1,
                    status: 'active',
                    createdAt: Date.now() - 86400000, // 1 day ago
                    type: 'adaptacao'
                },
                {
                    id: 2,
                    studentId: 2,
                    subject: 'Zootecnia Geral',
                    teacherId: 2,
                    status: 'pending',
                    createdAt: Date.now() - 172800000, // 2 days ago
                    type: 'geral'
                }
            ];
            localStorage.setItem('peis', JSON.stringify(samplePeis));
        }
    }
});
