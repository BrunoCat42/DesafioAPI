const { hashPassword } = require('../utils/passwordVerify');
const {isValidEmail, isValidPassword} = require('../utils/validation')
const {userDB} = require('../database/userData') //Importa a lista de usuários compartilhada

// Método para cadastrar um novo usuário
const registerUser = async (req, res) => {
    try{

        console.log("Corpo da requisição:" ,req.body)
        const { name, email, password, isAdmin } = req.body;

        // Validações
        if (!name || !email || !password) {
            return res.status(400).json({message: "Todos os campos são obrigatórios"});
        }
        
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'E-mail inválido!' });
        }
    
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres, incluindo uma letra e um número.' });
        }

        userDB.get(email, async (err, existingUser) =>{
            if(err){
                console.error("Erro ao acessar banco de dados: ", err)
                return res.status(500).json({message: "Erro ao verificar usuário"})
            }
            if(existingUser) {
                return res.status(400).json({message: "E-mail já cadastrado"})
            }

            console.log("Senha antes do hash: ", password);
            const hashedPassword = await hashPassword(password)
            const newUser = {id: Date.now(), name,email, password: hashedPassword, isAdmin: isAdmin|| false}

            userDB.put(email, newUser, (err) =>{
                if(err){
                    return res.status(500).json({message:"Erro ao salvar usuário"})
                }

                console.log("Usuário cadastrado com sucesso: ", newUser)
                res.status(201).json({message:"Usuário registrado com sucesso"})
            })
        })
    }catch(error){
        console.error("Erro ao cadastrar usuário: ", error)
        res.status(500).json({message: "Erro ao processar usuário"})
    }
}

// Método para listar todos os usuários (apenas para debug)
const getUsers = (req, res) => {
    try{
        userDB.readAllData((err,data)=>{
            if(err||!data){
                return res.status(500).json({message: "Erro ao verificar dados"})
            }
            res.json({message: "Lista de usuários", data})
        })
    }catch(error){
        res.status(500).json({error: "Erro ao processar os dados"})
    }
};

module.exports = { registerUser, getUsers };
