const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/passwordVerify');
const {SECRET_KEY} = require('../config/config');
const {userDB} = require('../database/userData')

//Função para usuário fazer login
const loginUser = async (req, res) => {
    try {
        console.log("Tentativa de login:", req.body); // Depuração

        const { email, password } = req.body;

        // Verifica se o usuário existe
        userDB.get(email, async (err, user)=>{
            if(err) {
                return res.status(500).json({message: "Erro ao verificar o usuário"})
            }
            if(!user) {
                return res.status(401).json({message: "Usuário ou senha incorretos"})
            }

            console.log("Usuário encontrado: ", user.email);
            console.log("Senha armazenada", user.password)

            const match = await comparePassword(password, user.password)
            console.log("Resultado da comparação: ",match)
            if(!match) {
                return res.status(400).json({message:"Usuário e/ou senha inválidos"})
            }
            
            const userToken = {
                id: user.id,
                email: user.email
            }
            console.log("Senha correta, gerando token...")
            console.log("SECRET_KEY carregada:", SECRET_KEY);
            console.log("Tipo de SECRET_KEY:", typeof SECRET_KEY);

            const token = jwt.sign(userToken, SECRET_KEY)
            res.json({message: "Login bem sucedido", token, isAdmin: user.isAdmin})
        })
    } catch (error) {
        console.error(' Erro no login:', error.message);
        res.status(500).json({ message: 'Erro interno ao processar login' });
    }
};

module.exports = { loginUser };