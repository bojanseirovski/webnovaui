try {
    const ctx4 = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: chartLables,
            datasets: chartSingleDataset
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

var chartMulti = null;
var ctx5 = null;
try {
    ctx5 = document.getElementById('chartmulti').getContext('2d');
    switchChart(0);
    
    $("#locations").change(function() {
        switchChart(parseInt($(this).val()));
    });
} catch (e) { }


try{
    var ctxSat = document.getElementById("mapW").getContext("2d");
    ctxSat.canvas.width  = 593;
    ctxSat.canvas.height = 296;
} catch(e){ }

function switchChart(locId) {
    try{
        chartMulti.destroy();
    } catch(e){}
    var freshDataset = charmultiDefaultDataset;
    var srcImg = "Multispectral-Wetlands-Health.jpg";
    var lat = 43.6532;
    var lon = -79.3832;
    switch (locId) {
        case 1:
            freshDataset = charmultiDataset1;
            srcImg = "toronto.jpg";
            lat = 43.6532;
            lon = -79.3832;
            break;
        case 2:
            freshDataset = charmultiDataset2;
            srcImg = "newyork1.jpg";
            lat = 40.7128;
            lon = -74.0060;
            break;
        case 3:
            freshDataset = charmultiDataset3;
            srcImg = "paris.jpg";
            lat = 48.8566;
            lon = 2.3522;
            break;
        case 4:
            srcImg = "berlin.jpg";
            freshDataset = charmultiDataset4;
            lat = 52.5200;
            lon = 13.4050;
            break;
        case 0:
        default:
            srcImg = "Multispectral-Wetlands-Health.jpg";
            freshDataset = charmultiDefaultDataset;
            lat = 43.6532;
            lon = -79.3832;
            break;
    }
    $("#satView img").attr("src", "assets/img/"+srcImg);
    chartMulti = new Chart(ctx5, {
        type: 'line',
        data: {
            labels: chartLables,
            datasets: freshDataset
        },
        options: chartMultiOptions
    });
    addMapPin(lat, lon);
}

function addMapPin(lat, lon) {
    var mapConst = 1.647;
    var	x = lon*mapConst + 180*mapConst;
    var y = lat*mapConst - 2*mapConst;
    var ctx = document.getElementById("mapW").getContext("2d");
    ctx.clearRect(0, 0, 593, 296);

    var img = new Image();
    img.onload = function () {
        ctx.drawImage(this, x - 10, y - 10, 20, 20);
    };
    img.src = "assets/img/satellite-icon.png";
}