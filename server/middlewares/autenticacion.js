const jwt = require('jsonwebtoken'); //Sirve para codificar y/o decodificar jwtokens

// ================================
//  Verificar Token
// ================================
/**
 * Este es un middleware de atenticacion de tokens que recibe un
 * token enviado por el cliente y verifica que este sea valido
 * comprobando que la SEED recibida sea igual a SEED guardada en el
 * restserver
 */
let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// ================================
//  Verificar AdmninRole
// ================================

let verificarAdmninRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'No esta autorizado para crear usuarios'
            }
        });
    }
    next();
};

module.exports = {
    verificarToken,
    verificarAdmninRole
}