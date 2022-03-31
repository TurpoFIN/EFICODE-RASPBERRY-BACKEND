let ruuviData = {
  time: [],
  temperature: [],
  humidity: [],
  pressure: [],
  acceleration: []
}

let ruuviTags = [];

let currentTag = 'f6e84a97cdea';

// FROM MOZZILLA
// Example POST method implementation: 
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


function updateData() {
  postData('http://localhost/API/GLOBAL_DATA/GET', { ruuviTag: currentTag })
  .then(data => {
      console.log(ruuviData);
      if (!data.err) {
          let time = [];
          let temperatureArr = [];
          let humidityArr = [];
          let pressureArr = [];
          let accelerationArr = [];

          for (const [key, year] of Object.entries(data.results.dataObj)) { // Year
              for (const [key, month] of Object.entries(year)) { // Month
                  for (const [key, day] of Object.entries(month)) { // Day
                      for (const [key, hour] of Object.entries(day)) { // Hour
                          hour.forEach(arr => {
                            let date = new Date(arr.date);
                            time.push(`${date.getYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                            temperatureArr.push(arr.data.temperature);
                            humidityArr.push(arr.data.humidity);
                            pressureArr.push(Math.ceil(arr.data.pressure/1000)/100);
                          })
                      }
                  }
              }
          }

          if (time.length > 0) {
            ruuviData.time = time;
            ruuviData.temperature = temperatureArr;
            ruuviData.humidity = humidityArr;
            ruuviData.pressure = pressureArr;
            ruuviData.acceleration = accelerationArr;

            console.log(accelerationArr);

            temperature.setValue(Math.round(temperatureArr[temperatureArr.length-1]));
            humidity.setValue(Math.round(humidityArr[humidityArr.length-1]));
            pressure.setValue(pressureArr[pressureArr.length-1]);
            acceleration.setValue('-');

            updateGraph();
          }

      }
  }).catch(err => {
      console.log(err);
  });    

  postData('http://localhost/API/GLOBAL_DATA/GET/TAGS', {}).then(data => {
    if (data) {
      console.log('data');
      console.log(data.results);
      ruuviTags = data.results.tags;

      updateDropDown();
    } 
  }).catch(err => { console.log(err); } );
}

setInterval(() => {
  updateData();
}, 1000 * 30);

updateData();
