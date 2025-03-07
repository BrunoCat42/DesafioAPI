const express = require('express');
const {getUserEnrolledActivities, listActivities, enrollActivity, cancelEnrollment } = require('../controllers/activityController');
const { verifyToken} = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para listar todas as atividades (Acesso público)
router.get('/', listActivities);

// Rota para inscrição em uma atividade (Usuário autenticado)
router.post('/:activityId/enroll', verifyToken, enrollActivity);

// Rota para cancelar inscrição (Usuário autenticado)
router.delete('/:activityId/enroll', verifyToken, cancelEnrollment);

//Rota para verificar atividades
router.get("/enrolled", verifyToken, getUserEnrolledActivities);

module.exports = router;
