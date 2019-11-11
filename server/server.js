/**
 * Requires 
 * se llaman las librerias que se necesitan para la aplicación
 */
require('./config/config');

const express = require('express'); //Sirve para recibir y contestar peticiones http
/**
 * Mongoose es una biblioteca de JavaScript que contiene muchas funciones diferentes
 * que le permiten validar, guardar, eliminar y consultar sus datos utilizando las 
 * funciones comunes de MongoDB. 
 */
const mongoose = require('mongoose');

const app = express(); //se construlle en la variable app
const bodyParser = require('body-parser'); //sirve para recibir los parametros que han sido enviados en la peticion

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// En archivo rutes/usuario se definen las peticiones al servidor 
app.use(require('./routes/index'));

// mongo db connection
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, resp) => {
    if (err) console.log(process.env.URLDB);;

    console.log('Base de datos ONELINE');

});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
})