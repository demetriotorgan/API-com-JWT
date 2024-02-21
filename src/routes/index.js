import {Router} from 'express';
import {getAll, createUser, deleteUser, updateUser} from '../controlers/usuario.controler'
import { requestLogin } from '../models/usuario.model';
import VerifyToken from '../middleware/usuario.middleware';

const routes = new Router();
routes.get('/',(req,res)=>{
    res.status(200).json({ok: 'conectado'})
})

routes.get('/usuario', VerifyToken, getAll)
routes.post('/usuario', createUser)
routes.delete('/usuario/:id', deleteUser)
routes.put('/usuario/:id', updateUser)
routes.get('/login', requestLogin)
export default routes