const containerRanking = document.getElementById("containerRanking");
const easyEcoTasks = document.getElementById("easyEcoTasks");
const mediumEcoTasks = document.getElementById("mediumEcoTasks");
const hardEcoTasks = document.getElementById("hardEcoTasks");


function toggleRanking(){
    containerRanking.classList.toggle("activeRanking");
}

function btnLinkOption(link){
    window.location.href = link;
}

async function addEcoTask(){
    let adicionarEcoTasks= {'tres': 3};
    try{
        let response = await fetch('/set-data-ecotasks', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adicionarEcoTasks)
        })
    }catch (erro){
        console.error("Erro ao buscar dados: ", erro);
    }
}

async function carregarEcoTasks(){
    try{
        let tres = {"tres": 3}
        let response = await fetch('http://localhost:3000/ecotasks-atuais', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tres)
        })
        let jsonResponse = await response.json();
        
        if (!jsonResponse.ecoTasksAtuais){
            console.log("Deu erro");
            return;
        }
        let ecoTasksAtuais = jsonResponse.ecoTasksAtuais;

        let ecoFacilAtuais = ecoTasksAtuais["facil"];
        let ecoMedioAtuais = ecoTasksAtuais["medio"];
        let ecoDificilAtuais = ecoTasksAtuais["dificil"];

        for (const idEcoTask in ecoFacilAtuais){
            if (ecoFacilAtuais.hasOwnProperty(idEcoTask)){
                tarefa = `
                <div id="${idEcoTask}" class="ecoTask">
                    <p>${ecoFacilAtuais[idEcoTask]["textoEcoTask"]}</p>
                    <span class="material-symbols-outlined">check_box_outline_blank</span>
                </div>`;
        
                easyEcoTasks.innerHTML += tarefa;
            }
        }


    }catch (erro){
        console.error("Erro ao buscar dados: ", erro);
    }
}