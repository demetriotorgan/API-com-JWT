import {getAll, newUser, userExists, deleta, update} from '../models/usuario.model'

const todos = async()=>{
    try {
        const users = await getAll();
        return users;
    } catch (error) {
        throw new Error('Erro ao obter usuários');
    }
}

const criar = async({email, senha})=>{
    try {
        const existingUser = await userExists({ email });
        if (existingUser) return existingUser;

        const user = await newUser({ email, senha });
        return user;
    } catch (error) {
        throw new Error('Erro ao criar usuário');
    }
}

const deletar = async({id})=>{
    try {
        const existingUser = await userExists({ id });
        if (!existingUser) return { message: 'Usuário não encontrado' };

        console.log('Id a deletar:' + id);
        const deletedUser = await deleta({ id });
        return deletedUser;
    } catch (error) {
        throw new Error('Erro ao deletar usuário');
    }
}

const atualizar = async({id,email, senha})=>{
    try {
        const existingUser = await userExists({ id });
        if (!existingUser) return { mensagem: 'Usuário não existe' };

        const updatedUser = await update({ id, email, senha });
        return updatedUser;
    } catch (error) {
        throw new Error('Erro ao atualizar usuário');
    }
}

export {todos, criar, deletar, atualizar}