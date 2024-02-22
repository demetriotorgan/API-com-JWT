import App from './App'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000

App.listen(PORT, ()=>{
    console.log(`Servindo na porta ${PORT}`)
});