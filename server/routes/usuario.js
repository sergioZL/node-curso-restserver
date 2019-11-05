const express = require('express'); //Sirve para recibir y contestar peticiones http
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');


const app = express(); //se construlle en la variable app


/**
 * Las sigientes son peticiones al servidor que funcionan de la siguiente manera
 * en el request son los tados recibidos a la hora de hacer la peticion y el response
 * es lo que se envia como respuesta al cliente que realizo la peticion
 */
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;

    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })


        })

});

app.post('/usuario', function(req, res) {

    /**
     * el req.body son los parametros convertidos a un json 
     * por medio del body parser
     */
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, UsuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        // UsuarioDB.password = null;

        res.json({
            ok: true,
            usuario: UsuarioDB
        });

    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: ' query ' }, (err, UsuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: UsuarioDB
        });

    });

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;