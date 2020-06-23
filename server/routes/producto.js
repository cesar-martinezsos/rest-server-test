const express = require('express');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion')
const Producto = require('../models/producto')
const _ = require('underscore')

/* -------------------------------------------------------------------------- */
/*                         Obtener todos los productos                        */
/* -------------------------------------------------------------------------- */
app.get('/productos', verificaToken, (req, res) => {
    //Trae todos los productos
    //populate usuario y categoria
    //paginado
    let desde = Number(req.query.desde);
    let limit = 5;

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limit)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    total
                });
            });
        });
});

/* -------------------------------------------------------------------------- */
/*                             Obtener un producto                            */
/* -------------------------------------------------------------------------- */
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate usuario y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
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
                producto
            });
        });
});

/* -------------------------------------------------------------------------- */
/*                              Buscar productos                              */
/* -------------------------------------------------------------------------- */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

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
            });
        });

})

/* -------------------------------------------------------------------------- */
/*                              Crea un producto                              */
/* -------------------------------------------------------------------------- */
app.post('/productos', verificaToken, (req, res) => {
    //Grabar usuario
    //Grabar el producto

    let body = req.body;

    let productoDB = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    productoDB.save((err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

/* -------------------------------------------------------------------------- */
/*                           Actualizar un producto                           */
/* -------------------------------------------------------------------------- */
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let datos = _.pick(body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible']);


    let options = {
        new: true,
        runValidators: true
    }

    Producto.findByIdAndUpdate(id, datos, options, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

/* -------------------------------------------------------------------------- */
/*                              Borra un producto                             */
/* -------------------------------------------------------------------------- */
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        producto.disponible = false;
        producto.save((err, prodBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: prodBorrado
            });
        });
    });
});

module.exports = app;