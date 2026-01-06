// js/main.js - LÓGICA PRINCIPAL CON APIs REALES
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 HelioPulse Project - Inicializando...');
    
    // Variables globales
    let solarData = null;
    let ftRTData = null;
    let updateInterval = null;
    
    // --- NAVEGACIÓN ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Actualizar navegación
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Mostrar sección
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            // Guardar en localStorage
            localStorage.setItem('activeSection', targetId);
        });
    });
    
    // Restaurar sección activa
    const savedSection = localStorage.getItem('activeSection') || 'solar';
    const savedLink = document.querySelector(`[href="#${savedSection}"]`);
    if (savedLink) {
        savedLink.click();
    }
    
    // --- FUNCIONES DE ACTUALIZACIÓN ---
    
    // Actualizar timestamp global
    function updateGlobalTimestamp() {
        const now = new Date();
        const timestampElement = document.getElementById('last-update');
        if (timestampElement) {
            timestampElement.textContent = now.toUTCString().split(' ')[4];
        }
    }
    
    // Cargar datos solares de NOAA
    async function loadSolarData() {
        console.log('📡 Cargando datos solares de NOAA...');
        
        try {
            // NOTA: En producción, usaríamos APIs reales de NOAA
            // Por ahora, mostramos marcadores de posición
            
            // Simulación de datos (TEMPORAL - será reemplazado con APIs reales)
            const mockData = {
                sunspots: Math.floor(Math.random() * 150) + 50,
                kpIndex: (Math.random() * 8).toFixed(1),
                solarFlux: Math.floor(Math.random() * 200) + 100,
                timestamp: new Date().toISOString()
            };
            
            // Actualizar UI
            updateSolarUI(mockData);
            
            // Guardar en cache
            HelioPulseUtils.setCache('solarData', mockData);
            
            return mockData;
            
        } catch (error) {
            console.error('Error cargando datos solares:', error);
            
            // Intentar cargar desde cache
            const cached = HelioPulseUtils.getCache('solarData');
            if (cached) {
                updateSolarUI(cached);
                return cached;
            }
            
            // Mostrar error
            document.querySelectorAll('.data-value').forEach(el => {
                if (el.textContent === 'Cargando...') {
                    el.textContent = 'Error';
                    el.style.color = HelioPulseUtils.getKpColor(7);
                }
            });
            
            return null;
        }
    }
    
    // Actualizar UI con datos solares
    function updateSolarUI(data) {
        if (!data) return;
        
        // Manchas solares
        const sunspotsEl = document.getElementById('sunspots');
        const sunspotsTimeEl = document.getElementById('sunspots-time');
        
        if (sunspotsEl) {
            sunspotsEl.textContent = data.sunspots;
            sunspotsEl.style.color = '#1a365d';
        }
        
        if (sunspotsTimeEl) {
            const date = new Date(data.timestamp);
            sunspotsTimeEl.textContent = date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Índice Kp
        const kpEl = document.getElementById('kp-index');
        if (kpEl) {
            kpEl.textContent = data.kpIndex;
            kpEl.style.color = HelioPulseUtils.getKpColor(data.kpIndex);
        }
        
        // Flujo solar
        const fluxEl = document.getElementById('solar-flux');
        if (fluxEl) {
            fluxEl.textContent = data.solarFlux;
            fluxEl.style.color = '#1a365d';
        }
        
        // Actualizar gráfico histórico
        updateSolarHistoryChart(data);
    }
    
    // Actualizar gráfico histórico
    function updateSolarHistoryChart(data) {
        const ctx = document.getElementById('solarHistoryChart');
        if (!ctx) return;
        
        // Datos de ejemplo (serán reemplazados con datos reales de API)
        const hours = 24;
        const labels = [];
        const kpData = [];
        
        const now = new Date();
        for (let i = hours - 1; i >= 0; i--) {
            const hour = new Date(now);
            hour.setHours(now.getHours() - i);
            labels.push(hour.getHours() + ':00');
            
            // Datos simulados (serán reemplazados)
            kpData.push(Math.random() * 8);
        }
        
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Índice Kp',
                    data: kpData,
                    borderColor: HelioPulseUtils.getKpColor(5),
                    backgroundColor: 'rgba(214, 158, 46, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hora (UTC)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 9,
                        title: {
                            display: true,
                            text: 'Índice Kp'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 7) return 'Fuerte';
                                if (value >= 5) return 'Menor';
                                if (value >= 4) return 'Inestable';
                                return 'Tranquilo';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Cargar datos FTRT
    async function loadFTRTData() {
        console.log('🧮 Calculando FTRT...');
        
        try {
            // NOTA: Esto será reemplazado con cálculos reales basados en datos JPL
            // Por ahora, mostramos marcadores de posición
            
            const mockFTRT = {
                value: (Math.random() * 5 + 2).toFixed(2),
                date: new Date().toLocaleDateString('es-ES'),
                time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}),
                trend: Math.random() > 0.5 ? '↑ Ascendente' : '↓ Descendente',
                planetaryData: [
                    {planet: 'Júpiter', distance: '5.20', force: '0.42', contribution: '35%'},
                    {planet: 'Saturno', distance: '9.58', force: '0.15', contribution: '25%'},
                    {planet: 'Urano', distance: '19.22', force: '0.05', contribution: '15%'},
                    {planet: 'Neptuno', distance: '30.05', force: '0.02', contribution: '10%'},
                    {planet: 'Venus', distance: '0.72', force: '0.08', contribution: '8%'},
                    {planet: 'Marte', distance: '1.52', force: '0.03', contribution: '5%'},
                    {planet: 'Mercurio', distance: '0.39', force: '0.01', contribution: '2%'}
                ]
            };
            
            // Actualizar UI
            updateFTRTUI(mockFTRT);
            
            // Guardar en cache
            HelioPulseUtils.setCache('ftrtData', mockFTRT);
            
            return mockFTRT;
            
        } catch (error) {
            console.error('Error calculando FTRT:', error);
            
            // Intentar cargar desde cache
            const cached = HelioPulseUtils.getCache('ftrtData');
            if (cached) {
                updateFTRTUI(cached);
                return cached;
            }
            
            return null;
        }
    }
    
    // Actualizar UI FTRT
    function updateFTRTUI(data) {
        if (!data) return;
        
        // Valor FTRT actual
        const ftrtEl = document.getElementById('current-ftrt');
        const dateEl = document.getElementById('ftrt-date');
        const timeEl = document.getElementById('ftrt-time');
        const trendEl = document.getElementById('ftrt-trend');
        
        if (ftrtEl) ftrtEl.textContent = data.value;
        if (dateEl) dateEl.textContent = data.date;
        if (timeEl) timeEl.textContent = data.time;
        if (trendEl) {
            trendEl.textContent = data.trend;
            trendEl.style.color = data.trend.includes('↑') ? '#38a169' : '#c53030';
        }
        
        // Tabla de datos planetarios
        const tableBody = document.getElementById('planetary-data-body');
        if (tableBody && data.planetaryData) {
            tableBody.innerHTML = '';
            data.planetaryData.forEach(planet => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${planet.planet}</strong></td>
                    <td>${planet.distance} UA</td>
                    <td>${planet.force}</td>
                    <td>${planet.contribution}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // Gráfico de tendencia
        updateFTRTTrendChart(data);
    }
    
    // Actualizar gráfico de tendencia FTRT
    function updateFTRTTrendChart(data) {
        const ctx = document.getElementById('ftrtTrendChart');
        if (!ctx) return;
        
        // Datos de ejemplo (serán reemplazados)
        const days = 7;
        const labels = [];
        const ftrtData = [];
        
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(now.getDate() - i);
            labels.push(day.getDate() + '/' + (day.getMonth() + 1));
            
            // Datos simulados (serán reemplazados)
            ftrtData.push(2 + Math.random() * 3);
        }
        
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'FTRT',
                    data: ftrtData,
                    borderColor: '#3182ce',
                    backgroundColor: 'rgba(49, 130, 206, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Día'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor FTRT'
                        }
                    }
                }
            }
        });
    }
    
    // --- INICIALIZACIÓN COMPLETA ---
    async function initializeApp() {
        console.log('🚀 Inicializando HelioPulse Project...');
        
        // Actualizar timestamp
        updateGlobalTimestamp();
        
        // Cargar datos iniciales
        solarData = await loadSolarData();
        ftRTData = await loadFTRTData();
        
        // Configurar actualizaciones periódicas
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(async () => {
            console.log('🔄 Actualizando datos...');
            updateGlobalTimestamp();
            solarData = await loadSolarData();
            ftRTData = await loadFTRTData();
        }, 300000); // Actualizar cada 5 minutos
        
        // Manejar conexión/desconexión
        window.addEventListener('online', () => {
            console.log('📶 Conexión restablecida - Recargando datos...');
            loadSolarData();
            loadFTRTData();
        });
        
        window.addEventListener('offline', () => {
            console.log('⚠️ Sin conexión - Usando datos en caché');
        });
        
        console.log('✅ HelioPulse Project inicializado correctamente');
    }
    
    // Iniciar la aplicación
    initializeApp();
});
