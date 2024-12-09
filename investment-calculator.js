const profiles = {
    cautious: {
        irr: 0.15,
    },
    balanced: {
        irr: 0.20,
    },
    dynamic: {
        irr: 0.30,
    }
};

let growthChart, performanceChart;

function initializeCharts() {
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');

    growthChart = new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Investment Value',
                data: [],
                borderColor: '#000000',
                backgroundColor: '#000000',
                pointBackgroundColor: '#000000',
                pointBorderColor: '#000000',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        boxWidth: 50,
                        usePointStyle: true,
                        pointStyle: 'line',
                        color: '#000000'
                    }
                },
                title: {
                    display: true,
                    text: 'Investment Growth Over Time',
                    color: '#666',
                    font: {
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '€' + value.toLocaleString()
                    },
                    grid: {
                        color: '#E6E2D7'
                    }
                },
                x: {
                    grid: {
                        color: '#E6E2D7'
                    }
                }
            }
        }
    });

    performanceChart = new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: ['Traditional Portfolio', 'Alfa Next Portfolio'],
            datasets: [{
                data: [8, 25],
                backgroundColor: ['#EDE1C5', '#EDE1C5'],
                barThickness: 40,
                borderRadius: 20
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30,
                    ticks: {
                        callback: value => value + '%'
                    },
                    grid: {
                        color: '#E6E2D7'
                    }
                },
                x: {
                    grid: {
                        color: '#E6E2D7'
                    }
                }
            }
        }
    });
}

function updateCharts(profile) {
    const amount = parseFloat(document.getElementById('amount').value);
    const horizon = parseInt(document.getElementById('horizon').value);
    const irr = profiles[profile].irr;

    // Generate growth projection data
    const years = Array.from({length: horizon + 1}, (_, i) => i);
    const values = years.map(year => amount * Math.pow(1 + irr, year));

    // Update growth chart
    growthChart.data.labels = years;
    growthChart.data.datasets[0].data = values;
    growthChart.update();

    // Update performance chart
    performanceChart.data.datasets[0].data = [8, irr * 100];
    performanceChart.update();
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();

    // Add event listeners
    document.querySelectorAll('.profile-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.profile-button').forEach(btn => 
                btn.classList.remove('active'));
            button.classList.add('active');
            updateCharts(button.dataset.profile);
        });
    });

    document.getElementById('amount').addEventListener('input', () => 
        updateCharts(document.querySelector('.profile-button.active').dataset.profile));
    document.getElementById('horizon').addEventListener('input', () => 
        updateCharts(document.querySelector('.profile-button.active').dataset.profile));

    // Initial calculation
    updateCharts('balanced');
});
