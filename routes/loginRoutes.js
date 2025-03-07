const express = require('express');
const { loginUser } = require('../controllers/loginController');

const router = express.Router();

// 🔹 Definição da rota de login
router.post('/', loginUser);

module.exports = router;
