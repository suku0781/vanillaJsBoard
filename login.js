let dateTime;
let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let hour = today.getHours() < 10 ? '0' + today.getHours(): today.getHours();
let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes(): today.getMinutes();
dateTime = year + '-' + month  + '-' + day + "T" + hour + ":" + minutes ;




function login() {
        
    let id = document.getElementById('id').value;
    let pw = document.getElementById('pw').value;
    let item = [id, pw, dateTime]

    console.log(id, pw, dateTime)

    if(localStorage.getItem('user') == null ){
        localStorage.setItem('user', '[]');
    }

}