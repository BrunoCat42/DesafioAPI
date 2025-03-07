const bcrypt = require('bcryptjs');

// Função para gerar o hash da senha com tratamento de erro
const hashPassword = async (password) => {
    try {
        if(!password){
            return false
        }

        console.log("Gerando hash para a senha:", password)
        
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
        
    } catch (error) {
        console.error('Erro ao gerar hash da senha:', error);
        return false;
    }
};

// Função para comparar senha digitada com hash armazenado
const comparePassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Erro ao comparar senha:', error);
        return false;
    }
};

module.exports = { hashPassword, comparePassword };
