document.addEventListener('DOMContentLoaded', async () => {
    let allEventData = [];

    // --- Carga y Procesamiento de Datos ---
    async function loadData() {
        try {
            const response = await fetch('data/israel_gaza_data.json');
            allEventData = await response.json();
            // Los datos ya vienen ordenados por fecha del JSON
            renderTimeline(allEventData);
            createCorrelationChart(allEventData);
        } catch (error) {
            console.error("Error al cargar los datos del conflicto:", error);
            document.getElementById('timeline-container').innerHTML = '<p>Error al cargar los datos.</p>';
        }
    }

    // --- Gráfico de Correlación ---
    function createCorrelationChart(data) {
        const ctx = document.getElementById('correlationScatter').getContext('2d');
        
        const scatterData = data.map(d => ({
            x: d.sunspot_number,
            y: d.intensity,
            ftrt: d.ftrt_value
        }));

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Evento Histórico',
                    data: scatterData,
                    backgroundColor: scatterData.map(d => {
                        if (d.ftrt > 7.0) return 'rgba(240, 98, 146, 0.7)'; // Rojo para FTRT alto
                        if (d.ftrt > 4.0) return 'rgba(255, 167, 38, 0.7)'; // Naranja para FTRT medio
                        return 'rgba(100, 255, 218, 0.7)'; // Verde para FTRT bajo
                    }),
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Número de Manchas Solares',
                            color: '#a8b2d1'
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Intensidad del Conflicto',
                            color: '#a8b2d1'
                        },
                        min: 0,
                        max: 11,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    }
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

    // --- Línea de Tiempo ---
    function renderTimeline(data) {
        const container = document.getElementById('timeline-container');
        container.innerHTML = ''; // Limpiar contenedor

        data.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `timeline-event ${event.type.replace(/\s+/g, '-').toLowerCase()}`;
            eventEl.dataset.type = event.type;

            eventEl.innerHTML = `
                <div class="event-date">${event.date}</div>
                <div class="event-title">${event.event}</div>
                <div class="event-type">${event.type}</div>
                <div class="event-intensity">Intensidad: ${event.intensity}/10</div>
                <div class="event-solar">Manchas Solares: ${event.sunspot_number} | FTRT: ${event.ftrt_value}</div>
                <div class="event-description">${event.description}</div>
            `;
            container.appendChild(eventEl);
        });
    }

    // --- Filtro de Eventos ---
    const typeFilter = document.getElementById('typeFilter');
    typeFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const filteredData = filterValue === 'all' 
            ? allEventData 
            : allEventData.filter(event => event.type === filterValue);
        renderTimeline(filteredData);
    });

    // --- Inicialización ---
    loadData();
});
