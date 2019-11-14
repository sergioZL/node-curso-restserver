const express = require('express');


let { verificarToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// ===========================================
//      Obtener productos
// ===========================================
app.get('/productos', (req, res) => {
    // trae todos los productos 
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto,
            })
        });

});

// ===========================================
//      Obtener un producto por id
// ===========================================
app.get('/productos/:id', (req, res) => {
    // trae todos los productos 
    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto,
            });

        });

});

// ===========================================
//      Buscar producto
// ===========================================

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })


});

// ===========================================
//      Ingresa un nuevo producto
// ===========================================
app.post('/productos', verificarToken, (req, res) => {
    // Grabar el usuario 
    // grabar una categoria del listado

    let idUsr = req.usuario._id;

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: idUsr
    });

    producto.save((err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: ProductoDB
        });
    });
});

// ===========================================
//      Actualizar un producto
// ===========================================
app.put('/productos/:id', verificarToken, (req, res) => {
    // Grabar el usuario 
    // grabar una categoria del listado
    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: ' query ' }, (err, ProductoUP) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoUP) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: ProductoUP
        });
    });
});

// ===========================================
//      Borra un producto
// ===========================================
app.delete('/productos/:id', (req, res) => {
    // Cambia el estado disponible del producto 

    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true, runValidators: true, context: ' query ' }, (err, ProductoUP) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: `el producto ${ProductoUP.nombre} ya no esta disponible`
        });
    });

});

module.exports = app;