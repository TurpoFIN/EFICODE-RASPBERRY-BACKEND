module.exports = {
    getRuuvi: (options, cb) => {
        console.log(options);
        return getRuuvi(options, cb)
    }
}


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const cFilter = require('../PRIVATE/MODULES/cFilter');
const dHandler = require('../PRIVATE/MODULES/dataHandler');
const db = require('../PRIVATE/MODULES/mysql-handler');
const fs = require('fs');
const { env } = require('process');

const app = express();
const cFilterSession = new cFilter.filterSession(10, 1000, 3);
const dir = __dirname.split('\\app')[0]

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

let a = [];

console.log(a instanceof Array);

require('dotenv').config();

console.log(env.MYSQL_HOST);

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../PUBLIC')));

app.listen(process.env.PORT ? process.env.PORT : 80);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../PRIVATE/WEBPAGES/index/index.html'));
});

app.post('/', (req, res) => {
    res.send({msg: 'test'})
});

app.post('/API/IO_DEVICES/DATA/UPDATE', (req, res) => {
    if (cFilterSession.checkConnection({ip: req.ip})) {
        console.log(req.body);
        console.log(req.body.dataPackage);
        if (req.body.dataPackage.clientKey) {
            getClientKey(req.body.dataPackage.clientKey, key => {
                console.log("??");
                if (!key.err) {
                    if (dHandler.updateData(req.body.dataPackage)) {

                        res.status(200);
                        res.send({err_c: 200, err: false, results: {}});
                    } else {
                        res.status(400);
                        res.send({err_c: 400, err: true, results: {}});
                    }

                } else {
                    res.status(405);
                    res.send({err_c: 400, err: true, results: {}});
                }
            })
        } else {
            res.status(400);
            res.send({err_c: 400, err: true});
        }
    } else {
        res.end();
    }
});

app.post('/API/IO_DEVICES/CONFIG/GET', (req, res) => {
    if (cFilterSession.checkConnection({ip: req.ip})) {
        console.log(req.body);
        if (req.body.dataPackage.clientKey) {
            getClientKey(req.body.dataPackage.clientKey, (obj => {
                if (obj.err) res.send({err_c: 404, err: true});
                else {
                    console.log(obj);
                    res.status(200);
                    res.send({err_c: 200, err: false, results: obj});
                }
            }));
        } else {
            res.status(400);
            res.send({err_c: 400, err: true});
        }
    } else {
        res.end();
    }
});

app.post('/API/GLOBAL_DATA/GET', (req, res) => {
    if (cFilterSession.checkConnection({ip: req.ip})) {
        let data = dHandler.getData({tagId: req.body.ruuviTag})
        res.status(data.err_c);
        res.send(data);
    } else {
        res.end();
    }
})

function getRuuvi(options, cb) {
    if (options.ruuviId !== undefined || options.secretKey !== undefined) {
        db.getTableContents((res => {
            console.log("res");
            console.log(res);
            if (!res.err.err) {
                const tags = res.results;
                let tag = undefined;
    
                tags.forEach(tag => {
                    if (tag.data.id === options.ruuviId || tag.data.options) tag = tag;
                });

                console.log(tag);
                if (tag) cb({err_c: 200, err: false, results: {ruuviTag: tag}});
                else cb({err_c: 404, err: true});
            } else {
                console.log("fucker");
                cb({err_c: 500, err: true});
            }
    
        }), {table: 'ruuviData', columns: [], conditions: []});
    } else {
        cb({err_c: 400, err: true});
    }
}

function getClientKey(key, cb) {
    if (key) {
        db.getTableContents(res => {
            console.log("key fucked up");
            if (res.err.err) cb({err_c: 500, err: true});
            else {
                let found = false;

                res.results.forEach(entry => {
                    if (entry.secretKey === key) {
                        cb({err_c: 200, err: false, results: {secretKey: entry.secretKey, simpleTag: JSON.parse(entry.data)}});
                        found = true;
                    }
                })
    
                if (!found) cb({err_c: 404, err: true});
                return;
            }
        }, {table: 'clientKeys', conditions: [], columns: []});
    } else {
        cb({err_c: 400, err: true});
    }
}

function addClientKey(ruuviobj, cb) {
    if (ruuviobj.options) {
        db.getTableContents((res) => {
            if (res.err.err)  cb({err_c: 400, err: true});
            else {
                let secretKey = undefined;

                while (true) {
                    let found = false;
                    secretKey = createToken(128);
    
                    res.results.forEach(result => {
                        if (result.secretKey === secretKey) found = true;
                    });
    
                    if (!found) break;
                }
    
                ruuviobj.options.secretKey = secretKey;

                db.tableAddRow((response) => {
                    console.log('Added a new clientKey!')
                    console.log(response);
                    
                    if (response.err.err)  {
                        console.log("idk");
                        cb({err_c: 500, err: true});
                    }
                    else  cb({err_c: 200, err: false, results: {secretKey, ruuviobj}}); 
                }, {table: 'clientKeys', data: [['secretKey', secretKey], ['data', JSON.stringify(ruuviobj.simpleObj())]]})
            }
        }, {table: 'clientKeys', columns: [], conditions: []});
    } else cb({err_c: 400, err: true});
}

function randomInt(min, max) {
    return Math.round(max-Math.random()*Math.abs(max-min));
}

function createToken(length) {
    var result = '';

    for (let i = 0; i < length; i++) {
        result += characters[randomInt(0, characters.length-1)];
    }

    return result;
}

class ruuviTag {
    constructor(options) {
        this.id = options.id;
        this.data = {};
        this.options = {
            id: options.id,
            tags: [],
            secretKey: options.secretKey,
            name: options.name, 
            config: {
                intervals: {
                    post: 1000
                }
            }
        }
    }

    simpleObj() {
        return {id: this.id, options: this.options};
    }
}

/*
        FOR TESTING

let test = new ruuviTag({id: 0, name: 'test'});

addClientKey(test, res => {
    console.log(res);
    if (!res.err) {
        getClientKey(res.results.secretKey, res => {
            console.log(res);
        });
    }
});

*/