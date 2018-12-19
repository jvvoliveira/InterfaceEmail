 var cadastro = document.getElementById("Formcadastro");
    var login = document.getElementById("Formlogin");
    //var linkLogin = document.getElementById("linkLogin");
    //var linkCadastro = document.getElementById("linkCadastro");
    var token;
    mostrarLogin();
    function mostrarCadastro() {
        cadastro.style.display = "inline";
        login.style.display = "none";
    };

    function mostrarLogin() {
        cadastro.style.display = "none";
        login.style.display = "inline";
    };

    cadastro.addEventListener("submit", function (e) {
        e.preventDefault();

        var obj = {
            login: document.getElementById("login").value,
            nome: document.getElementById("nome").value,
            sobrenome: document.getElementById("sobrenome").value,
            cpf: document.getElementById("cpf").value,
            email_secundario: document.getElementById("email_secundario").value,
            foto:"",
            senha: document.getElementById("senha").value
        }
        if(obj.senha != document.getElementById("confsenha").value){
            alert("Senha não foi confirmada!");
            return;
        }

        var json = JSON.stringify(obj);

        var xhr = new XMLHttpRequest();
        var url = "http://www.henriquesantos.pro.br:8080/api/email/usuarios/new";
        xhr.open("POST", url, "true");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                alert(obj.nome + ", seu cadastro foi feito com sucesso!");
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("O login " + obj.login + " já existe no sistema!");
            }
        }
        xhr.send(json);

        mostrarLogin();
    });

    login.addEventListener("submit", function (e) {
        e.preventDefault();

        var obj = {
            login: document.getElementById("login2").value,
            senha: document.getElementById("senha2").value,
        }
        var json = JSON.stringify(obj);

        var xhr = new XMLHttpRequest();
        var url = " http://www.henriquesantos.pro.br:8080/api/email/usuarios/login";
        xhr.open("POST", url, "true");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                var objJson = JSON.parse(xhr.responseText);
                localStorage.setItem("token", objJson.token);
                window.location="pagPrincipal.html"
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                alert("Parâmetros inválidos !");
            }
        }
        xhr.send(json);
    });