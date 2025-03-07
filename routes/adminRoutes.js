const express = require('express');
const { getActivityParticipants, createActivity, editActivity, deleteActivity } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Criar uma nova atividade (Apenas Administrador)
router.post('/', verifyToken, isAdmin, createActivity);

// Editar uma atividade (Apenas Administrador)
router.put('/:activityId', verifyToken, isAdmin, editActivity);

// Excluir uma atividade (Apenas Administrador)
router.delete('/:activityId', verifyToken, isAdmin, deleteActivity);


// Listar participantes de uma atividade (Apenas Administrador)
router.get('/:activityId/participants', verifyToken, isAdmin, getActivityParticipants);

module.exports = router;
