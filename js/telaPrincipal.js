//-----------------------------Colocando nome do usuário----------------------------------------
var dono = document.getElementById("dono");
var xhr = new XMLHttpRequest();
var url = "http://www.henriquesantos.pro.br:8080/api/email/usuarios/" + localStorage.getItem("token");
console.log(url);
var pessoa;
xhr.open("GET", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        pessoa = JSON.parse(xhr.responseText);
        dono.innerHTML = pessoa.nome;
    }
    else if (xhr.readyState == 4 && xhr.status == 400) {
        alert("Erro para recuperar usuário");
    }
}
xhr.send();
//---------------------------------------------------------------------
var objContas; //todas as contas cadastradas 
var formNovaConta = document.getElementById("formNovaConta");
var modalNovaConta = document.getElementById("modalNovaConta");
var contas = document.getElementById("listaContas");
atualizarFormEnviarEmail();
recuperarContas(); //escrever contas do usuário no select 
var caixas = document.getElementById("listaCaixas");
var mensagens = document.getElementById("listaMensagens");
var novaConta = document.getElementById("novaConta");
var enviarEmail = document.getElementById("enviarEmail");
var contaSelecionada, pessoaQmandou;
var ultimoActive, mensagemAberta;
var btnExcluir = document.getElementById("excluir");
var btnResponder = document.getElementById("responder");
var respAssunto, respPara;
console.log("token: " + localStorage.getItem("token"));

formNovaConta.addEventListener("submit", function (e) {
    e.preventDefault();

    var obj = {
        endereco: document.getElementById("endereco").value,
        tipo: document.getElementById("tipo").value,
        foto: "",
        token: localStorage.getItem("token"),
    }

    var json = JSON.stringify(obj);

    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/contas/new";
    xhr.open("POST", url, "true");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            $('#modalNovaConta').modal();
            alert("Conta " + obj.endereco + " criada com sucesso!");
            recuperarContas(); //atualizar lista de contas com a nova que foi criada
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro!");
        }
    }
    xhr.send(json);

});
novaConta.addEventListener("click", function () {
    $('#modalNovaConta').modal();
});
enviarEmail.addEventListener("click", function () {
    atualizarFormEnviarEmail(); //escrever todas as contas do servidor como opções no select de enviar email
    $('#modalEnviarEmail').modal();
});
function recuperarContas() {
    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/contas/" + localStorage.getItem("token");
    console.log(url);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var contasUsuario = JSON.parse(xhr.responseText);
            contas.innerHTML = ""; //limpar tudo antes de fazer nova chamada
            var conta = document.createElement("option");
            conta.appendChild(document.createTextNode("Escolha uma conta"));
            contas.appendChild(conta);
            for (let i = 0; i < contasUsuario.length; i++) {  //inserindo nós das contas no dropdown
                conta = document.createElement("option");
                conta.setAttribute("value", contasUsuario[i].id);
                conta.appendChild(document.createTextNode(contasUsuario[i].endereco));
                contas.appendChild(conta);
            }
            //contas.setAttribute("onchange", "recuperarCaixas("+contas.selectedIndex.value+")");
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro!");
        }
    }
    xhr.send();
}
function recuperarCaixas(id) {
    ultimoActive = undefined; //corrigindo erro do "active" de quando se troca a caixa de mensagens
    contaSelecionada = id;
    console.log("id da conta selecionada: " + contaSelecionada);
    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/caixas/" + localStorage.getItem("token") + "/conta/" + id;
    console.log(url);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var caixasUsuario = JSON.parse(xhr.responseText);
            caixas.innerHTML = ""; //limpar tudo antes de fazer nova chamada
            for (let i = 0; i < caixasUsuario.length; i++) {  //inserindo nós das caixas
                var caixa = document.createElement("div");
                var qtd = document.createElement("span"); //variável para informar número de mensagens ao usuário
                qtd.setAttribute("class", "badge badge-light");
                qtd.setAttribute("id", "c" + caixasUsuario[i].id);
                // caixa.setAttribute("class", "list-group-item list-group-item-action");
                caixa.setAttribute("class", "list-group-item list-group-item-action");
                caixa.setAttribute("id", "caixa_" + caixasUsuario[i].id);
                caixa.setAttribute("onclick", "recuperarMensagens(" + caixasUsuario[i].id + ")");
                caixa.setAttribute("ondrop", "drop(" + event + ")");
                caixa.setAttribute("ondragover", "allowDrop(" + event + ")");
                caixa.appendChild(document.createTextNode(caixasUsuario[i].nome));
                caixa.appendChild(qtd);
                caixas.appendChild(caixa);
                console.log("id da caixa " + (i + 1) + ": " + caixasUsuario[i].id);
            }
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro para recuperar caixas de mensagens!");
        }
        mensagens.innerHTML = ""; //limpar mensagens da caixa do usuário ao trocar de usuário (preocupação para não confundir as contas)
    }
    xhr.send();
}
function recuperarMensagens(id) {
    if (ultimoActive == undefined) { //caso seja o primeiro click
        ultimoActive = id;
        document.getElementById("caixa_" + ultimoActive).classList.add("active"); //adicionando active na caixa selecionada, recuperado pelo ultimoActive
    }
    else { //retirando o active do anterior e adicionando ao novo
        document.getElementById("caixa_" + ultimoActive).classList.remove("active");
        ultimoActive = id;
        document.getElementById("caixa_" + ultimoActive).classList.add("active"); //adicionando active na caixa selecionada, recuperado pelo ultimoActive
    }
    console.log("caixa: " + id);
    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/mensagens_email/" + localStorage.getItem("token") + "/conta/" + contaSelecionada + "/caixa/" + id;
    console.log(url);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var mensagensCaixa = JSON.parse(xhr.responseText); //mensagens de uma caixa
            mensagens.innerHTML = ""; //limpar tudo antes de fazer nova chamada
            document.getElementById("c" + id).innerHTML = mensagensCaixa.length; //número de mensagens é informado ao usuário
            for (let i = mensagensCaixa.length - 1; i >= 0; i--) {  //inserindo nós nas caixas, mais novos vem na frente
                console.log(mensagensCaixa[i]);
                var posConta;

                for (let j = 0; j < objContas.length; j++) {
                    console.log("procurando id " + j + " ->" + objContas[j].id);
                    if (objContas[j].id == mensagensCaixa[i].remetente) {
                        posConta = j;
                        console.log("achou ->" + posConta);
                        break;
                    }
                }
                var mensagem = document.createElement("a");
                mensagem.setAttribute("class", "list-group-item list-group-item-action");
                console.log("oq está sendo passado ->" + posConta);
                mensagem.setAttribute("onclick", "abrirMensagem(' "+mensagensCaixa[i].id+","+posConta+"')");
                mensagem.setAttribute("draggable", "true");
                mensagem.setAttribute("ondragstart", "drag("+event+")");
                mensagem.appendChild(document.createTextNode(
                    objContas[posConta].endereco
                    // mensagensCaixa[i].remetente
                    + " - " + mensagensCaixa[i].assunto
                    + " (às " + mensagensCaixa[i].createdAt.substring(11, 16) + " do dia "
                    + mensagensCaixa[i].createdAt.substring(0, 10) + ")"));
                mensagens.appendChild(mensagem);
            }
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro! Não foi possível recuperar as mensagens dessa caixa!");
        }
    }
    xhr.send();
}
function abrirMensagem(id, posicao) {
    console.log("passou isso ->" + posicao);
    mensagemAberta = id;
    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/mensagens_email/" + localStorage.getItem("token") + "/mensagem/" + id;
    //console.log(url);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var mensagem = JSON.parse(xhr.responseText);
            console.log(mensagem);
            var titulo = document.getElementById("titulo");
            var remetente = document.getElementById("remetente");
            var corpo = document.getElementById("conteudo");
            titulo.innerHTML = mensagem[0].assunto;
            corpo.innerHTML = mensagem[0].corpo;
            var posDest;
            //for para procurar posição do obj que possui o id procurado
            for (let j = 0; j < objContas.length; j++) {
                if (objContas[j].id == mensagem[0].remetente) {
                    posicao = objContas[j].endereco; //aqui posição passa a ser String
                    break;
                }
                // if(mensagem[0].email_destinatarios[0].id == objContas[j].id){
                //     posDest =  j;
                // }
            }

            // remetente.innerHTML = "De: "+posicao+"\nPara: "+objContas[posDest].endereco;
            remetente.innerHTML = posicao;
            // remetente.innerHTML = objContas[posicao].endereco;
            //caso de responder email
            respPara = mensagem[0].remetente;
            respAssunto = mensagem[0].assunto;
            //------
            $('#modalLerMensagem').modal();
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro para exibir mensagem!");
        }
    }
    xhr.send();
}
function sair() {
    localStorage.removeItem("token");
    window.location = "index.html"
}
function atualizarFormEnviarEmail() {
    var paraContas = document.getElementById("para");
    var ccContas = document.getElementById("cc");
    var ccoContas = document.getElementById("cco");
    //------------------------------lista as contas no select
    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/contas"

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            objContas = JSON.parse(xhr.responseText);
            paraContas.innerHTML = ""; //limpar tudo antes de fazer nova chamada
            ccContas.innerHTML = "";
            ccoContas.innerHTML = "";

            var conta = document.createElement("option");
            var conta2 = document.createElement("option");
            var conta3 = document.createElement("option");

            conta.appendChild(document.createTextNode("Destinatário"));
            conta2.appendChild(document.createTextNode("Cópia"));
            conta.setAttribute("value", "");
            conta3.appendChild(document.createTextNode("Cópia Oculta"));
            conta.setAttribute("value", "");

            paraContas.appendChild(conta);
            ccContas.appendChild(conta2);
            ccoContas.appendChild(conta3);

            console.log("existem " + objContas.length + " contas cadastradas");

            for (let i = 0; i < objContas.length; i++) {  //inserindo nós das contas nos 3 selects diferentes (um objeto para cada pai)
                console.log("i = " + i + " conta = " + objContas[i].endereco + " e " + objContas[i].id);
                conta = document.createElement("option");
                conta2 = document.createElement("option");
                conta3 = document.createElement("option");

                conta.setAttribute("value", objContas[i].id);
                conta.appendChild(document.createTextNode(objContas[i].endereco));
                conta2.setAttribute("value", objContas[i].id);
                conta2.appendChild(document.createTextNode(objContas[i].endereco));
                conta3.setAttribute("value", objContas[i].id);
                conta3.appendChild(document.createTextNode(objContas[i].endereco));

                paraContas.appendChild(conta);
                ccContas.appendChild(conta2);
                ccoContas.appendChild(conta3);
            }
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro!");
        }
    }
    xhr.send();
}
formEmail.addEventListener("submit", function (e) {
    e.preventDefault();

    var obj = {
        token: localStorage.getItem("token"),
        conta_id: contaSelecionada,
        assunto: document.getElementById("assunto").value,
        corpo: document.getElementById("corpo").value,
        destinatarios_para: document.getElementById("para").value,
        destinatarios_cc: document.getElementById("cc").value,
        destinatarios_cco: document.getElementById("cco").value,
    }

    var json = JSON.stringify(obj);

    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/mensagens_email/enviar";
    xhr.open("POST", url, "true");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log(xhr.responseText);
            //alert("Email enviado!");
            $('#modalEnviarEmail').modal("hide");
            alert(xhr.responseText);
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Certifique-se de ter selecionado uma conta! Email não foi enviado!");
        }
    }
    xhr.send(json);
});
btnExcluir.addEventListener("click", function (e) {
    var xhr = new XMLHttpRequest();
    var url = "http://www.henriquesantos.pro.br:8080/api/email/mensagens_email/" + localStorage.getItem("token") + "/conta/" + contaSelecionada + "/caixa/" + ultimoActive + "/mensagem/" + mensagemAberta;
    xhr.open("DELETE", url, "true");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
            $('#modalLerMensagem').modal("hide");
            alert("Email excluído!");
            //window.location.reload(); //atualizar página
        }
        else if (xhr.readyState == 4 && xhr.status == 400) {
            alert("Erro ao excluir email!");
        }
    }
    xhr.send();
});
btnResponder.addEventListener("click", function (e) {
    $('#modalLerMensagem').modal("hide");
    // atualizarFormEnviarEmail();
    document.getElementById("para").value = respPara;
    document.getElementById("assunto").value = respAssunto;
    $('#modalEnviarEmail').modal();

});
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    console.log("arrastou");
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
}