import {todos, criar, deletar, atualizar} from '../service/usuario.service'

const getAll = async(req,res) =>{
    try {
        const users = await todos();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao obter usuários' });
    }
}

const createUser = async(req,res)=>{
    const { email, senha } = req.body;
    try {
        const newUser = await criar({ email, senha });
        return res.status(200).json(newUser);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
}

const deleteUser = async(req,res) =>{
    const { id } = req.params;
    try {
        const deletedUser = await deletar({ id });
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
}

const updateUser = async(req,res)=>{
    const { email, senha } = req.body;
    const { id } = req.params;
    try {
        const updatedUser = await atualizar({ id, email, senha });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
}

export {getAll, createUser, deleteUser, updateUser}