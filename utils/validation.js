// 🔹 Função para validar e-mail
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 🔹 Função para validar senha (mínimo 6 caracteres, deve conter pelo menos uma letra e um número)
const isValidPassword = (password) => {
    if (password.length < 6) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
};

// 🔹 Função para validar se todos os campos de uma atividade estão preenchidos corretamente
const isValidActivity = (titulo, descricao, data, local, maxParticipantes) => {
    if (!titulo || !descricao || !data || !local || !maxParticipantes) {
        return false;
    }

    if (typeof maxParticipantes !== 'number' || maxParticipantes <= 0) {
        return false;
    }

    if (new Date(data) < new Date()) {
        return false; // A data da atividade deve ser no futuro
    }

    return true;
};

// 🔹 Função para verificar se um usuário já está inscrito na atividade
const isUserAlreadyEnrolled = (userId, inscritos) => {
    return inscritos.includes(userId);
};

module.exports = { isValidEmail, isValidPassword, isValidActivity, isUserAlreadyEnrolled };
