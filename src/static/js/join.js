function gotoLogin() {
    location.href='login'
}

/**
 * form을 3개로 만들어 단계별로 표시한다.
 * */   
function nextStep(id) {
    if(!localStorage.getItem('user')){
        localStorage.setItem('user','[]');
    }

    if(id == 'joinStep1'){
        event.preventDefault();

        if(document.getElementById('agreeYn').checked){
            console.log('checked')
            document.getElementById(id).style.display = 'none';
            document.getElementById('joinStep2').style.display = '';
        } else {
            alert("이용약관에 동의하여주십시오.");
        }
        
    } else if(id == 'joinStep2'){
        event.preventDefault();

        let usrId = document.getElementById('inpId').value;
        let usrPw = document.getElementById('inpPw').value;
        let usrNickName = document.getElementById('inpNickname').value;
        let usrEmail = document.getElementById('inpEmail').value;
        let item = {usrId, usrPw, usrNickName,usrEmail};
        let oldData = JSON.parse(localStorage.getItem('user'));    

        if( validationChk(usrId, usrPw, usrNickName, usrEmail) ) {
            alert("이메일 인증하여 가입 완료해주십시오.");

            oldData.push(item); // 로컬스토리지에 입력값을 넣음.
            localStorage.setItem('user', JSON.stringify(oldData));

            document.getElementById(id).style.display = 'none';
            document.getElementById('joinStep3').style.display = '';
            
            //메일 인증코드를 보냄.
            sendAuthCode(); 
        } else {
            console.log("가입 실패하였습니다. \n아이디 중복체크를 하지 않았거나 올바른 입력값을 입력하십시오.")
        }

    } else if(id == 'joinStep3'){
        event.preventDefault();

        if(document.getElementById('authCode').value == ""){
            alert('인증코드를 입력하십시오.');
        } else if(document.getElementById('correct') == null) {
            alert('인증코드가 일치하지 않습니다.');
        } else {
            alert('가입되었습니다. 로그인 후 이용해주십시오.');
            location.href='login';
        }

    }   
}

function init(){
    //회원가입 첫번째의 약관 텍스트를 불러온다.
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/terms', false);
    xmlhttp.send();

    //파일 로드 성공 시 파일에서 읽은 텍스트 agreeBox에 담음.
    if(xmlhttp.status == 200) {
        // debugger
        document.getElementById('agreeBox').value = xmlhttp.responseText;
    }


    nextStep();

}

init();

/**
 * 입력값 빈칸 있는지 체크
 * 빈칸 없다면 각 요소별로 유효성검사
 */
function validationChk(id, pw, nickname, email){
    console.log(id, pw, nickname, email);
    if(id != null && id != "" && pw != null && pw != "" && nickname != null && nickname != "" && email != null && email != ""){
        if( validId(id) && duplChk(id) && validPw(pw) && validNickname(nickname) && duplChk(nickname, 1) && validEmail() ){
            return true;
        } else {
            return false;
        }
    } else {
        alert('입력값을 모두 입력하십시오.');
        return false;
    }
}

/**
 * 아이디가 중복되는지 체크하는 함수
*/
function duplChk(param, no) { // no : 0 -> 아이디 중복 체크 버튼을 눌렀을 때 , no : 1 -> 닉네임 중복 체크, no : '' -> validationChk함수 호출 
    event.preventDefault();
    console.log("test")
    // let inpId = document.getElementById('inpId').value;
    let items = JSON.parse(localStorage.getItem('user'));
    let target = '아이디';
// debugger
    if(no == 0) param = param.previousElementSibling.value;
    if(no == 1) target = '닉네임';

    if(items.length !== 0){
        let duplChk = false;

        items.forEach((item) => {
            if(no == 1){
                if(item.usrNickName == param) duplChk = true;
            } 
            if(no == 0 || no == undefined){
                if(item.usrId == param) duplChk = true;
            }
        })

        if(duplChk){
            alert("중복된 " + target + " 입니다.");
            if(no !== 1) document.getElementById('usableInpId').style.display = "none";
            return false;
        } else {
            if(no !== 1){
                if(validId(param)){
                    document.getElementById('usableInpId').style.display = "";
                    return true;
                } else {
                    return false;
                }
                
            } else {
                if(validNickname(param)){
                    return true;
                } else {
                    return false;
                }
            }
        }
    } else {
        if(no !== 1){
            if(validId) {
                document.getElementById('usableInpId').style.display = "";    
                return true;
            } else {
                document.getElementById('usableInpId').style.display = "none";
                return false;
            }
        } else {
            if(validNickname) {
                return true;
            } else {
                return false;
            }
        }
    }
}

/**
 * 
 * @returns 이메일인증코드 발송 함수
 * 비동기로 하기때문에 async - await로 설정
 * 함수 내 try - catch문이 fetch().then().then()를 대신함.
 */
async function sendAuthCode(resend) {
    const userData = JSON.parse(localStorage.getItem('user'))[JSON.parse(localStorage.getItem('user')).length-1]; // 회원가입할경우 스택형태로 쌓이기때문에 마지막인덱스 유저를 불러옴
    console.log("userData",userData)
    let code = '';
    let result = false;
    
    try {
        const res = await fetch('http://127.0.0.1:8080/mail',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        const data = await res.json()
        code = data.code;
        result = data.result;
        
    }catch (err) {
        console.log(err)
    }
    
    // console.log(result, code)
    // debugger;

    auth(result, code, resend);
}


/**
 * 
 * @param {*} result 비동기로 이메일 인증코드 발송이 성공했다면 true, 아니면 false
 * @param {*} code 발송한 인증코드
 */
function auth(result, code, resend) {
    if(result){
        // 재전송할 경우 타이머는 리셋되지 않음.
        if(!resend){
            console.log("첫전송.")
            timer(); //3분 타이머 설정.
        } else {
            console.log("재전송.")
        }
        
        // 메일 발송한 이메일 인증코드가 일치하면 "인증되었습니다." 문구 표시
        document.getElementById('authCode').addEventListener('input', (e) => {
            if(document.getElementById('authCode').value === code) {
                console.log("correct!")
                
                document.getElementById('emailAuthBox').insertAdjacentHTML('afterend', '<p id="correct">인증코드가 일치합니다.</p>');
                document.getElementById('resetTimer').setAttribute('disabled', true);
                
            } else {
                console.log("incorrect!")

                document.getElementById('correct') ? document.getElementById('correct').remove(): '';
                JSON.stringify(document.getElementById('resetTimer').getAttributeNames('disable')).includes("disabled") ? document.getElementById('resetTimer').removeAttribute('disabled') : '';
                
            }
        })
    } else {
        alert("인증코드 발송 실패");
    }
}

/**
 * 3분 타이머 설정 함수]
 * */
function timer() {
    let timer = null; 
    let isRunning = false;
    let display = document.getElementById('timer');
    let leftTime = 180;
    
    document.getElementById('timer').style.display = '';

    //재전송버튼 클릭시  이벤트(인증코드 재전송, timer 초기화)
    document.getElementById('resetTimer').addEventListener('click', () => {
        // debugger;
        if(isRunning){
            alert("이메일 인증코드가 재전송되었습니다.");
            sendAuthCode(resend = true);

            clearInterval(timer);
            display.innerHTML = "";
            startTimer(leftTime, display);
        } 
    });

    const startTimer = (count, display) => {
        let minutes;
        let seconds;

        timer = setInterval(() => {
            // debugger
            minutes = parseInt(count / 60, 10);
            seconds = parseInt(count % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.innerHTML = minutes + ":" + seconds;
            count--;

            //시간 초과시 사용자 가입 실패처리
            if(count < 0){
                clearInterval(timer);
                console.log("Time Over!");
                display.innerHTML = "over";
                isRunning = false;

                alert('시간 초과되어 가입이 취소되었습니다.');

                JSON.parse(localStorage.getItem('user')).forEach((i, idx) => {
                    let target = JSON.parse(localStorage.getItem('user'))
                    if(idx == JSON.parse(localStorage.getItem('user')).length-1) {
                       target.splice(idx, 1) 
                        localStorage.setItem('user', JSON.stringify(target))
                    }
                })
                
                location.href='/login';

            }
        }, 1000);
        isRunning = true;

    };
    startTimer(leftTime, display);

}

// /**
//  * 
//  * @param {*} event 
//  * 로그인/회원가입 후 메인페이지에서 뒤로가기 시 로그인/회원가입 페이지로 진입하는것을 막음. 
//  */
// window.onpageshow = (event) => {
//     if( event.persisted || (window.performance && window.performance.navigation.type == 2) ){
//         window.location.href = "/"
//     }
// }








/**
 * 
 * @param {*} id 
 * @returns id로 입력받은 값을 유효성검사
 */
function validId(id){
    const speSign = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // 특수기호
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g; // 한글
    const spacing = /\s/g; // 공백

    if((id.length < 8) || (id.length > 20)){
        alert("아이디는 8자리 ~ 20자리 이내로 입력하십시오.");
        return false;
    }
    if (spacing.test(id)) {
        alert("아이디는 공백없이 입력해주세요.");
        return false;
    }
    if (speSign.test(id) || korean.test(id)) {
        alert("아이디는 영문,숫자만 입력해주세요.");
        return false;
    }

    return true;
}



/**
 * 
 * @param {*} pw 
 * @returns pw로 받은 값을 유효성검사
 */
function validPw(pw){
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g; // 한글
    const spacing = /\s/g; // 공백

    if((pw.length < 8) || (pw.length > 20)){
        alert("비밀번호는 8자리 ~ 20자리 이내로 입력하십시오.");
        return false;
    }
    if (spacing.test(pw)) {
        alert("비밀번호는 공백없이 입력해주세요.");
        return false;
    }
    if (korean > 0) {
        alert("비밀번호는 영문 + 숫자 + 특수기호 조합으로 입력해주세요.");
        return false;
    }

    return true;
}

/**
 * 
 * @param {*} nickname 
 * @returns 닉네임으로 받은 값을 유효성검사
 */
function validNickname(nickname){
    const speSign = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // 특수기호
    const spacing = /\s/g; // 공백

    if((nickname.length < 1) || (nickname.length > 10)){
        alert("닉네임은 한글, 영문, 숫자 조합으로 10자 이내로 입력하십시오.");
        return false;
    }
    if (spacing.test(nickname)) {
        alert("닉네임은 공백없이 입력해주세요.");
        return false;
    }
    if (speSign.test(nickname)) {
        alert("닉네임에 특수기호는 입력할 수 없습니다.");
        return false;
    }

    return true;
}

/**
 * 
 * @returns 이메일 유효성검사
 */
function validEmail() {
    let email = document.getElementById('inpEmail').value;
    let text = document.getElementById('emailText');
    const pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    
    if(email.match(pattern)){ // match, search, test 차이
        text.innerHTML = 'Your Email Address is valid';
        text.style.color = '#00ff00';

        return true;
    } else {
        text.innerHTML = 'Please Enter the Valid Email Address';
        text.style.color = '#ff0000';

        if(email == ""){
            text.innerHTML = "";
            text.style.color = "#00ff00";
        }
        return false;
    }
}