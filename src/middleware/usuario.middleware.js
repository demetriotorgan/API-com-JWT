import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SCRECT = process.env.TOKEN_SECRET

function VerifyToken(req,res,next){
    const token = req.headers.authorization
    jwt.verify(token, SCRECT, (err)=>{
        if(err){
            return res.status(401).json({message: 'Token inválido'})
        }
        return next()
    })
}

export default VerifyToken