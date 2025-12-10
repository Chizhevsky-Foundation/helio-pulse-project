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

document.addEventListener('DOMContentLoaded', () => {
    // --- Funciones para obtener datos (las que ya tenías) ---
    async function loadConflictData() { /* ... código anterior ... */ }
    async function fetchSolarData() { /* ... código anterior ... */ }

    // NUEVA: Función para cargar datos FTRT
    async function loadFtrtData() {
        try {
            const response = await fetch('src/data/ftrt_data.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al cargar los datos FTRT:", error);
            return [];
        }
    }

    // --- Funciones para crear los gráficos ---
    function createSolarChart(ctx, data) { /* ... código anterior ... */ }
    function createConflictChart(ctx, conflictData) { /* ... código anterior ... */ }

    // NUEVA: Función para crear el gráfico FTRT
    function createFtrtChart(ctx, ftrtData) {
        // Define los colores según el nivel de alerta
        const getColor = (level) => {
            switch (level) {
                case 'EXTREMO': return 'rgba(128, 0, 128, 0.6)'; // Púrpura
                case 'CRITICO': return 'rgba(255, 0, 0, 0.6)'; // Rojo
                case 'ELEVADO': return 'rgba(255, 165, 0, 0.6)'; // Naranja
                default: return 'rgba(100, 255, 218, 0.6)'; // Verde
            }
        };

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ftrtData.map(d => d.date),
                datasets: [{
                    label: 'Índice FTRT',
                    data: ftrtData.map(d => d.ftrt),
                    borderColor: '#f06292',
                    backgroundColor: 'rgba(240, 98, 146, 0.2)',
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: ftrtData.map(d => getColor(d.level)),
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
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
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const item = ftrtData[context.dataIndex];
                                return `Evento: ${item.event}\nNivel: ${item.level}`;
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
        const ftrtCtx = document.getElementById('ftrtChart').getContext('2d'); // Nuevo contexto

        // Obtener todos los datos de forma concurrente
        const [solarData, conflictData, ftrtData] = await Promise.all([
            fetchSolarData(),
            loadConflictData(),
            loadFtrtData() // Nueva llamada
        ]);

        // Crear todos los gráficos
        createSolarChart(solarCtx, solarData);
        createConflictChart(conflictCtx, conflictData);
        createFtrtChart(ftrtCtx, ftrtData); // Nuevo gráfico
    }

    // Llamar a la función principal
    initDashboard();
});
