document.addEventListener('DOMContentLoaded', () => {
    // --- Funciones para obtener datos ---
    async function loadLocalData(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al cargar los datos desde ${path}:`, error);
            return null;
        }
    }

    async function fetchSolarData() {
        try {
            const response = await fetch('https://services.swpc.noaa.gov/json/solar-cycle/observed-sunspots.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener los datos solares de NOAA:", error);
            // Retornamos datos de ejemplo si la API falla
            return Array.from({length: 24}, (_, i) => ({
                "time-tag": `2023-${String(i + 1).padStart(2, '0')}`,
                "sunspot-number": Math.floor(Math.random() * 150) + 50
            }));
        }
    }

    // --- Funciones para crear los gráficos ---
    function createSolarChart(ctx, data) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d['time-tag']),
                datasets: [{
                    label: 'Número de Manchas Solares',
                    data: data.map(d => d['sunspot-number']),
                    borderColor: '#64ffda',
                    backgroundColor: 'rgba(100, 255, 218, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a8b2d1' } },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a8b2d1' } }
                },
                plugins: { legend: { labels: { color: '#e0e6ed' } } }
            }
        });
    }

    function createConflictChart(ctx, conflictData) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: conflictData.map(d => d.year),
                datasets: [{
                    label: 'Intensidad del Conflicto',
                    data: conflictData.map(d => d.intensity),
                    backgroundColor: 'rgba(240, 98, 146, 0.6)',
                    borderColor: '#f06292',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 10, title: { display: true, text: 'Intensidad', color: '#a8b2d1' }, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a8b2d1' } },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a8b2d1' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { afterLabel: (context) => `Evento: ${conflictData[context.dataIndex].event}` } }
                }
            }
        });
    }

    // --- Función Principal para inicializar el dashboard ---
    async function initDashboard() {
        const solarCtx = document.getElementById('solarChart').getContext('2d');
        const conflictCtx = document.getElementById('conflictChart').getContext('2d');

        const [solarData, conflictData] = await Promise.all([
            fetchSolarData(),
            loadLocalData('data/conflict_data.json')
        ]);

        if (solarData) createSolarChart(solarCtx, solarData);
        if (conflictData) createConflictChart(conflictCtx, conflictData);
    }

    initDashboard();
});
