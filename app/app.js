const express = require('express');
const app = express();

const fs = require('fs');


app.listen(process.env.PORT);

app.get('/', (req, res) => {
    res.send({msg: 'test'});
});

app.post('/', (req, res) => {
    res.send({msg: 'test'})
});

app.post('/API/UPDATE', (req, res) => {
    res.status(200).send({msg: 'test'});
});