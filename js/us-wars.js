document.addEventListener('DOMContentLoaded', async () => {
    let allEventData = [];
    let usWarsStats = {};

    async function loadData() {
        try {
            const response = await fetch('data/us-wars-data.json');
            allEventData = await response.json();
            renderTimeline(allEventData);
            createCorrelationChart(allEventData);
            calculateStatistics();
            updateStatsDisplay();
        } catch (error) {
            console.error("Error al cargar los datos de las guerras de EE.UU.:", error);
            document.getElementById('timeline-container').innerHTML = '<p>Error al cargar los datos.</p>';
        }
    }

    function createCorrelationChart(data) {
        const ctx = document.getElementById('correlationScatter').getContext('2d');
        const scatterData = data.map(d => ({
            x: d.solar_data.sunspot_number_avg,
            y: d.intensity,
            ftrt: d.solar_data.ftrt_value_avg
        }));

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Intervención de EE.UU.',
                    data: scatterData,
                    backgroundColor: scatterData.map(d => {
                        if (d.ftrt > 8.0) return 'rgba(240, 98, 146, 0.7)';
                        if (d.ftrt > 6.0) return 'rgba(255, 167, 38, 0.7)';
                        return 'rgba(100, 255, 218, 0.7)';
                    }),
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Número de Manchas Solares', color: '#a8b2d1' }, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a8b2d1' } },
                    y: { title: { display: true, text: 'Intensidad del Conflicto', color: '#a8b2d1' }, min: 0, max: 11, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a8b2d1' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return [
                                    `Manchas Solares: ${point.x}`,
                                    `Intensidad: ${point.y}`,
                                    `FTRT: ${point.ftrt.toFixed(2)}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    function renderTimeline(data) {
        const container = document.getElementById('timeline-container');
        container.innerHTML = '';
        data.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `timeline-event ${event.type.replace(/\s+/g, '-').toLowerCase()}`;
            eventEl.dataset.type = event.type;

            eventEl.innerHTML = `
                <div class="event-date">${event.startDate}</div>
                <div class="event-title">${event.name}</div>
                <div class="event-type">${event.type}</div>
                <div class="event-intensity">Intensidad: ${event.intensity}/10</div>
                <div class="event-solar">Manchas Solares: ${event.solar_data.sunspot_number_avg} | FTRT: ${event.solar_data.ftrt_value_avg}</div>
                <div class="event-description">${event.description}</div>
            `;
            container.appendChild(eventEl);
        });
    }

    function calculateStatistics() {
        usWarsStats.highestIntensityConflict = allEventData.reduce((max, event) => event.intensity > max.intensity ? event : max, { name: '', intensity: 0 });
        usWarsStats.avgFtrtInWorldWars = allEventData
            .filter(e => e.type === "Guerra Mundial")
            .reduce((sum, e, _, { length }) => sum + e.solar_data.ftrt_value_avg / length, 0);
        usWarsStats.avgCorrelation = allEventData.reduce((sum, e, _, { length }) => sum + e.solar_data.correlation_strength / length, 0);
    }

    function updateStatsDisplay() {
        document.getElementById('highest-intensity-conflict').textContent = usWarsStats.highestIntensityConflict.name;
        document.getElementById('avg-ftrt-world-wars').textContent = usWarsStats.avgFtrtInWorldWars.toFixed(2);
        document.getElementById('avg-correlation').textContent = usWarsStats.avgCorrelation.toFixed(2);
    }

    const conflictTypeFilter = document.getElementById('conflictTypeFilter');
    conflictTypeFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const filteredData = filterValue === 'all' ? allEventData : allEventData.filter(event => event.type === filterValue);
        renderTimeline(filteredData);
    });

    loadData();
});
