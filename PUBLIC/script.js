const settings = document.querySelector('.settings');
const settingsLink = document.querySelector('.setnLink');

settingsLink.addEventListener('click', () => {
    settings.classList.toggle('_visible');
});

const labels = [1,2, 3, 4, 5, 6, 7, 8, 9];

const data = {
    labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [1, 2, 3, 4, 5, 6, 8, 7, 9],
      tension: 0.2,
    }]
};
    
const defaultCfg = {
    type: 'line',
    data: data,
    options: {
        aspectRatio: 1.5,
    }
};
  
const myChart = new Chart(
    document.getElementById('myChart'),
    defaultCfg
);

function updateGraph() {
    console.log(temperature.background.style.background);
    
    let config = {
        type: 'line',
        data: {
            labels: ruuviData.time,
            datasets: [{
                label: 'Temperature',
                backgroundColor: temperature.background.style.background,
                borderColor: temperature.background.style.background,
                data: ruuviData.temperature,
                tension: 0.2,
            }, {
                label: 'Humidity',
                backgroundColor: humidity.background.style.background,
                borderColor: humidity.background.style.background,
                data: ruuviData.humidity,
                tension: 0.2,
            }, {
                label: 'Pressure',
                backgroundColor: pressure.background.style.background,
                borderColor: pressure.background.style.background,
                data: ruuviData.pressure,
                tension: 0.2,
            }]

            /*  
                , {
                label: 'Acceleration',
                backgroundColor: 'rgb(255, 99, 132)', 
                borderColor: 'rgb(255, 99, 132)',
                data: ruuviData.acceleration,
                tension: 0.2,
            }
            */
        },
        options: {
            aspectRatio: 1.5,
            animation: {
                duration: 0
            }
        }
    }

    let legendItem = myChart.legend.legendItems;
    console.log(myChart);
    console.log(legendItem);
    myChart.config._config = config;
    myChart.update();
    if (legendItem.length > 1) {
        console.log('hullu');
        myChart.legend.legendItems = legendItem
        myChart.update();
    }
}
