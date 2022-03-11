const express = require('express');
const app = express();

app.listen(process.env.PORT);

app.get('/', (req, res) => {
    res.send({msg: 'test'});
});

app.post('/', (req, res) => {
    res.send({msg: 'test'})
})