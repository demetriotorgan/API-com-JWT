import conn from './mongoConection'
import {Schema, model} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const TOKEN_SECRET = process.env.TOKEN_SECRET

const usuarioSchema = new Schema({
    email: String,
    senha: String
})

const Usuario = model('Usuario', usuarioSchema)

const getAll = async () => {
    return await Usuario.find({}, { senha: 0 }) // Exclui o campo 'senha' do resultado
}

//bcrypt senha
const encryptSenha = async (senha) => {
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(senha, salt)
}

//novo usuário
const newUser = async ({ email, senha }) => {
    const senhaHash = await encryptSenha(senha)
    return Usuario.create({ email, senha: senhaHash })
}

const findUserByEmail = async (email) => {
    return await Usuario.findOne({ email })
}
/*
const findUserById = async (id) => {
    return await Usuario.findById(id);
}
*/
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
    const senhaHash = await encryptSenha(senha)
    return Usuario.findByIdAndUpdate(id, { email, senhaHash })    
}

const login = async ({ email, senha }) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const isPasswordValid = bcrypt.compare(senha, user.senha);
        if (isPasswordValid) {
            return user;
        } else {
            throw new Error('Usuário ou senha incorretos');
        }
    } catch (error) {
        throw error;
    }
}

const requestLogin = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await login({ email, senha });
        const token = jwt.sign(
            {
                userId: usuario._id,
                email,
            },
            TOKEN_SECRET,
            {
                expiresIn: 1440,
            }
        );
        res.status(201).json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export { getAll, newUser, userExists, deleta, update, requestLogin }