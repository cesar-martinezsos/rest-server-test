const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const app = express();

// default options
app.use(fileUpload({
    useTempFiles: true
}));


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposPermitidos = ['usuarios', 'productos'];

    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposPermitidos.join(', ')
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo.'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    console.log(extension);

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ')
            }
        });
    }

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ archivo.name }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        Usuario.findById(id, (err, usuarioDb) => {

            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            if (!usuarioDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }

            usuarioDb.img = archivo.name;
            usuarioDb.save((err, usuarioActualizado) => {
                res.json({
                    ok: true,
                    message: 'Imagen subida con éxito!'
                });
            });
        });
    });
});

module.exports = app;