const apiUrl = "http://127.0.0.1:80/climatempo/"; // Const que salva a URL da api clima tempo

function fade(element, callback) { // Função que serve para o toast desaparecer em fade out
    let op = 1;
    let timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function updateElementText(elementId, text, text2) { // Função que serve para podermos colocar os textos (graus celcius etc e tal)
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = text + text2;
    }
}

function updateElementImg(elementId, src) { // Mesma coisa q o updateElementText só que com imagem 
    const element = document.getElementById(elementId);
    if (element) {
        element.src = src;
    }
}

function displayData(data) { // Função na qual retorna as informações como, clima, imagem etc
    if (!data) return;

    const temperatura = data.temperatura.toFixed(0);

    console.log(data);
    const imgUrl = `https://flagsapi.com/${data.pais}/flat/64.png`; // Imagem do icone que aparece (bandeira)
    updateElementText("temperatura", temperatura, "ºC");
    updateElementText("umidade", data.umidade, "%");
    updateElementText("veloVento", data.velocidadeDoVento, "km/h");
    updateElementText("clima", data.clima, "");
    updateElementText("nome", data.nome, "");
    updateElementImg("iconClima", data.iconUrl);    
    updateElementImg("iconPais", imgUrl);
    updateBackground("background", data.clima)
}

function handleError(errorMsg) { // Função que serve para mostrar o toast quando a cidade tiver com algum erro
    const toast = document.createElement("div");
    const icon = document.createElement("i");
    icon.className = "bx bxs-shield-x";
    toast.classList.add("toast");
    toast.innerText = errorMsg;
    toast.appendChild(icon);
    document.body.appendChild(toast);

    setTimeout(() => {
        fade(toast, function() {
            toast.remove();
        });
    }, 3000);
}

async function getData(cidade) { // Função que pesquisa a cidade 
    const url = apiUrl + cidade;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao se conectar!');
        }
        return await response.json();
    } catch (error) {
        handleError("Cidade não encontrada!");
        return null;
    }
}

function setHorario() { // Mostrar horario no canto da tela
    let date = new Date();
    let minute =  ("0" + date.getMinutes()).slice(-2);
    let hour =  ("0" + date.getHours()).slice(-2);
    let horario = `${hour}:${minute}`
    updateElementText("horario", horario, "");
}

window.addEventListener("load", async () => { // O que acontece quando você começa a usar o bglh em si
    setHorario(); // Mostra o horario
    setInterval(setHorario, 1000); // Mudar a cada segundo o horario
    const informacoes = await getData("marília"); // Pegar as informações de marilia (cidade padrão)
    displayData(informacoes); // Mostrar informações
});

const pesquisarCampo = document.getElementById("pesquisar"); // Pegar o id do input de pesquisar

pesquisarCampo.addEventListener("keyup", async (e) => { // Cria um evento que roda os comandos a seguir toda vez que houver uma pesquisa
    if (e.key === 'Enter') {
        const informacoes = await getData(pesquisarCampo.value.toLowerCase()); // Padroniza o texto recebido para letras minusculas para pesquisar na API
        displayData(informacoes); // Mostra as informações
        pesquisarCampo.value = ''; // E limpa o input / Barra de pesquisa
        
    }
});

function updateBackground(background, clima){ // Função que altera o background dependendo da resposta de clima da API
    const background1 = document.getElementById(background)

    if (clima == "Chuva" || clima == "Garoa"){
        background1.src = "images/chuva-20995920-131120200056.gif"
    } else if(clima == "Neve"){
        background1.src = "images/neve.gif"
    } else if (clima =="Névoa"){
        background1.src = "images/nevoa.jpg"
    } else if (clima =="Céu limpo"){
        background1.src = "images/ceu.jpg"
    } else if (clima == "Parcialmente nublado" ){
        background1.src = "images/nublado.gif"
    } else if (clima == "Tempestade") {
        background1.src = "images/tempestade.gif"
    } else if (clima == "Nublado") {
        background1.src = "images/nubladoR.gif"
    }
     else{
        background1.src = "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
    }
}
