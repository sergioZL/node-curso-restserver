/**
 * Requires 
 * se llaman las librerias que se necesitan para la aplicación
 */
require('./config/config');

const express = require('express'); //Sirve para recibir y contestar peticiones http
const app = express(); //se construlle en la variable app
const bodyParser = require('body-parser'); //sirve para recibir los parametros que han sido enviados en la peticion

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
/**
 * Las sigientes son peticiones al servidor que funcionan de la siguiente manera
 * en el request son los tados recibidos a la hora de hacer la peticion y el response
 * es lo que se envia como respuesta al cliente que realizo la peticion
 */
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

app.post('/usuario', function(req, res) {

    /**
     * el req.body son los parametros convertidos a un json 
     * por medio del body parser
     */
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }

    res.json({
        persona: body
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delte Usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
})