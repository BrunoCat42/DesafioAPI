document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token || !isAdmin) {
        alert("Acesso negado. Você não tem permissão para acessar esta página.");
        window.location.href = "login.html";
        return;
    }

    loadActivities(); // Carregar atividades automaticamente ao abrir o painel

    // Criar atividade ao enviar o formulário
    document.getElementById("activity-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        createActivity();
    });

    // Logout
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        window.location.href = "login.html";
    });
});

// Carregar atividades existentes
async function loadActivities() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:4000/api/activities", {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            alert("Erro ao carregar atividades.");
            return;
        }

        const activities = await response.json();
        console.log(" Atividades:", activities);

        const activitiesList = document.getElementById("activities-list");
        activitiesList.innerHTML = "";

        activities.forEach(activity => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${activity.titulo}</strong> - ${activity.data} <br>
                ${activity.descricao} <br>
                Local: ${activity.local} - Máx. Participantes: ${activity.maxParticipantes} <br>
                <button onclick="editActivity('${activity.id}')">Editar</button>
                <button onclick="deleteActivity('${activity.id}')">Excluir</button>
            `;
            activitiesList.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        alert("Erro ao carregar as atividades.");
    }
}

// Criar uma nova atividade
async function createActivity() {
    const token = localStorage.getItem("token");

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const data = document.getElementById("data").value;
    const local = document.getElementById("local").value;
    const maxParticipantes = document.getElementById("maxParticipantes").value;

    const response = await fetch("http://localhost:4000/api/admin", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, descricao, data, local, maxParticipantes })
    });

    const dataResponse = await response.json();
    alert(dataResponse.message);
    loadActivities(); // Atualizar a lista de atividades
}

// Excluir uma atividade
async function deleteActivity(activityId) {
    const token = localStorage.getItem("token");

    if (!confirm("Tem certeza que deseja excluir esta atividade?")) {
        return;
    }

    const response = await fetch(`http://localhost:4000/api/admin/${activityId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const dataResponse = await response.json();
    alert(dataResponse.message);
    loadActivities(); // Atualizar a lista de atividades
}

// Editar uma atividade
async function editActivity(activityId) {
    const token = localStorage.getItem("token");

    const novoTitulo = prompt("Novo título:");
    const novaDescricao = prompt("Nova descrição:");
    const novaData = prompt("Nova data (YYYY-MM-DD):");
    const novoLocal = prompt("Novo local:");
    const novoMaxParticipantes = prompt("Novo máximo de participantes:");

    const response = await fetch(`http://localhost:4000/api/admin/${activityId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo: novoTitulo,
            descricao: novaDescricao,
            data: novaData,
            local: novoLocal,
            maxParticipantes: novoMaxParticipantes
        })
    });

    const dataResponse = await response.json();
    alert(dataResponse.message);
    loadActivities(); // Atualizar a lista de atividades
}
