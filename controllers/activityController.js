const {activityDB} = require('../database/userData');
const {isUserAlreadyEnrolled} = require("../utils/validation")

//Listar todas as atividades disponíveis (Público)
const listActivities = (req, res) => {
    activityDB.readAllData((err, atividades) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar atividades' });
        }
        // 🔹 Converter JSON armazenado como string em objetos reais
        const atividadesFormatadas = atividades.map(entry => {
            try {
                return JSON.parse(entry.value); // 🔥 Converte string JSON para objeto real
            } catch (error) {
                console.error("Erro ao converter atividade:", entry);
                return null; // Ignorar entradas corrompidas
            }
        }).filter(activity => activity !== null); // Remove atividades inválidas

        console.log("Atividades encontradas:", atividadesFormatadas); // 🔍 Debug
        res.json(atividadesFormatadas);
    });
};

//Inscrever usuário em uma atividade (Usuário)
const enrollActivity = (req, res) => {
    const { activityId } = req.params;
    const userId = req.user.id; // Pegando ID do usuário autenticado (vem do middleware JWT)

    console.log("Buscando atividades:", activityId)

    activityDB.get(activityId, (err, activity) => {
        if (err || !activity) {
            return res.status(404).json({ message: 'Atividade não encontrada' });
        }

        if (isUserAlreadyEnrolled(userId, activity.inscritos)) {
            return res.status(400).json({ message: 'Você já está inscrito nesta atividade' });
        }

        if (activity.inscritos.length >= activity.maxParticipantes) {
            return res.status(400).json({ message: 'A atividade já atingiu o limite de participantes' });
        }

        activity.inscritos.push(userId);

        activityDB.put(activityId, activity, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao inscrever na atividade' });
            }
            res.json({ message: 'Inscrição realizada com sucesso!', atividade: activity });
        });
    });
};

//Cancelar inscrição em uma atividade (Usuário)
const cancelEnrollment = (req, res) => {
    const { activityId } = req.params;
    const userId = req.user.id;

    activityDB.get(activityId, (err, activity) => {
        if (err || !activity) {
            return res.status(404).json({ message: 'Atividade não encontrada' });
        }

        if (!activity.inscritos.includes(userId)) {
            return res.status(400).json({ message: 'Você não está inscrito nesta atividade' });
        }

        activity.inscritos = activity.inscritos.filter(id => id !== userId);

        activityDB.put(activityId, activity, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao cancelar inscrição' });
            }
            res.json({ message: 'Inscrição cancelada com sucesso!', atividade: activity });
        });
    });
};

//Procurar atividades do usuário
const getUserEnrolledActivities = (req, res) => {
    const userId = req.user.id;

    activityDB.readAllData((err, activities) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar atividades" });
        }

        // Processando as atividades do readAllData
        const processedActivities = activities
            .map(entry => {
                const activity = JSON.parse(entry.value); // Usando parse no readAllData
                return activity;
            })
            .filter(activity => {
                return activity.inscritos.includes(userId);//Filtrando atividades que incluem o usuário
            });

        res.json(processedActivities);
    });
};

module.exports = { getUserEnrolledActivities,listActivities, enrollActivity, cancelEnrollment };
