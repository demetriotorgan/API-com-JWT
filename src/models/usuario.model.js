import connection from "./mongoConection"
import { ObjectId } from "mongodb"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SCRECT = process.env.TOKEN_SECRET


const getAll = async() =>{
    const db = await connection()
    return db.collection('usuarios').find().toArray()
}

//novo usuário
const newUser = async({email,senha}) => {
    const db = await connection()
    const user = await db.collection('usuarios').insertOne({email, senha})
    const {insertedId: id} = user
    return {email, _id:id}
}

//Atenção: para usarmos o id como parametro devemos importar o Object id pois devemos referenciar nossa busca


const userExists = async({email,id})=>{
    const db = await connection()
    let user = null

    var novoID = new ObjectId(id)
    
    
        if(id){
            user = await db.collection('usuarios').findOne({_id:novoID})
            console.log('usuario encontrado: '+ id)
        } else {
            user = await db.collection('usuarios').findOne({email})
        }
        console.log(user)
    return user
}

const deleta = async({id}) =>{
    const db = await connection()
    var novoID = new ObjectId(id)
    await db.collection('usuarios').deleteOne({_id:novoID})
    console.log('Deletado: ' + id)
    return {id}
}

const update = async({id,email, senha}) =>{
    const db = await connection()
    var newId = new ObjectId(id)
    await db.collection('usuarios').updateOne({_id: newId}, {$set:{email, senha}})
    return {id, email}
}

const login = async({email, senha}) => {
    const db = await connection()
    const user = await db.collection('usuarios').findOne({email, senha})
    return user
}

const requestLogin = async(req,res)=>{
    const {email, senha} = req.body
    const usuario = await login({email, senha})

    if (!usuario) return res.status(401).json({message: 'Usuario não encontrado'})

    const {_id} = usuario;
    //console.log(_id)

    const newToken = jwt.sign(
        {
            userId: _id,
            email,
        },        
            SCRECT,        
        {
            expiresIn: 1440,
        },
    )
        return res.status(201).json({token: newToken})
}

export {getAll, newUser, userExists, deleta, update, requestLogin}

