const express = require('express');
const config = require('./config')

const app = express();

// Middlewares básicos
app.use(express.json()); // Para trabalhar com JSON nas requisições

// Rota inicial (só para teste)
app.get('/', (req, res) => {
    res.send('API de Atividades de Voluntariado 🚀');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});