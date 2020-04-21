const express = require('express'); // sirve para responder a peticiones http 

const app = express(); //se construlle en la variable app

// ===============================================================
//  se cargan las configuraciones de express contenidas en los
//  archivos a los que se les esta haciendo require
// ===============================================================

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;