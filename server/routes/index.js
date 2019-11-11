const express = require('express');

const app = express(); //se construlle en la variable app


app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;