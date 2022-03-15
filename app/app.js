const express = require('express');
const cFilter = require('../PRIVATE/MODULES/cFilter');
const fs = require('fs');

const app = express();
const dir = __dirname.split('\\app')[0]

require('dotenv').config();

app.listen(process.env.PORT ? process.env.PORT : 80);

app.get('/', (req, res) => {
    res.send({msg: 'test'});
});

app.post('/', (req, res) => {
    res.send({msg: 'test'})
});

app.post('/API/IO_DEVICES/DATA/UPDATE', (req, res) => {
    if (req.body.clientKey) {

    }
});

app.post('/API/IO_DEVICES/CONFIG/GET', (req, res) => {
    
})