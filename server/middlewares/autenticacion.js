const jwt = require('jsonwebtoken');


// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, data) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido.'
                }
            })
        };

        req.usuario = data.usuario;
        next();
    })

};
// =====================
// Verificar Rol de Admin
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let role = req.usuario.role;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador.'
            }
        });
    }

    next();

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}