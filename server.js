const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
// const open = require('open');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'data', 'dados.json');


app.get('/check-login', (req, res) => {
    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};
        if (data){
            dados = JSON.parse(data);
        }
        if (dados["users"] == undefined){
            dados["users"] = {}
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }
        emailLogin = Object.keys(dados["login"])

        if (!emailLogin[0]){
            res.json({success: false});
        }else{
            res.json({success: true});           
        }
    })
})
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})
app.get('/ecoTask.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ecoTask.html'));
})

function sortearItem(dict){
    let dictChaves = Object.keys(dict);

    let itemSorteado = dictChaves[Math.floor(Math.random() * dictChaves.length)]

    return {"ecoTaskId": itemSorteado, "ecoTaskValue": dict[itemSorteado]};
}

function adicionarDias(dataAtual, diasAdicionar){

    let data = new Date(dataAtual);

    data.setDate(data.getDate() + diasAdicionar+1);

    let ano = data.getFullYear();
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

app.post('/ecotasks-atuais', (req, res) => {
    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success: false, message: "Erro ao ler dados"});
        }

        let dados = {};

        if (data){
            dados = JSON.parse(data);
        }
        let dataAtual = new Date().toLocaleDateString("en-CA");
        let dataEcoTask = dados["ecoTasks"]["dataEcoTasks"];

        if (!dados["ecoTasks"]["ecoTasksAtuais"]){
            dados["ecoTasks"]["ecoTasksAtuais"] = {"facil": {}, "medio": {}, "dificil": {}};
            let ecoTasksAtuais = dados["ecoTasks"]["ecoTasksAtuais"];

            let facil1Atual = sortearItem(dataEcoTask["facil"]);
            let facil2Atual = sortearItem(dataEcoTask["facil"]);

            while (facil2Atual == facil1Atual){
                facil2Atual = sortearItem(dataEcoTask["facil"]);
            }

            let medioAtual = sortearItem(dataEcoTask["medio"]);

            let dificilAtual = sortearItem(dataEcoTask["dificil"]);

            ecoTasksAtuais["facil"][facil1Atual["ecoTaskId"]] = facil1Atual["ecoTaskValue"];
            ecoTasksAtuais["facil"][facil1Atual["ecoTaskId"]]["dataInicio"] = dataAtual;
            ecoTasksAtuais["facil"][facil1Atual["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 1);


            ecoTasksAtuais["facil"][facil2Atual["ecoTaskId"]] = facil2Atual["ecoTaskValue"];
            ecoTasksAtuais["facil"][facil2Atual["ecoTaskId"]]["dataInicio"] = dataAtual;
            ecoTasksAtuais["facil"][facil2Atual["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 1);


            ecoTasksAtuais["medio"][medioAtual["ecoTaskId"]] = medioAtual["ecoTaskValue"];
            ecoTasksAtuais["medio"][medioAtual["ecoTaskId"]]["dataInicio"] = dataAtual;
            ecoTasksAtuais["medio"][medioAtual["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 3);


            ecoTasksAtuais["dificil"][dificilAtual["ecoTaskId"]] = dificilAtual["ecoTaskValue"];
            ecoTasksAtuais["dificil"][dificilAtual["ecoTaskId"]]["dataInicio"] = dataAtual;
            ecoTasksAtuais["dificil"][dificilAtual["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 7);
        }else {
            let ecoTasksAtuais = dados["ecoTasks"]["ecoTasksAtuais"];

            let chavesDoAtuaisFacil = Object.keys(ecoTasksAtuais['facil']);
            let chavesDoMedioAtual = Object.keys(ecoTasksAtuais['medio']);
            let chavesDoDificilAtual = Object.keys(ecoTasksAtuais['dificil']);

            let facil1Atual = ecoTasksAtuais["facil"][chavesDoAtuaisFacil[0]]; // contem apenas o value e não o id da ecotask
            let facil2Atual = ecoTasksAtuais["facil"][chavesDoAtuaisFacil[1]];

            let medioAtual = ecoTasksAtuais["medio"][chavesDoMedioAtual[0]];

            let dificilAtual = ecoTasksAtuais["dificil"][chavesDoDificilAtual[0]];

            let novoFacil1, novoFacil2, novoMedio, novoDificil

            if (dataAtual >= facil1Atual["dataFim"]){
                delete ecoTasksAtuais["facil"][chavesDoAtuaisFacil[0]];
                delete ecoTasksAtuais["facil"][chavesDoAtuaisFacil[1]];

                novoFacil1 = sortearItem(dataEcoTask["facil"]);
                novoFacil2 = sortearItem(dataEcoTask["facil"]);

                while (novoFacil2 == novoFacil1){
                    novoFacil2 = sortearItem(dataEcoTask["facil"]);
                }

                ecoTasksAtuais["facil"][novoFacil1["ecoTaskId"]] = novoFacil1["ecoTaskValue"];
                ecoTasksAtuais["facil"][novoFacil1["ecoTaskId"]]["dataInicio"] = dataAtual;
                ecoTasksAtuais["facil"][novoFacil1["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 1);
                 
                ecoTasksAtuais["facil"][novoFacil2["ecoTaskId"]] = novoFacil1["ecoTaskValue"];
                ecoTasksAtuais["facil"][novoFacil1["ecoTaskId"]]["dataInicio"] = dataAtual;
                ecoTasksAtuais["facil"][novoFacil1["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 1);
            }
            if (dataAtual >= medioAtual["dataFim"]){
                delete ecoTasksAtuais["medio"][chavesDoMedioAtual[0]];

                novoMedio = sortearItem(dataEcoTask["medio"]);

                ecoTasksAtuais["medio"][novoMedio["ecoTaskId"]] = novoMedio["ecoTaskValue"];
                ecoTasksAtuais["medio"][novoMedio["ecoTaskId"]]["dataInicio"] = dataAtual;
                ecoTasksAtuais["medio"][novoMedio["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 3);
            }
            if (dataAtual >= dificilAtual["dataFim"]){
                delete ecoTasksAtuais["dificil"][chavesDoDificilAtual[0]];

                novoDificil = sortearItem(dataEcoTask["dificil"]);

                ecoTasksAtuais["dificil"][novoDificil["ecoTaskId"]] = novoDificil["ecoTaskValue"];
                ecoTasksAtuais["dificil"][novoDificil["ecoTaskId"]]["dataInicio"] = dataAtual;
                ecoTasksAtuais["dificil"][novoDificil["ecoTaskId"]]["dataFim"] = adicionarDias(dataAtual, 7);
            }
        }

        fs.writeFile(DATA_PATH, JSON.stringify(dados, null, 2), (err) => {
            if (err){
                console.error('Erro ao salvar:', err);
                return res.status(500).send('Erro interno');
            }
            res.json({ success: true, ecoTasksAtuais: dados["ecoTasks"]["ecoTasksAtuais"]})
        })
    })
})

app.post('/set-data-ecotasks',(req, res) => {
    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};
        if (data){
            dados = JSON.parse(data);
        }
        if (dados["users"] == undefined){
            dados["users"] = {}
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }
        if (!dados["ecoTasks"]["dataEcoTasks"]){
            dados["ecoTasks"]["dataEcoTasks"] = {"facil": {}, "medio": {}, "dificil": {}};
        }
        let dataEcoTasks = dados["ecoTasks"]["dataEcoTasks"];
        let adicionarEcoTasks = {"tipo": "facil", "textoEcoTask": "Pratique 20 minutos de exercícios", "descricao": "Se exercite por 20 minutos em sua casa ou no seu bairro."};

        let ecoTaskId = randomUUID();
        dataEcoTasks[adicionarEcoTasks["tipo"]][ecoTaskId] = {"textoEcoTask": adicionarEcoTasks["textoEcoTask"], "descricao" : adicionarEcoTasks["descricao"]};
        // dados["ecoTasks"]["dataEcoTasks"] = dataEcoTasks;


        fs.writeFile(DATA_PATH, JSON.stringify(dados, null, 2), (err) => {
            if (err){
                console.error('Erro ao salvar:', err);
                return res.status(500).send('Erro interno');
            }
            res.json({ success: true, message : "Cadastro realizado com sucesso"})
        })
    })
})

app.post('/salvar-cadastro', (req, res) => {
    const dadosFormulario = req.body;
    const { name,email,password } = dadosFormulario;
    const userId = randomUUID();
    // console.log(dadosFormulario);
    // console.log(name);
    // console.log(dadosFormulario["confirm-password"]);

    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};
        if (data){
            dados = JSON.parse(data);
        }
        if (dados["users"] == undefined){
            dados["users"] = {}
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }
        if (!dados["users"][email]){
            dados["users"][email] = {"userId": userId, "nome": name, "senha": password, "allTasks":{}, "ecoTasks":{}};
            dados["login"] = {}
            dados["login"][email] = dados["users"][email];
        }else{
            return res.status(400).json({success: false, message: "E-mail já cadastrado!"});
        }
        if (password != dadosFormulario["confirm-password"]){
            return res.status(399).json({success:false, message:"As senhas digitadas são diferentes!"})
        }



        fs.writeFile(DATA_PATH, JSON.stringify(dados, null, 2), (err) => {
            if (err){
                console.error('Erro ao salvar:', err);
                return res.status(500).send('Erro interno');
            }
            res.json({ success: true, message : "Cadastro realizado com sucesso"})
        })
    })
})


app.post('/salvar-login', (req, res) => {
    const dadosFormulario = req.body;
    const { email,password } = dadosFormulario;
    // console.log(dadosFormulario);
    // console.log(name);
    // console.log(dadosFormulario["confirm-password"]);

    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};
        if (data){
            dados = JSON.parse(data);
        }
        if (dados["users"] == undefined){
            dados["users"] = {};
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }
        if (dados["users"][email]){
            if(password == dados["users"][email]["senha"]){
                dados["login"] = {};
                dados["login"][email] = dados["users"][email];
            }else{
                return res.status(399).json({success: false, message: "Senha incorreta"});
            }

        }else{
            return res.status(400).json({success: false, message: "O E-mail digitado não está cadastrado"});
        }



        fs.writeFile(DATA_PATH, JSON.stringify(dados, null, 2), (err) => {
            if (err){
                console.error('Erro ao salvar:', err);
                return res.status(500).send('Erro interno');
            }
            res.json({ success: true, message : "Cadastro realizado com sucesso"})
        })
    })
})

app.post('/adicionar-tarefa', (req, res) => {
    let dadosFormulario = req.body;
    const { textTarefa,dataTarefa } = dadosFormulario;
    let taskId = randomUUID();
    let dataCriacao = new Date().toLocaleDateString("en-CA");
    // console.log(dadosFormulario);
    // console.log(textTarefa);
    // console.log(dataTarefa);
    // console.log(dataCriacao);

    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};

        if (data){
            dados = JSON.parse(data);
        }
        if (dados["users"] == undefined){
            dados["users"] = {};
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }


        let loginEmail = Object.keys(dados["login"])[0];
        if (!loginEmail){
            return res.status(400).json({success:false, message: "Você não está com uma conta cadastrada!"});
        }


        if (!dados["login"][loginEmail]["allTasks"]["working"]){
            dados["login"][loginEmail]["allTasks"]["working"] = {};
        }
        let loginTasksWorking = dados["login"][loginEmail]["allTasks"]["working"];

        if (!dados["login"][loginEmail]["allTasks"]["notWorking"]){
            dados["login"][loginEmail]["allTasks"]["notWorking"] = {};
        }
        let loginTasksNotworking = dados["login"][loginEmail]["allTasks"]["notWorking"];


        if (!loginTasksWorking["activeTasks"]){
            loginTasksWorking["activeTasks"] = {};
        }
        loginTasksWorking["activeTasks"][taskId] = {
            "dataCriacao": dataCriacao,
            "textTarefa": textTarefa,
            "dataTarefa": dataTarefa
        };
        let listaIdsTarefas = Object.keys(loginTasksWorking["activeTasks"]);
        let listaDicionariosTarefas = Object.values(loginTasksWorking["activeTasks"]);

        let listaIdsTarefasOrdem = [];
        let listaDicionariosTarefasOrdem = [];

        listaDicionariosTarefas.forEach((tarefa, indice) => {
            if (!listaDicionariosTarefasOrdem[0]){
                listaDicionariosTarefasOrdem.push(tarefa);
                listaIdsTarefasOrdem.push(listaIdsTarefas[indice]);
            }else{
                let tarefaemUltimo = true;
                let dataTarefa = new Date(tarefa["dataCriacao"]);
                listaDicionariosTarefasOrdem.forEach((tarefaOrdem, indiceOrdem) =>{
                    let dataTarefaOrdem = new Date(tarefaOrdem["dataCriacao"]);
                    // console.log(dataTarefa)
                    // console.log(dataTarefaOrdem)
                    if (dataTarefa < dataTarefaOrdem  && tarefaemUltimo == true){
                        listaDicionariosTarefasOrdem.splice(indiceOrdem, 0, tarefa);
                        listaIdsTarefasOrdem.splice(indiceOrdem, 0, listaIdsTarefas[indice]);
                        tarefaemUltimo = false;
                    }
                // console.log(tarefaemUltimo)
                })
                if (tarefaemUltimo == true){
                    listaDicionariosTarefasOrdem.push(tarefa);
                    listaIdsTarefasOrdem.push(listaIdsTarefas[indice]);
                }

            }
        })
        loginTasksWorking["activeTasks"] = {};
        listaIdsTarefasOrdem.forEach((id, indiceId) => {
            loginTasksWorking["activeTasks"][id] = listaDicionariosTarefasOrdem[indiceId];
        })
        dados["users"][loginEmail] = dados["login"][loginEmail];



        fs.writeFile(DATA_PATH, JSON.stringify(dados, null, 2), (err) => {
            if (err){
                console.error('Erro ao salvar:', err);
                return res.status(500).send('Erro interno');
            }
            res.json({ success: true, message : "Tarefa adicionada"});
        })
    })
})
app.get("/tarefas-hoje-afazer", (req,res) => {
    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};

        if (data){
            dados = JSON.parse(data);
        }
        if (!dados["users"]){
            dados["users"] = {};
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }


        let loginEmail = Object.keys(dados["login"])[0];
        if (!loginEmail){
            return res.status(400).json({success:false, message: "Você não está com uma conta cadastrada!"});
        }
        let tarefasWorking = dados["login"][loginEmail]["allTasks"]["working"]["activeTasks"];
        let tarefasWorkingIds = Object.keys(tarefasWorking);
        let tarefasWorkingInfos = Object.values(tarefasWorking);
        let tarefasAFazerHoje = {};
        let tarefasWorkingIdsOrdem = [];
        let tarefasWorkingInfosOrdem = [];

        let dataAtual = new Date().toLocaleDateString("en-CA");
        tarefasWorkingInfos.forEach((tarefa, indice) =>{
            if (tarefa["dataTarefa"] <= dataAtual){
                tarefasWorkingInfosOrdem.push(tarefa);
                tarefasWorkingIdsOrdem.push(tarefasWorkingIds[indice]);
            }
        })
        tarefasWorkingIdsOrdem.forEach((tarefaId, indiceId) => {
            tarefasAFazerHoje[tarefaId] = tarefasWorkingInfosOrdem[indiceId];
        })
        res.json({success : true, dados : tarefasAFazerHoje});

    })
})
app.get("/tarefas-afazer", (req,res) => {
    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};

        if (data){
            dados = JSON.parse(data);
        }
        if (!dados["users"]){
            dados["users"] = {};
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }


        let loginEmail = Object.keys(dados["login"])[0];
        if (!loginEmail){
            return res.status(400).json({success:false, message: "Você não está com uma conta cadastrada!"});
        }
        let tarefasWorking = dados["login"][loginEmail]["allTasks"]["working"]["activeTasks"];
        let tarefasConcluidas = dados["login"][loginEmail]["allTasks"]["notWorking"]["tarefasFeitas"];
        let lengthTarefasFeitas = Object.keys(tarefasConcluidas).length

        res.json({success : true, dados : tarefasWorking, lenghtTC : lengthTarefasFeitas});

    })
})
app.get("/tarefas-concluidas", (req,res) => {
    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};

        if (data){
            dados = JSON.parse(data);
        }
        if (!dados["users"]){
            dados["users"] = {};
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }


        let loginEmail = Object.keys(dados["login"])[0];
        if (!loginEmail){
            return res.status(400).json({success:false, message: "Você não está com uma conta cadastrada!"});
        }
        let tarefasWorking = dados["login"][loginEmail]["allTasks"]["working"]["activeTasks"];
        let tarefasConcluidas = dados["login"][loginEmail]["allTasks"]["notWorking"]["tarefasFeitas"];
        let lengthTarefasFeitas = Object.keys(tarefasWorking).length

        res.json({success : true, dados : tarefasConcluidas, lenghtTF : lengthTarefasFeitas});

    })
})
app.post("/marcar-tarefas", (req, res) => {
    let dadosMarcarTarefas = req.body;

    fs.readFile(DATA_PATH, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT'){
            return res.status(500).json({success:false, message: 'Erro ao ler dados'});
        }

        let dados = {};

        if (data){
            dados = JSON.parse(data);
        }
        if (dados["users"] == undefined){
            dados["users"] = {};
        }
        if (!dados["ecoTasks"]){
            dados["ecoTasks"] = {};
        }


        let loginEmail = Object.keys(dados["login"])[0];
        if (!loginEmail){
            return res.status(400).json({success:false, message: "Você não está com uma conta cadastrada!"});
        }
        if (!dados["login"][loginEmail]["allTasks"]["notWorking"]){
            dados["login"][loginEmail]["allTasks"]["notWorking"] = {};
        }
        if (!dados["login"][loginEmail]["allTasks"]["notWorking"]["tarefasFeitas"]){
            dados["login"][loginEmail]["allTasks"]["notWorking"]["tarefasFeitas"] = {};
        }

        let workingActiveTasks = dados["login"][loginEmail]["allTasks"]["working"]["activeTasks"];
        let notWorkingTarefasFeitas = dados["login"][loginEmail]["allTasks"]["notWorking"]["tarefasFeitas"];

        let idTarefa = dadosMarcarTarefas["idTarefa"];
        let marcarTarefaEM = dadosMarcarTarefas["status"];

        if (marcarTarefaEM){
            workingActiveTasks[idTarefa] = notWorkingTarefasFeitas[idTarefa];
            delete notWorkingTarefasFeitas[idTarefa];

            let loginTasksWorking = dados["login"][loginEmail]["allTasks"]["working"];
            let listaIdsTarefas = Object.keys(loginTasksWorking["activeTasks"]);
            let listaDicionariosTarefas = Object.values(loginTasksWorking["activeTasks"]);

            let listaIdsTarefasOrdem = [];
            let listaDicionariosTarefasOrdem = [];

            listaDicionariosTarefas.forEach((tarefa, indice) => {
                if (!listaDicionariosTarefasOrdem[0]){
                    listaDicionariosTarefasOrdem.push(tarefa);
                    listaIdsTarefasOrdem.push(listaIdsTarefas[indice]);
                }else{
                    let tarefaemUltimo = true;
                    let dataTarefa = new Date(tarefa["dataCriacao"]);
                    listaDicionariosTarefasOrdem.forEach((tarefaOrdem, indiceOrdem) =>{
                        let dataTarefaOrdem = new Date(tarefaOrdem["dataCriacao"]);
                        // console.log(dataTarefa)
                        // console.log(dataTarefaOrdem)
                        if (dataTarefa < dataTarefaOrdem  && tarefaemUltimo == true){
                            listaDicionariosTarefasOrdem.splice(indiceOrdem, 0, tarefa);
                            listaIdsTarefasOrdem.splice(indiceOrdem, 0, listaIdsTarefas[indice]);
                            tarefaemUltimo = false;
                        }
                    // console.log(tarefaemUltimo)
                    })
                    if (tarefaemUltimo == true){
                        listaDicionariosTarefasOrdem.push(tarefa);
                        listaIdsTarefasOrdem.push(listaIdsTarefas[indice]);
                    }
                }
            })
            loginTasksWorking["activeTasks"] = {};
            listaIdsTarefasOrdem.forEach((id, indiceId) => {
                loginTasksWorking["activeTasks"][id] = listaDicionariosTarefasOrdem[indiceId];
            })
        } else{
            notWorkingTarefasFeitas[idTarefa] = workingActiveTasks[idTarefa];
            delete workingActiveTasks[idTarefa];

            let listaIdsTarefas = Object.keys(notWorkingTarefasFeitas);
            let listaInfosTarefas = Object.values(notWorkingTarefasFeitas);

            let ordenarIdsTarefas = [];
            let ordenarInfosTarefas = [];

            listaInfosTarefas.forEach((tarefa, indice) => {
                if (ordenarInfosTarefas.length < 1){
                    ordenarIdsTarefas.push(listaIdsTarefas[indice])
                    ordenarInfosTarefas.push(tarefa);
                }else{
                    let tarefaemUltimo = true;
                    let dataTarefa = tarefa["dataCriacao"];
                    ordenarInfosTarefas.forEach((tarefaOrdem, tarefaId) => {
                        let dataTarefaOrdem = tarefaOrdem["dataCriacao"];
                        if (dataTarefa < dataTarefaOrdem && tarefaemUltimo == true){
                            ordenarIdsTarefas.splice(tarefaId, 0, listaIdsTarefas[indice]);
                            ordenarInfosTarefas.splice(tarefaId, 0, tarefa);
                            tarefaemUltimo = false;
                        }
                    })
                    if (tarefaemUltimo){
                        ordenarIdsTarefas.push(listaIdsTarefas[indice])
                        ordenarInfosTarefas.push(tarefa);    
                    }
                }
            })
            notWorkingTarefasFeitas = {};
            ordenarIdsTarefas.forEach((id, tarefaId) => {
                notWorkingTarefasFeitas[id] = ordenarInfosTarefas[tarefaId];
            })
        }
        
        fs.writeFile(DATA_PATH, JSON.stringify(dados, null, 2), (err) => {
            if (err){
                console.error('Erro ao salvar:', err);
                return res.status(500).send('Erro interno');
            }
            res.json({ success: true, message : "Tarefa adicionada"});
        })

    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${PORT} já está em uso!`);
        process.exit(1);
    } else {
        throw err;
    }
});