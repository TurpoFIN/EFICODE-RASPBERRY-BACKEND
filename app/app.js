const express = require('express');
const app = express();

app.listen(430);

app.get('/', (req, res) => {
    res.send({msg: 'allah'});
});