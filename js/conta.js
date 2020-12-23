//manusear body e footer do modal
var modalBody = document.getElementById("modalBody");
var modalFooter = document.getElementById("modalFooter");

//recupera dados do usuário atualmente logado
async function getUsuarioLogado() {
  try {
    const response = await fetch('https://igiota.herokuapp.com/users/' + localStorage.getItem('user'), {
      headers: {
        'content-type': 'application/json',
      },
    });
    const json = await response.json();
    document.getElementById('nomeAtual').value = json.name;
    document.getElementById('email').value = json.email;
    document.getElementById('phoneAtual').value = json.phone;
  } catch (error) {
    console.error(error);
  }
}

//Submit modificações de dados do usuário
var usrLogado = getUsuarioLogado();
console.log('usrLogado');
console.log(usrLogado);
var formEditCadastro = document.getElementById("formEditCadastro");
var listener =
formEditCadastro.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (e.srcElement[5].value == e.srcElement[6].value) {
            var obj = {
                email: e.srcElement[2].value,
                active: true,
                password: e.srcElement[5].value,
                confirm_password: e.srcElement[6].value,
                name: e.srcElement[1].value,
                phone: e.srcElement[4].value,
                userid: localStorage.getItem('user'),
                token: localStorage.getItem('token'),
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
                    document.getElementById('formEditCadastro').reset();
                    btnOk.parentNode.removeChild(btnOk);
                    window.location.reload();
                });    
            } catch (error) {
                let btnOk = document.createElement("button");
                btnOk.classList.add("btn","btn-success");
                btnOk.innerHTML= 'Ok';
                modalBody.innerHTML= 'Falha!'
                modalFooter.appendChild(btnOk);
                $('#modalContainer').modal({backdrop: 'static', keyboard: false});
                $('#modalContainer').modal('show');
                btnOk.addEventListener("click", function () {                    
                    document.getElementById('formEditCadastro').reset();
                    btnOk.parentNode.removeChild(btnOk);
                    window.location.reload();
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
                window.location.reload();
            });            
        }

    });