/* Seletores */
const body = document.querySelector('body');
const header = document.querySelector('header');

const toggle = document.getElementById('toggle');
const lista = document.getElementById('lista');
const addItem = document.getElementById('addItem');
const allList = document.getElementById('allList');
const buyList = document.getElementById('buyList');
const pendingList = document.getElementById('pendingList');
const clearList = document.getElementById('clearList');
const storeContainer = document.querySelector('.store-container');
const valorFinal = document.querySelector('.valorFinal');
const tc = document.querySelector('.tc');
const ti = document.querySelector('.ti');

const btnAddItem = document.querySelector('.btnAddItem');
const btnAllList = document.querySelector('.btnAllList');
const btnBuyList = document.querySelector('.btnBuyList');
const btnPendingList = document.querySelector('.btnPendingList');
const btnClearList = document.querySelector('.btnClearList');

const itemInput = document.querySelector('.itemInput');
const listStore = document.querySelector('.store-list');
const pc = document.querySelector('.price');
const precoItem = document.getElementById('disp');

/* Controle */
var itens = [];
var itensJson = JSON.parse(localStorage.getItem('itens', JSON.stringify));
var prices = [];
const newId = Date.now();

/* Eventos */
document.addEventListener('DOMContentLoaded', getItens);
document.addEventListener('DOMContentLoaded', countItens);
document.addEventListener('DOMContentLoaded', calcularCompras);
btnAddItem.addEventListener('click', addItens);
btnClearList.addEventListener('click', clearL);
btnAllList.addEventListener('click', allItens);
btnBuyList.addEventListener('click', buyItens);
btnPendingList.addEventListener('click', pendingItens);
listStore.addEventListener('click', deleteCheck);

/* Change Mode */
toggle.onclick = function(){
    toggle.classList.toggle('active');
    body.classList.toggle('active');
    header.classList.toggle('active');
    lista.classList.toggle('active');
    addItem.classList.toggle('active');
    allList.classList.toggle('active');
    buyList.classList.toggle('active');
    pendingList.classList.toggle('active');
    clearList.classList.toggle('active');
    storeContainer.classList.toggle('active');
    valorFinal.classList.toggle('active');
    tc.classList.toggle('active');
    ti.classList.toggle('active');
}

/* BOTÕES */
function addItens(event){
    const sI = document.getElementById('sI').value;

    if(sI == "" || sI.trim() == ""){
        window.alert('Insira o nome do produto.');
    } else {
        event.preventDefault();

        const storeDiv = document.createElement('div');
        storeDiv.classList.add('item');        
        
        const newStore = document.createElement('li');
        newStore.innerText = itemInput.value;
        newStore.classList.add('store-item');
        storeDiv.appendChild(newStore);  

        saveLocalItens(itemInput.value);

        const cmpButton = document.createElement('button');
        cmpButton.innerHTML = '<i class="fas fa-check"></i>';
        cmpButton.classList.add('cmpBtn');
        storeDiv.appendChild(cmpButton);
        
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trashBtn');
        storeDiv.appendChild(trashButton);

        listStore.appendChild(storeDiv);

        itemInput.value = '';
    }
}

/* Evento Botões (Itens) */
function deleteCheck(event){
    const it = event.target;
    console.log(it);

    if(it.classList[0] === "trashBtn"){
        const item = it.parentElement;
        removeLocalPrices(item);
        removeLocalItens(item);
        item.remove();
    }

    if(it.classList[0] === "cmpBtn"){
        var item = it.parentElement;     
        var precoItem = parseInt(prompt('Digite o valor do item.'));
    
        if(precoItem <= 0){
            window.alert('O valor não pode ser 0 e nem negativo. Digite o valor novamente.');
        } else {           
            item.precoItem = Number(precoItem);    
            item.classList.toggle('completed');                   

            saveLocalPrice(precoItem);          
        }        
    }
    calcularCompras();
    countItens();
}

/* Salvar Item no Local Storage */
function saveLocalItens(item){

    if(localStorage.getItem('itens') === null){
        itens;
    } else {
        itens = JSON.parse(localStorage.getItem('itens'));
    }

    itens.push(item);
    localStorage.setItem('itens', JSON.stringify(itens));
    countItens();
}

/* Salvar Preço no Local Storage */
function saveLocalPrice(price){

    if(localStorage.getItem('prices') === null){
        prices;
    } else {
        prices = JSON.parse(localStorage.getItem('prices'));
    }

    prices.push(price);
    localStorage.setItem('prices', JSON.stringify(prices));
}

function getItens(){

    if(localStorage.getItem('itens') === null){
        itens;
    } else {
        itens = JSON.parse(localStorage.getItem('itens'));
    }
    itens.forEach((item) => {
        const storeDiv = document.createElement('div');
        storeDiv.classList.add('item');

        const newStore = document.createElement('li');
        newStore.innerText = item;
        newStore.classList.add('store-item');
        storeDiv.appendChild(newStore);

        const cmpButton = document.createElement('button');
        cmpButton.innerHTML = '<i class="fas fa-check"></i>';
        cmpButton.classList.add('cmpBtn');
        storeDiv.appendChild(cmpButton);

        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trashBtn');
        storeDiv.appendChild(trashButton);

        listStore.appendChild(storeDiv);
    })
}

/* Remove Item da Lista e LocalStorage */
function removeLocalItens(item){

    if(localStorage.getItem('itens') === null){
        itens;
    } else {
        itens = JSON.parse(localStorage.getItem('itens'));
    }

    const storeIndex = item.children[0].innerText;
    itens.splice(itens.indexOf(storeIndex), 1);
    localStorage.setItem('itens', JSON.stringify(itens));
}

/* Remove Preço da Lista e LocalStorage */
function removeLocalPrices(item){

    if(localStorage.getItem('prices') === null){
        prices;
    } else {
        prices = JSON.parse(localStorage.getItem('prices'));
    }

    const storeIndex = item.children[0].innerText;
    prices.splice(prices.indexOf(storeIndex), 1);
    localStorage.setItem('prices', JSON.stringify(prices));
}

/* Limpar Lista */
function clearL(){
    listStore.remove();
    localStorage.clear();
    location.reload();
}

/* Filtro de Todos os Itens da Lista */
function allItens(e){
    const allIt = listStore.childNodes;
    console.log(allIt);
    allIt.forEach(function(item){
        switch(e.target.value){
            case "all":
                item.style.display = 'flex';
                break;            
        }
    });
}

/* Filtro dos Itens Marcados na Lista */
function buyItens(e){
    const buyIt = listStore.childNodes;
    console.log(buyIt);
    buyIt.forEach(function(item){
        switch(e.target.value){
            case "buy":
                if(item.classList.contains("completed")){
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
                break;            
        }
    });
}

/* Filtro dos Itens Pendentes na Lista */
function pendingItens(e){
    const pendingIt = listStore.childNodes;
    console.log(pendingIt);
    pendingIt.forEach(function(item){
        switch(e.target.value){
            case "pending":
                if(!item.classList.contains("completed")){
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
                break;              
        }
    });
}

/* Calcular Valor das Compras */
function calcularCompras(){
    let somar = 0;

    for(let i = 0; i < prices.length; i++){
        somar += prices[i];
    }
    console.log(somar);
    disp.innerHTML = `${somar.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
}

/* Contador de Itens */
function countItens(){
    const qttItem = JSON.parse(localStorage.getItem('itens')) || [];
    const countItem = document.getElementById('countIt');
    countItem.innerText = qttItem.length;
}