const settings = document.querySelector('.settings');
const settingsLink = document.querySelector('.setnLink');

settingsLink.addEventListener('click', () => {
    settings.classList.toggle('_visible');
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}


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
    
    const config = {
    type: 'line',
    data: data,
    options: {
        aspectRatio: 1.5,
    }
};
  
const myChart = new Chart(
    document.getElementById('myChart'),
    config
);
