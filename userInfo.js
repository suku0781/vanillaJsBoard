

function loadUserInfo(permission) {
    const tabs = document.querySelectorAll('ul.tabs li');
// debugger
    (permission >= 2) ? userInfo(permission) : writedInfo(permission);
    for(let tab of tabs){
        tab.addEventListener('click', (event) => {
            let nowTab = document.getElementsByClassName('current')[0].dataset.tab;
            let tabId = event.target.getAttribute('data-tab'); // 클릭한 탭

            let whatIsIt = document.querySelector('li.current').dataset.tab;
            switch(whatIsIt){
                case 'userInfo':
                    if(!document.getElementById('list').hasChildNodes()) {
                        if(permission > 1) userInfo(permission)
                    }
                break;
                case 'scrap':
                    console.log(whatIsIt)
                break;
                case 'writing':
                    console.log(whatIsIt)
                break;
                case 'writingComment':
                    console.log(whatIsIt)
                break;  

            }   
            
            if(nowTab !== tabId) {
                while(document.getElementsByClassName('current').length !== 0){
                    document.getElementsByClassName('current')[0].classList.remove('current')
                }
            }
            event.target.className += ' current';
            document.getElementById(tabId+'Tab').className += ' current';

        })  
    }
}

//사용자 정보를 출력함수
function userInfo(permission){
    const key = Object.keys(JSON.parse(localStorage.getItem('nowUser'))); // 유저 프로퍼티 갯수확인
    const value = JSON.parse(localStorage.getItem('nowUser')); // 유저 프로퍼티 밸류
    const mode = location.search.split('?')[1];
    let html = '';
    
    if(permission > 1 ){
        for(let i = 0 ; i < key.length ; i++){
            // debugger
            html += '<tr>';
            if(mode == 'edit'){
                switch(key[i]){
                    case "usrId":
                        html += '<td>userId</td>'
                        html += '<td style="text-align: left;"><input type="text" id="inpId" disabled="true" style="text-align: left;" value='+value.usrId+'></td>';
                    break;
                    case "usrPw": 
                        html += '<td>userPassword</td>'
                        html += '<td style="text-align: left;"><input type="password" id="inpPw" style="text-align: left;" value='+value.usrPw+'><i id="showPw" class="fa fa-eye fa-lg" style="color:lightgrey;"></i> <br>';
                        html += '<p class="inpRull" style="font-size: 10px; margin: 0;">비밀번호는 영문 + 숫자 + 특수기호 조합으로 8 ~ 20자리를 사용해야 합니다.</p> </td>'
                    break;
                    case 'usrNickName':
                        html += '<td>userNickName</td>'
                        html += '<td style="text-align: left;"><input type="text" id="inpNickname" style="text-align: left;" value='+value.usrNickName+'> <br>';
                        html += '<p id="usableInpNickName" style="font-size: 10px; margin: 0; color: lightskyblue; display:none;">사용가능한 닉네임 입니다. </p></td>'
                    break;
                    case 'usrEmail':
                        html += '<td>userEmail</td>'
                        html += '<td style="text-align: left;"><input type="email" id="inpEmail" style="text-align: left;" value='+value.usrEmail+' onkeydown="validEmail(this.value)"> <br>';
                        html += '<span id="emailText"></span></td>'
                    break;
                }
            } else {
                switch(key[i]){
                    case 'usrId':
                        html += '<td>userId</td>'
                        html += '<td style="text-align: left;">'+value.usrId+'</td>'
                    break;
                    
                    case 'usrPw':
                        html += '<td>userPassword</td>'
                        html += '<td style="text-align: left;">******</td>'
                    break;
                    case 'usrNickName':
                        html += '<td>userNickName</td>'
                        html += '<td style="text-align: left;">'+value.usrNickName+'</td>'
                    break;
                    case 'usrEmail':
                        html += '<td>userEmail</td>'
                        html += '<td style="text-align: left;">'+value.usrEmail+'</td>'
                    break;
                }
            }
        }
        html += '</tr>'
        html += `<button onclick="changeInfo()">`;
        
        (mode == 'edit') ? html += `submit` : html += `editInfo`;
        html += `</button>`;
    
        document.getElementById('userInfoTbl').insertAdjacentHTML("beforeend", html);
    
        if(location.search.split('?')[1] == 'edit') showHidePwBtn();
    }
    
}

// 사용자가 작성한 게시글 출력함수
function writedInfo(permission){


}

    


function changeInfo() {
    const mode = location.search.split('?')[1];
    const sendData = (location.search.split('?')[1] =='edit') ? 'myInfo' :'edit';

    if(mode == 'edit'){
        const userData = JSON.parse(localStorage.getItem('user'));
        const nowUser = JSON.parse(localStorage.getItem('nowUser'));
        const board = JSON.parse(localStorage.getItem('board'));
        let inpPw = document.getElementById('inpPw').value
        let inpNickname = document.getElementById('inpNickname').value
        let inpEmail = document.getElementById('inpEmail').value
        userData.forEach( (item, idx) => {
            // debugger
            if(item.usrId == nowUser.usrId ){
                let validTarget = {};
                if((inpPw == nowUser.usrPw && inpNickname == nowUser.usrNickName && inpEmail == nowUser.usrEmail)){
                    alert("정보 수정사항이 없습니다.")
                    return false;
                } else {
                    if(inpPw !== nowUser.usrPw) validTarget.pw = inpPw
                    if(inpNickname !== nowUser.usrNickName) validTarget.nickname = inpNickname
                    if(inpEmail !== nowUser.usrEmail) validTarget.email = inpEmail
                }

                if(validationChk(validTarget)){
                        userData[idx].usrPw = inpPw;
                        userData[idx].usrNickName = inpNickname;
                        userData[idx].usrEmail = inpEmail;

                        localStorage.setItem('user', JSON.stringify(userData));
                        alert("사용자 정보 수정됨.");
                        
                        JSON.parse(localStorage.getItem('board')).forEach((item, i) => { 
                            if(item.writer == nowUser.usrNickName) board[i].writer = inpNickname 
                        });
                        localStorage.setItem('board', JSON.stringify(board));
                        
                        localStorage.setItem('nowUser', '');
                        localStorage.setItem('nowUser', JSON.stringify(userData[idx]));
                        
                        location.href='/';
                } else {
                    console.log("정보 수정 실패하였습니다. \n중복된 닉네임을 입력하였거나 올바른 입력값을 입력하십시오.")
                }
            }
        })

    } else if(mode == 'myInfo') {
        location.href =`?${sendData}`;  
    }

    
}

/**
 * 비밀번호 보기 숨김 버튼 
 */
function showHidePwBtn(){
    document.getElementById('showPw').addEventListener('click', event => {
        // console.log('showPw', event)\
        if(document.getElementById('inpPw').value){
            document.getElementById('showPw').toggleAttribute('active');
        }
        if(document.getElementById('showPw').hasAttribute('active')){
            document.getElementById('showPw').setAttribute('class', 'fa fa-eye-slash fa-lg');
            document.getElementById('inpPw').setAttribute('type','text');
        } else {
            document.getElementById('showPw').setAttribute('class', 'fa fa-eye fa-lg');
            document.getElementById('inpPw').setAttribute('type','password');
        }
    })
}

// 최초실행함수
function init() {
    const tmpMode = location.search.split('?')[1].split('=')[0];
    let permission = 0; // 0: 로그인 안했을 경우 , 1 : 로그인 후 타인 정보 조회 , 2 : 내정보 조회

    switch(tmpMode){
        case "readUserWrited": // 로그인 안했을 경우
            console.log("로그인 안했음.")

            document.querySelectorAll('.current').forEach(item => { // 회원정보탭 가리기
                item.style.display = 'none';
                item.classList.remove('current');
                item.nextElementSibling.className += ' current'
            })
        break;
        case "readUserInfo": // 로그인 한 경우
            console.log("로그인 햇음. ")
            permission = 1;

            document.querySelectorAll('.current').forEach(item => {
                item.style.display = 'none';
                item.classList.remove('current');
                item.nextElementSibling.className += ' current'
            })
        break;

        case "myInfo":
            console.log("내정보")
            permission = 2;
        break;

        case "edit":
            console.log("내정보 수정")
            permission = 2;
        break;
    }
    loadUserInfo(permission)
    
}



init();



/**
 * 변경한 것만 validation 체크 후 true 리턴 
 */
function validationChk(validTarget){
    const pw = (validTarget.pw) ? validTarget.pw : '';
    const nickname = (validTarget.nickname) ? validTarget.nickname : '';
    const email = (validTarget.email) ? validTarget.email : '';

    if(!pw && !nickname && !email){
        alert('변경 사항이 없습니다.');
        return false; 
    } else {
        if( pw && !validPw(pw) ) return false;
        if( nickname && !validNickname(nickname) ) return false;
        if( nickname && !nickDuplChk(nickname) ) return false;
        if( email && !validEmail(email) ) return false;

        return true;
    }
}

/**
 * 닉네임이 중복되는지 체크하는 함수
*/
function nickDuplChk(nickname) {
    event.preventDefault();

    let inpNick = nickname;
    let items = JSON.parse(localStorage.getItem('user'));
    if(document.getElementById('inpNickname').value == ''){
        alert('닉네임을 입력하십시오.');
        document.getElementById('usableInpNickName').style.display = "none";
        return false;
    }
    if(items.length !== 0){
        let isDuplNick = false;
        items.forEach((item) => {
            if(item.usrNickName == inpNick) isDuplNick = true;
        })

        if(isDuplNick){
            alert("중복된 닉네임 입니다.");
            document.getElementById('usableInpNickName').style.display = "none";
            return false;
        } else {
            if(validNickname(inpNick)){
                document.getElementById('usableInpNickName').style.display = "";
                return true;
            } else {
                return false;
            }
        }

    } else {
        if(validNickname) {
            document.getElementById('usableInpNickName').style.display = "";    
            return true;
        } else {
            document.getElementById('usableInpNickName').style.display = "none";
            return false;
        }
    }
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
    if (korean.test(pw)) {
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
function validEmail(email) {
    const pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    let form = document.querySelector('tbody');
    let text = document.getElementById('emailText');

    if(email.match(pattern)){ // match, search, test 차이
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