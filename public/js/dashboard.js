//Carrega página
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html"; // Se não estiver autenticado, redireciona para login
        return;
    }

    const response = await fetch("http://localhost:4000/api/activities", {
        headers: { "Authorization": `Bearer ${token}` },
    });

    const enrolledResponse = await fetch ("http://localhost:4000/api/activities/enrolled", {
        headers: { "Authorization": `Bearer ${token}`},
    })

    if (!response.ok&&!enrolledResponse.ok) {
        alert("Erro ao carregar atividades.");
        return;
    }

    const activities = await response.json();
    const enrolledActivities = await enrolledResponse.json()


    const activitiesList = document.getElementById("activities-list");
    activitiesList.innerHTML = ""

    activities.forEach(activity => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${activity.titulo}</strong> - ${activity.data} <br>
            <button onclick="enroll('${activity.id}')">Inscrever-se</button>
        `;
        activitiesList.appendChild(li);
    });

    const enrolledList = document.getElementById("enrolled-activities");
    enrolledList.innerHTML = "";

    enrolledActivities.forEach(activity => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${activity.titulo}</strong> - ${activity.data} <br>
            <button onclick="unenroll('${activity.id}')">Cancelar Inscrição</button>
        `;
        enrolledList.appendChild(li);
    });
});
    
//Função para carregar atividades sem recarregar a página
async function loadActivities() {
    const token = localStorage.getItem("token");

    const [availableResponse, enrolledResponse] = await Promise.all([
        fetch("http://localhost:4000/api/activities", {
            headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch("http://localhost:4000/api/activities/enrolled", {
            headers: { "Authorization": `Bearer ${token}` },
        })
    ]);

    const activities = await availableResponse.json();
    const enrolledActivities = await enrolledResponse.json();

    const activitiesList = document.getElementById("activities-list");
    activitiesList.innerHTML = "";

    activities.forEach(activity => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${activity.titulo}</strong> - ${activity.data} <br>
            <button onclick="enroll('${activity.id}')">Inscrever-se</button>
        `;
        activitiesList.appendChild(li);
    });

    const enrolledList = document.getElementById("enrolled-activities");
    enrolledList.innerHTML = "";

    enrolledActivities.forEach(activity => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${activity.titulo}</strong> - ${activity.data} <br>
            <button onclick="unenroll('${activity.id}')">Cancelar Inscrição</button>
        `;
        enrolledList.appendChild(li);
    });
}

//Função para se inscrever em uma atividade
async function enroll(activityId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:4000/api/activities/${activityId}/enroll`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    alert(data.message);

    loadActivities()
}

//Função para cancelar inscrição
async function unenroll(activityId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:4000/api/activities/${activityId}/enroll`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    alert(data.message);
    loadActivities()
}

//Botão de logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
});
