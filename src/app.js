document.addEventListener('DOMContentLoaded', () => {
    // --- Funciones para obtener datos ---

    // Función para cargar datos de conflictos locales (simulacro)
    async function loadConflictData() {
        try {
            const response = await fetch('src/data/conflict_data.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al cargar los datos de conflictos:", error);
            return [];
        }
    }

    // Función para obtener datos de manchas solares de NOAA
    async function fetchSolarData() {
        try {
            // Usamos un endpoint de NOAA que proporciona datos de manchas solares mensuales
            const response = await fetch('https://services.swpc.noaa.gov/json/solar-cycle/observed-sunspots.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener los datos solares:", error);
            // Retornamos datos de ejemplo si la API falla
            return [{ "time-tag": "2023-01", "sunspot-number": 120 }, { "time-tag": "2023-02", "sunspot-number": 135 }];
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
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#e0e6ed' } }
                }
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
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: { display: true, text: 'Intensidad', color: '#a8b2d1' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const event = conflictData[context.dataIndex].event;
                                return `Evento: ${event}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Función Principal para inicializar el dashboard ---
    async function initDashboard() {
        const solarCtx = document.getElementById('solarChart').getContext('2d');
        const conflictCtx = document.getElementById('conflictChart').getContext('2d');

        // Obtener los datos de forma concurrente
        const [solarData, conflictData] = await Promise.all([
            fetchSolarData(),
            loadConflictData()
        ]);

        // Crear los gráficos con los datos obtenidos
        createSolarChart(solarCtx, solarData);
        createConflictChart(conflictCtx, conflictData);
    }

    // Llamar a la función principal para que todo comience
    initDashboard();
});
