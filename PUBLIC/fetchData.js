let ruuviData = {
    x: [],
    y: []
}

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
    postData('http://localhost/API/GLOBAL_DATA/GET', { ruuviTag: `e60b6442f801` })
    .then(data => {
        console.log(ruuviData); // JSON data parsed by `data.json()` call
        if (!data.err) {
            let x = [];
            let y = [];
            for (const [key, year] of Object.entries(data.results.dataObj)) { // Year
                for (const [key, month] of Object.entries(year)) { // Month
                    for (const [key, day] of Object.entries(month)) { // Day
                        for (const [key, hour] of Object.entries(day)) { // Hour
                            hour.forEach(arr => {
                                x.push(arr.date);
                                y.push(arr.data.temperature);
                            })
                        }
                    }
                }
            }

            ruuviData.x = x;
            ruuviData.y = y;

            console.log(ruuviData);
            addData(myChart, ruuviData.x, ruuviData.y);
        }
    }).catch(err => {
        console.log(err);
    });    
}

setInterval(() => {
    updateData();
}, 1000 * 60);

updateData();
