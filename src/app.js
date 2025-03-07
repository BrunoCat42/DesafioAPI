const cors = require('cors');
const express = require('express');
const config = require('../config/config.js')

const app = express();

//Para permitir requisições de outras origens
app.use(cors())
// Para trabalhar com JSON nas requisições
app.use(express.json()); 

//Importação das rotas
const signinRoutes = require('../routes/signinRoutes');
const loginRoutes = require('../routes/loginRoutes');
const activityRoutes = require('../routes/activityRoutes.js')
const adminRoutes = require('../routes/adminRoutes')

// Rotas definidas
app.use('/api/signin', signinRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);

app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`);
});