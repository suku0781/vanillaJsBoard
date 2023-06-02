

function nextStep(id) {
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
        if( document.getElementById('inpId').value != "" && document.getElementById('inpId').value != null && 
            document.getElementById('inpPw').value != "" && document.getElementById('inpPw').value != null &&
            document.getElementById('inpNickname').value != "" && document.getElementById('inpNickname').value != null &&
            document.getElementById('inpEmail').value != "" && document.getElementById('inpEmail').value != null) {
                console.log('secondStep pass', id);
                document.getElementById(id).style.display = 'none';
                document.getElementById('joinStep3').style.display = '';
        } else {
            alert('모두 입력하십시오.');
        }
        
    } else if(id == 'joinStep3'){
        event.preventDefault();
        debugger;
        if(document.getElementById('authCode').value != "" && document.getElementById('authCode').value != null ){
            location.href='login.html'
            console.log("test");

        } else {
            alert('이메일 인증코드를 입력하십시오.');
        }
    }
}