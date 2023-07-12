const dateTime = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hour = today.getHours() < 10 ? '0' + today.getHours(): today.getHours();
    let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes(): today.getMinutes();
    let second = today.getSeconds() < 10 ? '0' + today.getSeconds(): today.getSeconds();

    return year + '-' + month  + '-' + day + "T" + hour + ":" + minutes + ":" + second ;
};

/**
 * 로그인 함수
 * @returns 
 */
function login() {
    if(!localStorage.getItem('nowUser')){
        localStorage.setItem('nowUser','');
    }
        
    let id = document.getElementById('id').value;
    let pw = document.getElementById('pw').value;
    let items = JSON.parse(localStorage.getItem('user'));
    let isCorrectId = false;

    for(let idx in items){
        if(id == items[idx].usrId && pw == items[idx].usrPw ){
            localStorage.setItem('nowUser',JSON.stringify(items[idx]));
            location.href='/';
            isCorrectId = true;
            return true;
        } 
    }
    if(!isCorrectId) alert("아이디 혹은 비밀번호가 올바르지 않거나 가입되지 않은 아이디 입니다.")
}

/**
 * 아이디 / 비밀번호 찾기 페이지 이동 함수
 */
function findIdPw() {
    console.log("아이디 / 비번 찾기 기능 구현 중입니댜.")
    alert("아이디 / 비번 찾기 기능 구현 중입니댜.")
}

/**
 * 엔터키 클릭 시 로그인 함수 호출
 */
document.addEventListener('keydown', event => {
    if(event.key === "Enter"){
        login();
    }
});

/**
 * 비밀번호 보기 숨김 버튼
 */
document.getElementById('showPw').addEventListener('click', event => {
    // console.log('showPw', event)\
    if(document.getElementById('pw').value){
        document.getElementById('showPw').toggleAttribute('active');
    }
    if(document.getElementById('showPw').hasAttribute('active')){
        document.getElementById('showPw').setAttribute('class', 'fa fa-eye-slash fa-lg');
        document.getElementById('pw').setAttribute('type','text');
    } else {
        document.getElementById('showPw').setAttribute('class', 'fa fa-eye fa-lg');
        document.getElementById('pw').setAttribute('type','password');
    }
})

/**
 * 
 * @param {*} event 
 * 로그인 후 메인페이지에서 뒤로가기 시 로그인 페이지로 진입하는것을 막음. 
 */
window.onpageshow = (event) => {
    if( event.persisted || (window.performance && window.performance.navigation.type == 2) ){
        window.location.href = "/"
    }
}