function idDuplChk(str) {
    event.preventDefault();
    let inpId = document.getElementById('inpId').value;
    let items = JSON.parse(localStorage.getItem('user'));

    if(document.getElementById('inpId').value == ''){
        alert('아이디를 입력하십시오.');
        document.getElementById('usableInpId').style.display = "none";
        usableId = "N";
        return false;
    }
    for(let i of items){
        if(i[0] == inpId){
            alert("중복된 아이디 입니다. ");
            document.getElementById('usableInpId').style.display = "none";
            return false;
        } else {
            document.getElementById('usableInpId').style.display = "";
        }
    }

}

function nextStep(id) {
    if(!localStorage.getItem('user')){
        localStorage.setItem('user','[]');
    }

    if(id == 'joinStep1'){
        event.preventDefault();
        console.log('fistStep pass', id)
        if(document.getElementById('agreeYn').checked){
            console.log('checked')
            document.getElementById(id).style.display = 'none';
            document.getElementById('joinStep2').style.display = '';
        }else {
            alert("이용약관에 동의하여주십시오.");
            return;
        }
        
    } else if(id == 'joinStep2'){
        event.preventDefault();

        let usrId = document.getElementById('inpId').value;
        let usrPw = document.getElementById('inpPw').value;
        let usrNickName = document.getElementById('inpNickname').value;
        let usrEmail = document.getElementById('inpEmail').value;
        let authYn = "N";
        let item = {usrId, usrPw, usrNickName,usrEmail, authYn};
        let oldData = JSON.parse(localStorage.getItem('user'));    
        if(validationChk(usrId, usrPw, usrNickName, usrEmail) ) {
            oldData.push(item);
            
            alert("등록되었습니다. 이메일 인증하여 가입 완료해주십시오.");

            document.getElementById(id).style.display = 'none';
            document.getElementById('joinStep3').style.display = '';
            localStorage.setItem('user', JSON.stringify(oldData));
        } else {
            alert("가입 실패하였습니다. \n아이디 중복체크를 하지 않았거나 올바른 입력값을 입력하십시오.")
        }
        
        
        
    } else if(id == 'joinStep3'){
        event.preventDefault();
        // debugger;
        if(document.getElementById('authCode').value != "" && document.getElementById('authCode').value != null ){
            alert('가입되었습니다. 로그인 후 이용해주십시오.');
            location.href='login.html';
        } else {
            alert('이메일 인증코드를 입력하십시오.');
        }
    }
}


function validationChk(id, pw, nickname, email){
    console.log(id, pw, nickname, email);
    if(id != null && id != "" && pw != null && pw != "" && nickname != null && nickname != "" && email != null && email != ""){
        if( validId(id) && validPw(pw) && validNickname(nickname) && validEmail() ){
            return true;
        } else {
            return false;
        }
    } else {
        alert('입력값을 모두 입력하십시오.');
        return false;
    }
}

function validId(id){
    //특수기호가 있는지 확인
    var spe = id.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    // 한글이 있는지 확인
    var korean = id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi);

    if((id.length < 8) || (id.length > 20)){
        alert("아이디는 8자리 ~ 20자리 이내로 입력하십시오.");
        return false;
    }
    if (id.search(/₩s/) != -1) {
        alert("아이디는 공백없이 입력해주세요.");
        return false;
    }
    if (spe > 0 || korean > 0) {
        alert("아이디는 영문,숫자만 입력해주세요.");
        return false;
    }

    return true;
}

function validPw(pw){
    // 한글이 있는지 확인
    var korean = pw.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi);

    if((pw.length < 8) || (pw.length > 20)){
        alert("비밀번호는 8자리 ~ 20자리 이내로 입력하십시오.");
        return false;
    }
    if (pw.search(/₩s/) != -1) {
        alert("비밀번호는 공백없이 입력해주세요.");
        return false;
    }
    if (korean > 0) {
        alert("비밀번호는 영문 + 숫자 + 특수기호 조합으로 입력해주세요.");
        return false;
    }

    return true;
}

function validNickname(nickname){
    //특수기호가 있는지 확인
    var spe = nickname.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if((nickname.length < 1) || (nickname.length > 10)){
        alert("닉네임은 한글, 영문, 숫자 조합으로 10자 이내로 입력하십시오.");
        return false;
    }
    if (nickname.search(/₩s/) != -1) {
        alert("닉네임은 공백없이 입력해주세요.");
        return false;
    }
    if (spe > 0) {
        alert("닉네임에 특수기호는 입력할 수 없습니다.");
        return false;
    }

    return true;
}

function validEmail() {
    let form = document.getElementById('joinStep2');
    let email = document.getElementById('inpEmail').value;
    let text = document.getElementById('emailText');

    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(pattern)){
        form.classList.add("valid");
        form.classList.remove("invalid");
        text.innerHTML = 'Your Email Address is valid';
        text.style.color = '#00ff00';

        return true;
    } else {
        form.classList.add("valid");
        form.classList.remove("invalid");
        text.innerHTML = 'Please Enter the Valid Email Address';
        text.style.color = '#ff0000';

        if(email == ""){
            form.classList.remove("valid");
            form.classList.remove("invalid");
            text.innerHTML = "";
            text.style.color = "#00ff00";
        }
        return false;
    }
}