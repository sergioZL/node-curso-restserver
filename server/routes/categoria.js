const express = require('express');


let { verificarToken, verificarAdmninRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ===========================================
//      Mostrar todas las categorias
// ===========================================
app.get('/categoria', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias,
                //conteo
            })
        });
});


// ===========================================
//      Mostrar una categoria por id
// ===========================================
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById({ _id: id })
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }

            res.json({
                ok: true,
                categoria,
            })

        });

});

// ===========================================
//      Crear nueva categoria
// ===========================================
app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    let idUsr = req.usuario._id;

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUsr
    });

    categoria.save((err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: CategoriaDB
        });
    });
});

// ===========================================
//      Actualiza el nombre de la categoria
// ===========================================
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let desCategoria = {
        descripcion: req.body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true, context: ' query ' }, (err, CategoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: CategoriaDB
        });
    });
});

// ===========================================
//      Borrar una categoria
// ===========================================
app.delete('/categoria/:id', [verificarToken, verificarAdmninRole], (req, res) => {
    // solo un administrador puede  borrar categorias
    // categoira.findByidAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, CategoriaRM) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaRM) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });
});

module.exports = app;