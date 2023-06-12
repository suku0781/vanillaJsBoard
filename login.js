let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let hour = today.getHours() < 10 ? '0' + today.getHours(): today.getHours();
let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes(): today.getMinutes();
let dateTime = year + '-' + month  + '-' + day + "T" + hour + ":" + minutes ;




function login() {
    if(!localStorage.getItem('nowUser')){
        localStorage.setItem('nowUser','');
    }
        
    let id = document.getElementById('id').value;
    let pw = document.getElementById('pw').value;
    let item = {id, pw, dateTime};
    let itemCnt = JSON.parse(localStorage.getItem('user'));
    
    debugger;    

    for(let item in itemCnt){
        console.log(itemCnt[item].usrId, itemCnt[item].usrPw);
        if(id == itemCnt[item].usrId && pw == itemCnt[item].usrPw){
            console.log(id, pw, dateTime)
            localStorage.setItem('nowUser',id);
            location.href='/';
            return true;
        }
    }
    

}

document.addEventListener('keydown', event => {
    if(event.key === "Enter"){
        login();
    }
})