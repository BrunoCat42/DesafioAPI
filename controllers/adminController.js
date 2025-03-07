const {activityDB} = require('../database/userData');
const {isValidActivity} = require('../utils/validation')

// Criar uma nova atividade (Administrador)
const createActivity = (req, res) => {
    const { titulo, descricao, data, local, maxParticipantes } = req.body;

    if (!isValidActivity(titulo, descricao, data, local, maxParticipantes)) {
        return res.status(400).json({ message: 'Dados da atividade inválidos!' });
    }
    
    const id = Date.now().toString(); // Gerar um ID único baseado no timestamp
    const newActivity = { id, titulo, descricao, data, local, maxParticipantes, inscritos: [] };

    activityDB.put(id, newActivity, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar atividade' });
        }
        res.status(201).json({ message: 'Atividade criada com sucesso!', atividade: newActivity });
    });
};

//Editar uma atividade (Administrador)
const editActivity = (req, res) => {
    const { activityId } = req.params;
    const { titulo, descricao, data, local, maxParticipantes } = req.body;

    activityDB.get(activityId, (err, activity) => {
        if (err || !activity) {
            return res.status(404).json({ message: 'Atividade não encontrada' });
        }

        if (titulo) activity.titulo = titulo;
        if (descricao) activity.descricao = descricao;
        if (data) activity.data = data;
        if (local) activity.local = local;
        if (maxParticipantes) activity.maxParticipantes = maxParticipantes;

        activityDB.put(activityId, activity, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao editar atividade' });
            }
            res.json({ message: 'Atividade atualizada com sucesso!', atividade: activity });
        });
    });
};

//Excluir uma atividade (Administrador)
const deleteActivity = (req, res) => {
    const { activityId } = req.params;

    activityDB.get(activityId, (err, activity) => {
        if (err || !activity) {
            return res.status(404).json({ message: 'Atividade não encontrada' });
        }

        activityDB.del(activityId, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao excluir atividade' });
            }
            res.json({ message: 'Atividade excluída com sucesso!' });
        });
    });
};

//Visualisar lista de participantes de uma atividade (Administrador)
const getActivityParticipants = (req, res) => {
    const { activityId } = req.params;

    activityDB.get(activityId, (err, activity) => {
        if (err || !activity) {
            return res.status(404).json({ message: 'Atividade não encontrada' });
        }

        if (!activity.inscritos || activity.inscritos.length === 0) {
            return res.json({ message: 'Nenhum participante inscrito nesta atividade.', participantes: [] });
        }

        res.json({ message: `Lista de participantes da atividade '${activity.titulo}'.`, participantes: activity.inscritos });
    });
};

module.exports = { createActivity, editActivity, deleteActivity, getActivityParticipants };
