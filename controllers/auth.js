const bcrypt = require("bcryptjs")
const Usuario = require("../models/Usuario")
const { generarJWT } = require("../helpers/jwt")

const createUser = async(req, res) => {
    const {email, password} = req.body

    try {
        let usuario = await Usuario.findOne({ email }) 
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con ese correo ya existe'
            })
        }

        usuario = new Usuario(req.body)

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10)
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save()

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUser = async(req, res) => {
    const {email, password} = req.body

    try {
        const usuario = await Usuario.findOne({ email }) 
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con esos credenciales no existe'
            })
        }

        // Confirmar los password
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const revalidateToken = async(req, res) => {
    const {uid, name} = req

    // Generar un nuevo JWT y retornarlo en esta petición
    const token = await generarJWT(uid, name)
    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}