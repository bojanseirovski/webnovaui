try {
    const ctx4 = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                    label: '# of objects detected',
                    data: [0, 1, 1, 2, 1, 0],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} catch (e) {
}

try {
    const ctx5 = document.getElementById('chartmulti').getContext('2d');
    const myChart2 = new Chart(ctx5, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [
                {
                    label: 'R',
                    data: [0, 1, 1, 2, 1, 0],
                    backgroundColor: [
                        'rgba(255, 0, 0, 0.3)'
                    ],
                    borderColor: [
                        'rgba(255, 0, 0, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    label: 'G',
                    data: [0, 2, 1, 1, 1, 0],
                    backgroundColor: [
                        'rgba(0, 255, 0, 0.3)'
                    ],
                    borderColor: [
                        'rgba(0, 255, 0, 1)'
                    ],
                    borderWidth: 1
                },
                                {
                    label: 'B',
                    data: [0, 1, 1, 1, 2, 0],
                    backgroundColor: [
                        'rgba(0, 0, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(0, 0, 255, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} catch (e) {
}