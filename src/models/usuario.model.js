import mongoose from './mongoConection'
import {Schema, model} from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SCRECT = process.env.TOKEN_SECRET

const usuarioSchema = new Schema({
    email: String,
    senha: String
})

const Usuario = model('Usuario', usuarioSchema)

const getAll = async () => {
    return Usuario.find({}, { senha: 0 }) // Exclui o campo 'senha'
}

//novo usuário
const newUser = async ({ email, senha }) => {
    return Usuario.create({ email, senha })
}

//Atenção: para usarmos o id como parametro devemos importar o Object id pois devemos referenciar nossa busca


const userExists = async ({ email, id }) => {
    if (id) {
        return Usuario.findById(id)
    } else {
        return Usuario.findOne({ email })
    }
}

const deleta = async ({ id }) => {
    return Usuario.findByIdAndDelete(id)
}

const update = async ({ id, email, senha }) => {
    return Usuario.findByIdAndUpdate(id, { email, senha })
}

const login = async ({ email, senha }) => {
    return Usuario.findOne({ email, senha })
}

const requestLogin = async (req, res) => {
    const { email, senha } = req.body
    const usuario = await login({ email, senha })

    if (!usuario) return res.status(401).json({ message: 'Usuário não encontrado' })

    const token = jwt.sign(
        {
            userId: usuario._id,
            email,
        },
        SCRECT,
        {
            expiresIn: 1440,
        },
    );
    return res.status(201).json({ token })
}

export { getAll, newUser, userExists, deleta, update, requestLogin }

