document.addEventListener('DOMContentLoaded', async () => {
    let allConflictData = [];

    async function loadData() {
        try {
            const response = await fetch('data/global-conflicts.json');
            allConflictData = await response.json();
            createGlobalTimeline(allConflictData);
            createWorldMap(allConflictData);
            updateGlobalStats();
        } catch (error) {
            console.error("Error al cargar los datos de conflictos globales:", error);
            document.getElementById('globalTimelineChart').innerHTML = '<p>Error al cargar los datos.</p>';
        }
    }

    function createGlobalTimeline(data) {
        const ctx = document.getElementById('globalTimelineChart').getContext('2d');
        
        const timelineData = data.map(d => ({
            x: new Date(d.startDate),
            y: d.intensity,
            name: d.name
        }));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timelineData.map(d => d.x),
                datasets: [{
                    label: 'Intensidad del Conflicto',
                    data: timelineData.map(d => d.y),
                    borderColor: '#f06292',
                    backgroundColor: 'rgba(240, 98, 146, 0.2)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'year',
                            displayFormats: {
                                year: 'yyyy'
                            }
                        },
                        title: { display: true, text: 'Fecha', color: '#a8b2d1' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    },
                    y: {
                        title: { display: true, text: 'Intensidad', color: '#a8b2d1' },
                        min: 0,
                        max: 11,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#a8b2d1' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].dataset.label;
                            },
                            label: function(context) {
                                const dataPoint = allConflictData[context.dataIndex];
                                return [
                                    `Conflicto: ${dataPoint.name}`,
                                    `Intensidad: ${dataPoint.intensity}`,
                                    `FTRT: ${dataPoint.solar_data.ftrt_value_avg}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    function createWorldMap(data) {
        const mapContainer = document.getElementById('world-map-container');
        mapContainer.innerHTML = '';

        data.forEach(conflict => {
            const hotspotEl = document.createElement('div');
            hotspotEl.className = 'world-hotspot';
            hotspotEl.style.left = `${Math.random() * 80 + 10}%`;
            hotspotEl.style.top = `${Math.random() * 80 + 10}%`;
            
            const intensityColor = conflict.intensity > 8 ? 'high' : conflict.intensity > 5 ? 'medium' : 'low';
            hotspotEl.classList.add(`intensity-${intensityColor}`);
            
            hotspotEl.innerHTML = `
                <div class="hotspot-tooltip">
                    <h4>${conflict.name}</h4>
                    <p>${conflict.startDate} - ${conflict.endDate || 'Presente'}</p>
                    <p>Intensidad: ${conflict.intensity}/10</p>
                    <p>FTRT: ${conflict.solar_data.ftrt_value_avg}</p>
                </div>
            `;
            mapContainer.appendChild(hotspotEl);
        });
    }

    function updateGlobalStats() {
        const totalConflicts = allConflictData.length;
        const avgIntensity = (allConflictData.reduce((sum, c) => sum + c.intensity, 0) / totalConflicts).toFixed(1);
        const avgFTRT = (allConflictData.reduce((sum, c) => sum + c.solar_data.ftrt_value_avg, 0) / totalConflicts).toFixed(2);

        console.log(`Total de Conflictos: ${totalConflicts}`);
        console.log(`Intensidad Promedio: ${avgIntensity}`);
        console.log(`FTRT Promedio: ${avgFTRT}`);
    }

    const conflictTypeFilterMap = document.getElementById('conflictTypeFilterMap');
    const intensityFilterMap = document.getElementById('intensityFilterMap');

    function filterMap() {
        const typeFilter = conflictTypeFilterMap.value;
        const intensityFilter = intensityFilterMap.value;

        let filteredData = allConflictData;

        if (typeFilter !== 'all') {
            filteredData = filteredData.filter(c => c.type === typeFilter);
        }
        if (intensityFilter !== 'all') {
            filteredData = filteredData.filter(c => c.intensity === parseInt(intensityFilter));
        }

        createGlobalTimeline(filteredData);
        createWorldMap(filteredData);
    }

    conflictTypeFilterMap.addEventListener('change', filterMap);
    intensityFilterMap.addEventListener('change', filterMap);

    loadData();
});
