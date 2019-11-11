/**
 * ======================================================================================
 *  En este archivo sirve para definir el esquema que guardara datos en la base 
 *  de datos de mongoDB
 * ======================================================================================
 */
// Mongoose es una biblioteca de JavaScript que le permite definir esquemas con datos
// fuertemente tipados. Una vez que se define un esquema, Mongoose le permite crear un
// Modelo basado en un esquema específico. Un modelo de mangosta se asigna a un documento
// MongoDB a través de la definición del esquema del modelo.
const mongoose = require('mongoose');
// mongoose-unique-validator sirve para validar los campos indicados, puede validar si un 
// dato correspondiente a un campo ya a sido registrado antes en la base de datos o tambien 
// validar campos de una manera personalizada.
const uniqueValidator = require('mongoose-unique-validator');

// Se define el esquema del modelo que se almacenara en la base de datos
let Schema = mongoose.Schema;

// Los roles validos sirven para validar que los roles recibidos correspondan a estos
let rolesValidos = {
        values: ['USER_ROLE', 'ADMIN_ROLE'],
        message: '{VALUE} no es un rol válido'
    }
    // este es el esquema uasuari que nos permite trabajar con la base de datos 
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password; // de esta manera se evita devolver la contraseña al momento de devolver datos

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' }); // de esta manera se configura el mensaje para indicar que no se pudo validar algun dato

module.exports = mongoose.model('Usuario', usuarioSchema); //al final se exporta el modulo