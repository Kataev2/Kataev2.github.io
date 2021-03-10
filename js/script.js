

// ---- Read json ----
let users = [];
let page = 1;
fetch("users.json")
    .then(response => response.json())
    .then(data => {
        users = data.users;

        setTimeout(initDom(), 1);
    });

const getSort = ({ target }) => {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
    );
    
    for(const tBody of target.closest('.table__box').tBodies)
        tBody.append(...[...tBody.rows].sort(comparator(index, order)));

    for(const cell of target.parentNode.cells)
        cell.classList.toggle('sorted', cell === target);
};

document.querySelectorAll('.table__box th.sort').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));

function initDom(){ 
    let table = document.querySelector('.table__container');
    let idx = page * 5 - 5;
    let tableInner = '';
    for(let i = idx; i < idx + 5; i++) {
        if(!users[i]){
            break;
        }
        let row = `<tr class="table__row">
                    <td>${users[i].name}</td>
                    <td>${users[i].date}</td>
                    <td>${users[i].email}</td>
                    <td>${users[i].phone}</td>
                    <td>${users[i].distance}</td>
                    <td>${users[i].payment}</td>
                    <td>${currentDay()}</td>
                </tr>`
        tableInner += row;    
    }
    table.innerHTML = tableInner
    let btnContainer = document.querySelector('.table__btn-container')
    let numberPage = Math.ceil(users.length / 5);
    let btnInner = '';
    for(let j = 0; j < numberPage; j++) {
        let btn = `<div class="table__btn">
        ${j + 1}</div>`;
        btnInner += btn;
    }
    btnContainer.innerHTML = btnInner;
}
$(document).on('click', '.table__btn', function(){
    page = $(this).text();
    initDom();
})

// ---- Datepicker ----
var simple = new Datepicker('#simple');

// ---- Phone mask ----
$(function(){
    $("#phone").mask("+7 (999) 999-9999");
});

// ---- Clean error ----
$('.form__item').on('focus', function(){
    $(this).removeClass('error');
})

// ---- Check Form ----
$('.form__inner').submit(function(e){
    e.preventDefault();
    let error = false;
    let email = $("[name='email']").val();
    if (!isEmail(email)){
        error = true;
        $("[name='email']").addClass('error');
    } else {
        addUser();
        $(this)[0].reset()
    }
});

// ---- Validation ----
function isEmail(value){
    let r = /^[\w\.\d-_\+]+@[\w\.\d-_]+\.\w{2,99}$/i;
    return r.test(value)
}


// ---- New User ----
function addUser(){
    let user = {
        name: $("[name='name']").val(),
        date: $("[name='date']").val(),
        email: $("[name='email']").val(),
        phone: $("[name='phone']").val(),
        distance: $("[name='distant']").val(),
        sum: $("[name='sum']").val(),
        dateReg: currentDay()
    };
     
    users.push(user);
    initDom();
};

function currentDay(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;

    return today;
}