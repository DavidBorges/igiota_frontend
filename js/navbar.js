document.onload = getUsuarioLogado();

//recupera dados do usuário atualmente logado
async function getUsuarioLogado() {
  try {
    const response = await fetch('https://igiota.herokuapp.com/users/' + localStorage.getItem('user'), {
      headers: {
        'content-type': 'application/json',
      },
    });
    const json = await response.json();
    let usrName = document.getElementById("conta");
    let textnode = document.createTextNode(json.name);
    usrName.appendChild(textnode);
  } catch (error) {
    console.error(error);
  }
}

//logout
var logout = document.getElementById('btnLogout');

logout.addEventListener('click', function (e) {
  e.preventDefault();
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = 'login.html';
});