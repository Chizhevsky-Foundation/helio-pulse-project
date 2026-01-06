document.addEventListener('DOMContentLoaded', () => {
    // --- Navegación por Secciones ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Datos del Motor de Predicciones ---
    async function loadGlobalConflicts() {
        try {
            const response = await fetch('data/global-conflicts.json');
            return await response.json();
        } catch (error) {
            console.error("Error cargando conflictos globales:", error);
            return [];
        }
    }

    // --- Simulación del Motor FTRT (en una versión real, esto se conectaría a una API) ---
    function updateFTRTEngine() {
        // Simular un próximo pico
        const nextPeakDate = new Date();
        nextPeakDate.setDate(nextPeakDate.getDate() + 45); // Pico en 45 días
        const ftrtValue = (Math.random() * 2 + 6).toFixed(2); // Valor entre 6 y 8

        document.getElementById('next-ftrt-peak').textContent = ftrtValue;
        
        // Actualizar nivel de alerta
        const alertLevel = document.getElementById('global-alert-level');
        const alertBarFill = document.querySelector('.alert-bar-fill');
        
        if (ftrtValue > 7.5) {
            alertLevel.textContent = 'CRÍTICO';
            alertLevel.style.color = 'var(--accent-secondary)';
            alertLevel.style.backgroundColor = 'rgba(240, 98, 146, 0.1)';
        } else if (ftrtValue > 5.0) {
            alertLevel.textContent = 'ELEVADO';
            alertLevel.style.color = 'var(--warning-color)';
            alertLevel.style.backgroundColor = 'rgba(255, 167, 38, 0.1)';
        } else {
            alertLevel.textContent = 'MODERADO';
            alertLevel.style.color = 'var(--success-color)';
            alertLevel.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        }
        
        alertBarFill.style.width = `${(ftrtValue / 10) * 100}%`;
    }

    // --- Monitor Cósmico en Tiempo Real (Simulado) ---
    async function updateCosmicMonitor() {
        // En un caso real, usaríamos APIs de NASA/NOAA
        const sunspots = Math.floor(Math.random() * 200 + 50);
        const kpIndex = (Math.random() * 9).toFixed(1);
        const solarFlux = Math.floor(Math.random() * 200 + 100);

        document.getElementById('realtime-sunspots').textContent = sunspots;
        document.getElementById('realtime-kp-index').textContent = kpIndex;
        document.getElementById('realtime-solar-flux').textContent = solarFlux;
    }

    // --- Gráfico de Predicciones FTRT ---
    function createFTRTPredictionChart() {
        const ctx = document.getElementById('ftrtPredictionChart').getContext('2d');
        
        // Generar datos de predicción para los próximos 6 meses
        const labels = [];
        const ftrtData = [];
        const alertThresholdData = [];

        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            labels.push(date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }));
            
            const value = Math.random() * 4 + 4; // Simular valores FTRT
            ftrtData.push(value);
            alertThresholdData.push(7.5); // Línea de umbral crítico
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Predicción FTRT',
                        data: ftrtData,
                        borderColor: '#64ffda',
                        backgroundColor: 'rgba(100, 255, 218, 0.2)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Umbral Crítico',
                        data: alertThresholdData,
                        borderColor: '#f06292',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Valor FTRT', color: '#a8b2d1' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#e0e6ed' } },
                    tooltip: { mode: 'index', intersect: false }
                }
            }
        });
    }

    // ... al final del archivo main.js

// --- Función para mostrar un resumen global de conflictos ---
async function showGlobalConflictSummary() {
    try {
        const response = await fetch('data/global-conflicts.json');
        const conflicts = await response.json();
        
        const totalConflicts = conflicts.length;
        const avgIntensity = (conflicts.reduce((sum, c) => sum + c.intensity, 0) / totalConflicts).toFixed(1);
        
        // Podrías actualizar un elemento en el HTML para mostrar esto
        console.log(`Resumen Global: ${totalConflicts} conflictos, con intensidad promedio de ${avgIntensity}`);
        
        // Opcional: Mostrar una notificación en el panel de alerta
        const alertMessage = document.getElementById('alert-message');
        if (alertMessage) {
            alertMessage.innerHTML = `
                <p>Estado: <span class="status-normal">MONITOREO GLOBAL</span></p>
                <p>Actualmente analizando ${totalConflicts} conflictos históricos y en curso.</p>
                <p>Intensidad promedio global: ${avgIntensity}/10</p>
            `;
        }
    } catch (error) {
        console.error("Error al cargar el resumen global:", error);
    }
}

    // Llamar a la nueva función al final de initDashboard()
    // ... dentro de la función initDashboard() al final
    showGlobalConflictSummary();

    // --- Inicialización ---
    updateFTRTEngine();
    updateCosmicMonitor();
    createFTRTPredictionChart();

    // Actualizar datos cada 30 segundos para simular tiempo real
    setInterval(() => {
        updateFTRTEngine();
        updateCosmicMonitor();
    }, 30000);
});
