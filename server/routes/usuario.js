// ==================================================================================
//  En este modulo se configuran las rutas de las peticiones al RESTServer
// ================================================================================== 
const express = require('express'); //Sirve para recibir y contestar peticiones http
const bcrypt = require('bcrypt'); // genera hashes de encriptacion para contraseas
const _ = require('underscore'); // sirbe para trabajar con los datos contenidos en los objetos
const Usuario = require('../models/usuario'); // el modelo usuario es un mapa echo con mongose que sirve para trabajar con mongoDB
const { verificarToken, verificarAdmninRole } = require('../middlewares/autenticacion');

const app = express(); //se construlle en la variable app


/**
 * ===================================================================================
 * Las sigientes son peticiones al servidor que funcionan de la siguiente manera
 * en el request son los tados recibidos a la hora de hacer la peticion y el response
 * es lo que se envia como respuesta al cliente que realizo la peticion
 * ====================================================================================
 */

// Debuelve una lista de usuarios apartir de el indice indicado el el argumento desde 
// hasta el limite indicado en el argumento limite 
app.get('/usuario', verificarToken, (req, res) => {


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

// Almacena un nuevo usuario en la base de datos 
app.post('/usuario', [verificarToken, verificarAdmninRole], (req, res) => {

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

// Actualiza el usuario cuyo id corresponda al id dado en la url
app.put('/usuario/:id', [verificarToken, verificarAdmninRole], function(req, res) {

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
// Cambia el estado del usuario proporcionado por el id de activo a inactivo
app.delete('/usuario/:id', [verificarToken, verificarAdmninRole], function(req, res) {

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