const express = require('express');
const cFilter = require('../PRIVATE/MODULES/cFilter');
const dHandler = require('../PRIVATE/MODULES/dataHandler');
const db = require('../PRIVATE/MODULES/mysql-handler');
const fs = require('fs');
const { env } = require('process');

const app = express();
const cFilterSession = new cFilter.filterSession(10, 1000, 3);
const dir = __dirname.split('\\app')[0]

require('dotenv').config();

console.log(env.MYSQL_HOST);

app.listen(process.env.PORT ? process.env.PORT : 80);

app.get('/', (req, res) => {
    res.send({msg: 'test'});
});

app.post('/', (req, res) => {
    res.send({msg: 'test'})
});

app.post('/API/IO_DEVICES/DATA/UPDATE', (req, res) => {
    if (cFilterSession.checkConnection({ip: req.ip})) {
        if (req.body.clientKey) {
            getRuuvi({clientKey: ''}, (results) => {
            });
        }
    } else {
        res.end();
    }
});

app.post('/API/IO_DEVICES/CONFIG/GET', (req, res) => {
    if (cFilterSession.checkConnection({ip: req.ip})) {
        if (req.body.clientKey) {
            
        }
    } else {
        res.end();
    }
});

function getRuuvi(options, cb) {
    db.getTableContents((res => {
        if (!res.err) {
            const tags = res.results;

            tags.forEach(tag => {
                if (options.clientKey) {
                    tags.forEach(tag => {
                        console.log(tag);
                    });
                } else if (options.tagId) {
            
                }
            });
        }

        console.log(res);
    }))
}