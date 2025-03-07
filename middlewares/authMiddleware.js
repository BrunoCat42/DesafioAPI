const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {userDB} = require('../database/userData');

// Middleware para verificar se o usuário está autenticado
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado! Nenhum token fornecido.' });
    }

    jwt.verify(token.replace("Bearer ", ""), config.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }

        req.user = decoded; // Armazena os dados do usuário decodificados na requisição
        next();
    });
};

// Middleware para verificar se o usuário é um administrador
const isAdmin = (req, res, next) => {
    const userEmail = req.user.email;

    userDB.get(userEmail, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Acesso negado! Apenas administradores podem acessar esta rota.' });
        }

        next();
    });
};

module.exports = { verifyToken, isAdmin };
