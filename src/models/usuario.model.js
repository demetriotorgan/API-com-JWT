import conn from './mongoConection'
import {Schema, model} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

const SCRECT = process.env.TOKEN_SECRET

const usuarioSchema = new Schema({
    email: String,
    senha: String
})

const Usuario = model('Usuario', usuarioSchema)

const getAll = async () => {
    return Usuario.find({}, { senha: 0 }) // Exclui o campo 'senha' do resultado
}

//bcrypt senha
const encryptSenha = async (senha) => {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);
    return senhaHash
}

//novo usuário
const newUser = async ({ email, senha }) => {
    
    const senhaHash = encryptSenha(senha)

    return Usuario.create({ email, senhaHash })
}


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
    
    const senhaHash = encryptSenha(senha)

    return Usuario.findByIdAndUpdate(id, { email, senhaHash })
}

const login = async ({ email, senha }) => {
    
    const senhaHash = encryptSenha(senha)
    const user = await Usuario.findOne({ email })
    const checkedPassword = bcrypt.compare(senhaHash, user.senha);
    
    if(checkedPassword){
        return user
    }else{
        throw new Error('Uuário ou senha incorreto')
    }
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

