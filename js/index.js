listarDividas();

//manusear header, body e footer do modal
var modalHeader = document.getElementById("modalHeader");
var modalBody = document.getElementById("modalBody");
var modalFooter = document.getElementById("modalFooter");

// Recebe uma lista de usuários cadastrados no sistema
async function getUsrsCadastrados(){
  try {
    const response = await fetch('https://igiota.herokuapp.com/users/', {
      headers: {
        'content-type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}

//recuperar dividas pagar/receber
async function listarDividas() {
  let pagar = document.getElementById("somaPagar");
  let receber = document.getElementById("somaReceber");
  let listarPagar = document.getElementById('listaPagar');
  let listarReceber = document.getElementById('listaReceber');
  
  try {
    const usrDividas = await getDividas();
    let somaPagar = 0;
    let somaReceber = 0;
    
    usrDividas.forEach(function(e){
      console.log(e);
      if(`${e.owner}` == localStorage.getItem('user')){        
        somaPagar = somaPagar + e.value;
        let item = document.createElement("li");
        item.classList.add("tm-list-group-item");
        item.innerHTML = 'R$ '+e.value+' à '+e.OWE_TO_NAME;
        listarPagar.appendChild(item);
      }
      if(`${e.owe_to}` == localStorage.getItem('user')){
        somaReceber = somaReceber + e.value;
        let item = document.createElement("li");
        item.classList.add("tm-list-group-item");
        item.innerHTML = 'R$ '+e.value+' de '+e.OWNER_NAME;
        listarReceber.appendChild(item);
      }
    });
    pagar.innerHTML = 'R$ ' + somaPagar;
    receber.innerHTML = 'R$ ' + somaReceber;
    
  } catch (error) {
    console.error(error);
  }
}

async function getDividas() {
  try {
    const response = await fetch('https://igiota.herokuapp.com/debts/' + localStorage.getItem('user'), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    const json = await response.json();
    json.forEach(function(e){
      e.payments = [getPagamentos(e.id)];
    });
    return json;
  } catch (error) {
    console.error(error);
  }
}

//recuperar pagamentos pagar/receber
async function getPagamentos(debtId) {
  try {
    const response = await fetch('https://igiota.herokuapp.com/payments/'+debtId, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}

//criar divida
var addDivida = document.getElementById('btnaddDivida');

addDivida.addEventListener("click", async function (e) {
  e.preventDefault();
  let submit = document.getElementById('formAddDivida');
  let addDividaCancel = document.getElementById('btnCancelAddDiviva');
  let selectUsrs = document.getElementById('selectCredor');
  let listaUsrs = await getUsrsCadastrados();
  listaUsrs.forEach(function (element) {
    let item = document.createElement("option");
    item.innerHTML = `${element.name}`;
    item.value = `${element.id}`;
    selectUsrs.appendChild(item);
  });

  $('#modalAddDivida').modal({ backdrop: 'static', keyboard: false });
  $('#modalAddDivida').modal('show');
  submit.addEventListener("submit", function (e) {
    e.preventDefault();
    setDivida(e);
    document.getElementById('formAddDivida').reset();
    while (selectUsrs.firstChild) {
      selectUsrs.removeChild(selectUsrs.firstChild);
    }
    $('#modalAddDivida').modal('hide');
  });
  addDividaCancel.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('formAddDivida').reset();
    while (selectUsrs.firstChild) {
      selectUsrs.removeChild(selectUsrs.firstChild);
    }
    $('#modalAddDivida').modal('hide');

  });
});

async function setDivida(e) {
  console.log(e.srcElement[0].value);
  var obj = {
    owner: localStorage.getItem('user'),
    owe_to: e.srcElement[1].value,
    value: e.srcElement[0].value,
    active: true,
    token: localStorage.getItem('token'),
  };
  try {
    const response = await
      fetch('https://igiota.herokuapp.com/debts', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json',

        },
      });
    const json = await response.json();
    if (response.ok && response.status == 200) {
      console.log('set divida: ');
      console.log(json);

    } else {
      console.log(response.status);
    }

  } catch (error) {
    console.error(error);
  }
}

//criar pagamento
var addPagamento = document.getElementById('btnaddPagamento');

addPagamento.addEventListener("click", async function (e) {
  e.preventDefault();
  let submit = document.getElementById('formAddPagamento');
  let addPagamentoCancel = document.getElementById('btnCancelAddPagamento');
  let selectDebts = document.getElementById('selectDebts');
  let listaDebts = await getDividas();
  listaDebts.forEach(function (e) {
    let item = document.createElement("option");
    if(`${e.owner}` == localStorage.getItem('user')){
      item.innerHTML = 'R$ '+e.value+'|'+e.OWE_TO_NAME;
      item.value = `${e.id}`;
      selectDebts.appendChild(item);
    }    
  });


  $('#modalAddPagamento').modal({ backdrop: 'static', keyboard: false });
  $('#modalAddPagamento').modal('show');
  submit.addEventListener("submit", function (e) {
    e.preventDefault();
    setPagamento(e);
    document.getElementById('formAddPagamento').reset();
    $('#modalAddPagamento').modal('hide');
  });
  addPagamentoCancel.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('formAddPagamento').reset();
    $('#modalAddPagamento').modal('hide');

  });
});

async function setPagamento(e){
  var obj = {
    user: localStorage.getItem('user'),
    debt: e.srcElement[1].value,
    value: e.srcElement[0].value,
    token: localStorage.getItem('token'),
  };
  try {
    const response = await
      fetch('https://igiota.herokuapp.com/payments', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    const json = await response.json();
    if (response.ok && response.status == 200) {
      console.log('set pagamento: ');
      console.log(json);

    } else {
      console.log(response.status);
    }

  } catch (error) {
    console.error(error);
  }
}