const express = require('express'); //Sirve para recibir y contestar peticiones http
const bcrypt = require('bcrypt'); // genera hashes de encriptacion para contraseas
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); // el modelo usuario es un mapa echo con mongose que sirve para trabajar con mongoDB

const app = express(); //se construlle en la variable app


app.post('/login', (req, res) => {


    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });
    });
});


module.exports = app;