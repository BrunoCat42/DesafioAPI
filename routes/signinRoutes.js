const express = require('express');
const { registerUser, getUsers } = require('../controllers/signinController');

const router = express.Router();

// Rota de cadastro
router.post('/', registerUser);

// Rota para listar usuários (para debug)
router.get('/', getUsers);

module.exports = router;
