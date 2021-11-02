var chartLables = ['1', '2', '3', '4', '5', '6'];

var chartSingleDataset = [{
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
    }];


var chartMultiOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};
var charmultiDefaultDataset = [
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
];

var charmultiDataset1 = [
    {
        label: 'R',
        data: [4, 1, 1, 2, 1, 0],
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
        data: [4, 2, 1, 1, 1, 0],
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
        data: [3, 1, 1, 1, 2, 0],
        backgroundColor: [
            'rgba(0, 0, 255, 0.2)'
        ],
        borderColor: [
            'rgba(0, 0, 255, 1)'
        ],
        borderWidth: 1
    }
];
var charmultiDataset2 = [
    {
        label: 'R',
        data: [1, 1, 4, 1, 1, 1],
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
        data: [1, 3, 1, 1, 1, 0],
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
        data: [1, 1, 1, 1, 3, 1],
        backgroundColor: [
            'rgba(0, 0, 255, 0.2)'
        ],
        borderColor: [
            'rgba(0, 0, 255, 1)'
        ],
        borderWidth: 1
    }
];
var charmultiDataset3 = [
    {
        label: 'R',
        data: [2, 1, 1, 2, 1, 2],
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
        data: [1, 2, 1, 1, 1, 2],
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
        data: [1, 1, 1, 1, 2, 0],
        backgroundColor: [
            'rgba(0, 0, 255, 0.2)'
        ],
        borderColor: [
            'rgba(0, 0, 255, 1)'
        ],
        borderWidth: 1
    }
];
var charmultiDataset4 = [
    {
        label: 'R',
        data: [5, 1, 1, 2, 1, 3],
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
        data: [4, 2, 1, 1, 1, 0],
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
        data: [2, 1, 1, 1, 2, 2],
        backgroundColor: [
            'rgba(0, 0, 255, 0.2)'
        ],
        borderColor: [
            'rgba(0, 0, 255, 1)'
        ],
        borderWidth: 1
    }
];