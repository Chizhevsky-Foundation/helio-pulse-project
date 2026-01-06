// js/ftrt-lab.js - LÓGICA DEL LABORATORIO FTRT
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 Laboratorio FTRT - Inicializando...');
    
    // Variables del simulador
    let currentFTRT = 0;
    let ftRTData = [];
    let chartInstances = {};
    
    // --- NAVEGACIÓN ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                
                localStorage.setItem('ftrtActiveSection', targetId);
            }
        });
    });
    
    const savedSection = localStorage.getItem('ftrtActiveSection') || 'simulator';
    const savedLink = document.querySelector(`[href="#${savedSection}"]`);
    if (savedLink) savedLink.click();
    
    // --- SIMULADOR FTRT ---
    
    // Configurar fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-selector').value = today;
    document.getElementById('result-date').textContent = formatDate(today);
    
    // Calcular FTRT
    document.getElementById('calculate-btn').addEventListener('click', calculateFTRT);
    
    // Botones de timeline
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const days = parseInt(this.dataset.days);
            generateTimeline(days);
            
            // Actualizar botón activo
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Calcular FTRT automáticamente al cargar
    calculateFTRT();
    
    // --- FUNCIONES PRINCIPALES ---
    
    function calculateFTRT() {
        console.log('🧮 Calculando FTRT...');
        
        const dateInput = document.getElementById('date-selector').value;
        const selectedPlanets = Array.from(document.querySelectorAll('input[name="planet"]:checked'))
            .map(cb => cb.value);
        
        // Actualizar fecha de resultado
        document.getElementById('result-date').textContent = formatDate(dateInput);
        
        // Simulación de cálculo (será reemplazado con cálculo real)
        const mockResult = {
            value: (2 + Math.random() * 3).toFixed(2),
            mainContributor: 'Júpiter (42%)',
            interpretation: getInterpretation(2 + Math.random() * 3),
            components: [
                {planet: 'Júpiter', contribution: 42, color: '#e74c3c'},
                {planet: 'Saturno', contribution: 28, color: '#3498db'},
                {planet: 'Venus', contribution: 12, color: '#f1c40f'},
                {planet: 'Tierra', contribution: 8, color: '#2ecc71'},
                {planet: 'Marte', contribution: 5, color: '#e67e22'},
                {planet: 'Otros', contribution: 5, color: '#95a5a6'}
            ]
        };
        
        // Actualizar UI
        updateFTRTResult(mockResult);
        
        // Guardar para timeline
        currentFTRT = parseFloat(mockResult.value);
        ftRTData.push({
            date: dateInput,
            value: currentFTRT,
            components: mockResult.components
        });
        
        // Generar timeline inicial
        if (ftRTData.length === 1) {
            generateTimeline(7);
        }
    }
    
    function updateFTRTResult(result) {
        document.getElementById('ftrt-result-value').textContent = result.value;
        document.getElementById('main-contributor').textContent = result.mainContributor;
        document.getElementById('ftrt-interpretation').textContent = result.interpretation;
        
        // Actualizar gráfico de componentes
        updateComponentsChart(result.components);
    }
    
    function updateComponentsChart(components) {
        const ctx = document.getElementById('components-chart');
        if (!ctx) return;
        
        // Destruir gráfico anterior si existe
        if (chartInstances.components) {
            chartInstances.components.destroy();
        }
        
        chartInstances.components = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: components.map(c => c.planet),
                datasets: [{
                    data: components.map(c => c.contribution),
                    backgroundColor: components.map(c => c.color),
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function generateTimeline(days) {
        console.log(`📊 Generando timeline de ${days} días...`);
        
        // Generar datos de ejemplo (serán reemplazados con datos reales)
        const dates = [];
        const values = [];
        
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            dates.push(date.toLocaleDateString('es-ES', { 
                month: 'short', 
                day: 'numeric' 
            }));
            
            // Valor FTRT simulado con tendencia
            const base = 2.5;
            const trend = Math.sin(i * 0.3) * 0.8;
            const noise = Math.random() * 0.5 - 0.25;
            values.push(base + trend + noise);
        }
        
        // Crear o actualizar gráfico
        const ctx = document.getElementById('ftrt-timeline-chart');
        if (!ctx) return;
        
        if (chartInstances.timeline) {
            chartInstances.timeline.destroy();
        }
        
        chartInstances.timeline = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'FTRT',
                    data: values,
                    borderColor: '#3182ce',
                    backgroundColor: 'rgba(49, 130, 206, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#3182ce'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `FTRT: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.05)'
                        },
                        title: {
                            display: true,
                            text: 'Valor FTRT'
                        }
                    }
                }
            }
        });
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    function getInterpretation(ftrtValue) {
        if (ftrtValue >= 4.5) return 'Alto riesgo de actividad solar extrema';
        if (ftrtValue >= 3.5) return 'Riesgo elevado de tormentas solares';
        if (ftrtValue >= 2.5) return 'Actividad solar moderada esperada';
        if (ftrtValue >= 1.5) return 'Actividad solar baja a moderada';
        return 'Condiciones solares tranquilas';
    }
    
    // Inicializar gráfico de correlación en la sección de validación
    function initializeCorrelationChart() {
        const ctx = document.getElementById('correlation-chart');
        if (!ctx) return;
        
        // Datos de ejemplo de correlación
        const correlationData = [];
        for (let i = 0; i < 50; i++) {
            const ftRT = 1 + Math.random() * 4;
            const activity = ftRT * 0.8 + Math.random() * 0.5;
            correlationData.push({x: ftRT, y: activity});
        }
        
        chartInstances.correlation = new Chart(ctx.getContext('2d'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Eventos solares',
                    data: correlationData,
                    backgroundColor: 'rgba(49, 130, 206, 0.6)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `FTRT: ${context.parsed.x.toFixed(2)}, Actividad: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'FTRT'
                        },
                        min: 1,
                        max: 5
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Índice de Actividad Solar'
                        },
                        min: 1,
                        max: 5
                    }
                }
            }
        });
    }
    
    // Inicializar todo cuando se carga la sección de validación
    const validationSection = document.getElementById('validation');
    if (validationSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !chartInstances.correlation) {
                    initializeCorrelationChart();
                }
            });
        });
        
        observer.observe(validationSection);
    }
    
    console.log('✅ Laboratorio FTRT inicializado');
});
