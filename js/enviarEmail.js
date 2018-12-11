    var contasUsuario; 
    var formEmail = document.getElementById("formEmail");
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
            alert("Erro! Crie contas");
        }
    }
    xhr.send();
    //----------------------------------Recupera ID da primeira conta do usuário
    var xhr2 = new XMLHttpRequest();
    var url2 = "http://www.henriquesantos.pro.br:8080/api/email/contas/"+localStorage.getItem("token");
    console.log(url2);

    xhr2.open("GET", url2, true);
    xhr2.setRequestHeader("Content-type", "application/json");

    xhr2.onreadystatechange = function () {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            contasUsuario = JSON.parse(xhr2.responseText);
        }
        else if (xhr2.readyState == 4 && xhr2.status == 400) {
            alert("Erro!");
        }
    }
    xhr2.send();

    formEmail.addEventListener("submit", function (e) {
        e.preventDefault();

        var obj = {
            token: localStorage.getItem("token"),
            conta_id: contasUsuario[0].id, //primeira conta do usuário
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
                console.log(xhr.responseText);
                alert("Email enviado!");
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("Algum problema aconteceu! Email não foi enviado!");
            }
        }
        xhr.send(json);
    });
