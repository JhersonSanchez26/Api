//Creación de autenticador de usuario
const express = require('express');
const bcrypt = require('bcrypt');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const UserModel = require('./User.model')

//1-.Creamos Medlewear de verificación y encriptación

const validateJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] });

//2-.Creamos función para firmar token
//Creamos un token usando el id del usuario registrado en mongoodb con el metodo jwt.sign ();

const singToken = _id => jwt.sign({ _id }, process.env.SECRET);

//3-.// función Middleware en caso de que no se autorice el token del usuario.

const findAndAssignUser = async(req, res, next) => {

    try {

        const user = await UserModel.findById(req.user._id);
        if (!user) {

            return res.status(401).end();
        }
        req.user = user;
        next();
    } catch (e) {

        next(e)
    }
}

//4-.Creamos Middleware que servira para proteger los endpoint. Con express.Router().use() podemos unir dos Middleware en uno ejem:
const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser);

//5-.Creación de Controlador

const Auth = {
    //6.-Creación de endpoint Login
    login: async(req, res) => {
        const { body } = req;
        try {

            const user = await UserModel.findOne({ email: body.email });
            if (!user) {
                res.status(401).send('Usuario y o contraseña invalida')
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password);
                if (isMatch) {
                    const signed = singToken(user._id)
                    res.status(200).send(signed)
                } else {
                    res.status(401).send('Usuario y o contraseña invalida')
                }
            }
        } catch (e) {
            res.send(e.message)
        }
    },
    //7.- Creación de endpoint de registro
    register: async(req, res) => {

        const { body } = req;
        try {

            const isUser = await UserModel.findOne({ email: body.email });
            if (isUser) {
                res.send('Usuario ya existe');
            } else {
                const salt = await bcrypt.genSalt();
                const hashed = await bcrypt.hash(body.password, salt);
                const user = await UserModel.create({ email: body.email, password: hashed, salt });
                const signed = singToken(user._id);
                res.send(signed);
            }
        } catch (error) {
            res.status(500).send(error.menssage)
        }
    }
}

//8.-Exportamos los endpoint

module.exports = { Auth, isAuthenticated }