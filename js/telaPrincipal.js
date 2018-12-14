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

    var formNovaConta = document.getElementById("formNovaConta");
    var modalNovaConta = document.getElementById("modalNovaConta");
    var contas = document.getElementById("listaContas");
    recuperarContas(); //escrever contas do usuário no select 
    var caixas = document.getElementById("listaCaixas");
    var mensagens = document.getElementById("listaMensagens");
    var novaConta = document.getElementById("novaConta");
    var enviarEmail = document.getElementById("enviarEmail");
    var contaSelecionada, pessoaQmandou;
    var ultimoActive;

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
                //console.log(xhr.responseText);
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
                    var caixa = document.createElement("a");
                    var qtd = document.createElement("span"); //variável para informar número de mensagens ao usuário
                    qtd.setAttribute("class","badge badge-light");
                    qtd.setAttribute("id","c"+caixasUsuario[i].id);
                    // caixa.setAttribute("class", "list-group-item list-group-item-action");
                    caixa.setAttribute("class", "list-group-item list-group-item-action");
                    caixa.setAttribute("id", "caixa_"+caixasUsuario[i].id);
                    caixa.setAttribute("onclick", "recuperarMensagens(" + caixasUsuario[i].id + ")");
                    caixa.appendChild(document.createTextNode(caixasUsuario[i].nome));
                    caixa.appendChild(qtd);
                    caixas.appendChild(caixa);
                    console.log("id da caixa " + (i + 1) + ": " + caixasUsuario[i].id);
                }
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("Erro para recuperar caixas de mensagens!");
            }
            mensagens.innerHTML=""; //limpar mensagens da caixa do usuário ao trocar de usuário (preocupação para não confundir as contas)
        }
        xhr.send();
    }
    function recuperarMensagens(id) {
        if(ultimoActive == undefined){ //caso seja o primeiro click
            ultimoActive = id;
            document.getElementById("caixa_"+ultimoActive).classList.add("active"); //adicionando active na caixa selecionada, recuperado pelo ultimoActive
        }
        else{ //retirando o active do anterior e adicionando ao novo
            document.getElementById("caixa_"+ultimoActive).classList.remove("active");
            ultimoActive = id;
            document.getElementById("caixa_"+ultimoActive).classList.add("active"); //adicionando active na caixa selecionada, recuperado pelo ultimoActive
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
                document.getElementById("c"+id).innerHTML = mensagensCaixa.length; //número de mensagens é informado ao usuário
                for (let i = mensagensCaixa.length - 1; i >= 0; i--) {  //inserindo nós das caixas, mais novos vem na frente
                    //recuperarContaPeloId(mensagensCaixa[i].remetente);
                    console.log(mensagensCaixa[i]);
                    var mensagem = document.createElement("a");
                    mensagem.setAttribute("class", "list-group-item list-group-item-action");
                    mensagem.setAttribute("onclick", "abrirMensagem(" + mensagensCaixa[i].email_contum.id + ")");
                    mensagem.appendChild(document.createTextNode(
                        mensagensCaixa[i].email_contum.endereco+" - "+mensagensCaixa[i].assunto
                        +" (às "+mensagensCaixa[i].createdAt.substring(11,16)+" do dia "
                        +mensagensCaixa[i].createdAt.substring(0,10)+")"));
                    mensagens.appendChild(mensagem);
                }
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("Erro! Não foi possível recuperar as mensagens dessa caixa!");
            }
        }
        xhr.send();
    }
    function abrirMensagem(id) {
        var xhr = new XMLHttpRequest();
        var url = "http://www.henriquesantos.pro.br:8080/api/email/mensagens_email/" + localStorage.getItem("token") + "/mensagem/" + id;
        //console.log(url);
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var mensagem = JSON.parse(xhr.responseText);
                // console.log(mensagem);
                var titulo = document.getElementById("titulo");
                var remetente = document.getElementById("remetente");
                var corpo = document.getElementById("conteudo");
                titulo.innerHTML = mensagem[0].assunto;
                corpo.innerHTML = mensagem[0].corpo;
                // recuperarUsuarioPeloId(mensagem[0].id);
                remetente.innerHTML = pessoaQmandou;
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

                for (let i = 0; i < objContas.length; i++) {  //inserindo nós das contas nos 3 selects diferentes (um objeto para cada pai)
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
                alert(xhr.responseText);
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("Certifique-se de ter selecionado uma conta! Email não foi enviado!");
            }
        }
        xhr.send(json);
    });
    function recuperarContaPeloId(id){
        var xhr = new XMLHttpRequest();
        var url = "http://www.henriquesantos.pro.br:8080/api/email/contas"; 
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var todos = JSON.parse(xhr.responseText);
                // console.log(todos);
                for(let i = 0; i < todos.length; i++){
                    if(id == todos[i].id){
                        // console.log(todos[i].id);
                        pessoaQmandou = todos[i].endereco;
                        console.log("pessoa "+pessoaQmandou);
                    }
                }
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("Erro para retornar remetente!");
            }
        }
        xhr.send();
    }