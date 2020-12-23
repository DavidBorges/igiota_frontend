//manusear body e footer do modal
var modalBody = document.getElementById("modalBody");
var modalFooter = document.getElementById("modalFooter");

// Esconder/Mostrar Formulários de login e cadastro
var linkCadastrar = document.getElementById("btnCadastro");
var loginContainer = document.getElementById("login");
var cadastroContainer = document.getElementById("cadastro");

linkCadastrar.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('formLogin').reset();
    loginContainer.style.display = "none";
    cadastroContainer.style.display = "inline";
});

// Modal cancelar cadastro e voltar para login
var btnCancelCadastro = document.getElementById("btnCancelCadastro");
var sBtnModalCancel = document.getElementById("sBtnModalCancel");
btnCancelCadastro.addEventListener("click", function (e) {
    e.preventDefault();
    let btnS = document.createElement("button");
    let btnN = document.createElement("button");
    btnS.classList.add("btn","btn-danger");
    btnN.classList.add("btn","btn-success")
    btnS.innerHTML= 'Sim';
    btnN.innerHTML= 'Não';
    modalBody.innerHTML= 'Deseja cancelar o cadastro?'
    modalFooter.appendChild(btnS);
    modalFooter.appendChild(btnN);
    $('#modalContainer').modal({backdrop: 'static', keyboard: false});
    $('#modalContainer').modal('show');
    btnS.addEventListener("click", function () {
        document.getElementById('formCadastro').reset();
        cadastroContainer.style.display = "none";
        loginContainer.style.display = "inline";
        $('#modalContainer').modal('hide');
        while (modalFooter.firstChild) {
            modalFooter.removeChild(modalFooter.firstChild);
        }
    });
    btnN.addEventListener("click", function () {
        $('#modalContainer').modal('hide');
        while (modalFooter.firstChild) {
            modalFooter.removeChild(modalFooter.firstChild);
        }
    });
});

//Submit cadastro
var formCadastro = document.getElementById("cadastro");
var listener =
    formCadastro.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (e.srcElement[3].value == e.srcElement[4].value) {
            var obj = {
                email: e.srcElement[1].value,
                password: e.srcElement[3].value,
                confirm_password: e.srcElement[4].value,
                name: e.srcElement[0].value,
                phone: e.srcElement[2].value,
            }
            try {
                const response = await
                    fetch('https://igiota.herokuapp.com/users', {
                        method: 'POST',
                        body: JSON.stringify(obj),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        //mode:"no-cors",
                    })
                const json = await response.json();
                let btnOk = document.createElement("button");
                btnOk.classList.add("btn","btn-success");
                btnOk.innerHTML= 'Ok';
                modalBody.innerHTML= 'Sucesso!'
                modalFooter.appendChild(btnOk);
                $('#modalContainer').modal({backdrop: 'static', keyboard: false});
                $('#modalContainer').modal('show');
                btnOk.addEventListener("click", function () {                
                    $('#modalContainer').modal('hide');
                    document.getElementById('formCadastro').reset();
                    cadastroContainer.style.display = "none";
                    loginContainer.style.display = "inline";
                    btnOk.parentNode.removeChild(btnOk);
                });    
            } catch (error) {
                let btnOk = document.createElement("button");
                btnOk.classList.add("btn","btn-success");
                btnOk.innerHTML= 'Ok';
                modalBody.innerHTML= 'Falha'
                modalFooter.appendChild(btnOk);
                $('#modalContainer').modal({backdrop: 'static', keyboard: false});
                $('#modalContainer').modal('show');
                btnOk.addEventListener("click", function () {                    
                    document.getElementById('formCadastro').reset();
                    cadastroContainer.style.display = "none";
                    loginContainer.style.display = "inline";
                    btnOk.parentNode.removeChild(btnOk);
                });    
                console.error(error);
            }
        } else {
            let btnOk = document.createElement("button");
            btnOk.classList.add("btn","btn-success");
            btnOk.innerHTML= 'Ok';
            modalBody.innerHTML= 'Senhas estão diferentes'
            modalFooter.appendChild(btnOk);
            $('#modalContainer').modal({backdrop: 'static', keyboard: false});
            $('#modalContainer').modal('show');
            btnOk.addEventListener("click", function () {
                $('#modalContainer').modal('hide');
                btnOk.parentNode.removeChild(btnOk);
            });            
        }

    });

//Fazer login
var formLogin = document.getElementById("login");
var postLogin =
    formLogin.addEventListener("submit", async function (e) {
        e.preventDefault();

        var obj = {
            email: e.srcElement[0].value,
            password: e.srcElement[1].value,
        };
        try {
            const response = await
                fetch('https://igiota.herokuapp.com/login', {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    //mode: 'no-cors'                    
                });
            const json = await response.json();
            if (response.ok && response.status == 200) {
                let token = json.token;
                localStorage.setItem('token', token);
                token = json.userId; console.log(token);
                localStorage.setItem('user', token);
                window.location.href = 'index.html';

            } else {
                console.log(response.status);
            }

        } catch (error) {
            console.error(error);
        }
    });