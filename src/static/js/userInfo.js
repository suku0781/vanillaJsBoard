const dateTime = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hour = today.getHours() < 10 ? '0' + today.getHours(): today.getHours();
    let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes(): today.getMinutes();
    let second = today.getSeconds() < 10 ? '0' + today.getSeconds(): today.getSeconds();

    return year + '-' + month  + '-' + day + "T" + hour + ":" + minutes ;
};

function loadUserInfo(permission) {
    const tabs = document.querySelectorAll('ul.tabs li');
    
    if(permission == 2) userInfo(permission)
    
    writedInfo(permission);
    writedInfo(permission, 'comment');
    
    for(let tab of tabs){
        tab.addEventListener('click', (event) => {
            let nowTab = document.getElementsByClassName('current')[0].dataset.tab;
            let tabId = event.target.getAttribute('data-tab'); // 클릭한 탭

            
            while(nowTab !== tabId && document.getElementsByClassName('current').length !== 0){
                document.getElementsByClassName('current')[0].classList.remove('current')
                
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
function writedInfo(permission, whatsInfo){
    const userNickname = (permission == 2) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : location.search.split('?')[1].split('=')[1];
    
    loadItems(userNickname, whatsInfo);
    
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
            document.querySelectorAll('.current').forEach(item => { // 회원정보탭 가리기
                item.style.display = 'none';
                item.classList.remove('current');
                item.nextElementSibling.className += ' current'
            })
        break;
        case "readUserInfo": // 로그인 한 경우
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

function loadItems(userNickname, whatsInfo) {

    // 로컬스토리지에서 whatsInfo 의 값을 기준으로 가져옴 값이 없읅 경우 "board" 로 가져옴
    // whatsInfo = whatsInfo||"board";
    const items =  JSON.parse(localStorage.getItem(whatsInfo||"board"));
    const searchItem = (userNickname) ? decodeURIComponent(userNickname) : '';

    console.log(whatsInfo);
    console.log(items);

    // 저장된 게시물이 있다면 
    if(items != null) {
        //pagination button
        let html = "";
        let pageNumber = document.getElementById('page_number');
        let currentPage = 1; 
        let recordsPerPage = 10;
        let numPages = Math.ceil(JSON.parse(localStorage.getItem('board')).length / recordsPerPage);
        const prevBtn = document.getElementById('button_prev');
        const nextBtn = document.getElementById('button_next');
        const srchInfoNotExist = (whatsInfo) => {
            // parameter인 whatsInfo는 댓글기록을 불러올때만 존재함. 그외일 경우 null임.
            // whatsInfo가 true 일 경우 댓글 정보를 불러옴.
            if(whatsInfo){
                document.querySelector('#list').innerHTML = `<tr><td colspan='4' style='white-space: nowrap;'>작성한 게시물이 없습니다.</td></tr>`;
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                document.querySelector('#commentList').innerHTML = `<tr><td colspan='4' style='white-space: nowrap;'>작성한 댓글이 없습니다.</td></tr>`;
                (whatsInfo+prevBtn).style.display = 'none';
                (whatsInfo+nextBtn).style.display = 'none';
            }
            

            return false;
        };


        //게시글이 20개 이상일 경우 < > 버튼 보이기
        if(items.length > 20){
            prevBtn.style.display = '';
            nextBtn.style.display = '';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        changePage(1, searchItem); // 첫 로딩할때는 디폴트로 1페이지

        // 수를 클릭할 때 해당 페이지네이션으로 이동
        function changePage(page, searchItem) {
            if(page < 1) page = 1;
            if(page > numPages-1) page = numPages;
            
            html = "";
            
            //디코딩 되었는지 확인 후 안되어있다면 디코딩 하기
            if( searchItem !== decodeURIComponent(searchItem) ) searchItem = decodeURIComponent(searchItem);

            let srchItemCount = 0; // 검색한 키워드가 일치하는 게시글 수를 담는 객체
            let srchIdxArr = [];

            debugger
            
            //입력값과 일치하는 게시글 title 수를 체크 후 srchItemCount 에 담음
            items.forEach((item, idx) => { 
                    if(location.search.includes('myInfo')){
                        //작성 글, 댓글 기록 탐색 
                        if(item.writer == JSON.parse(localStorage.getItem('nowUser')).usrNickName || item.nickname == searchItem){
                            srchItemCount++; 
                            srchIdxArr.push(item.postUniqNo||item.postNo); 
                        }
                    } else {
                        if(item.writer == searchItem || item.nickname == searchItem){
                            srchItemCount++; 
                            srchIdxArr.push(item.postUniqNo||item.postNo); 
                        }
                    }
            });
            
            numPages = Math.ceil(srchItemCount / recordsPerPage);
            
            // 입력값이 존재하지 않을 경우 '입력한  의 결과가 존재하지 않습니다.' 문구 출력 
            if(srchIdxArr == '' && srchItemCount == 0) {
                let whatsReturn = '';
                if(whatsInfo) {
                    whatsReturn = srchInfoNotExist();
                } else {
                    whatsReturn = srchInfoNotExist(whatsInfo);
                }
                return whatsReturn;
            }

            for(let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) ; i++){
                let tmpNum = srchIdxArr.shift();
                for(let j = 0 ; j < items.length ; j++){

                    if(whatsInfo == "comment" ? (tmpNum && items[j].postNo == tmpNum) : (tmpNum && items[j].postUniqNo == tmpNum) ){
                        let tmpHtml = "";
                        tmpHtml += `<tr id="target" onclick="">`;
                        tmpHtml += `<td></td>`;
                        console.log(whatsInfo);
                        
                        if(whatsInfo){ // 작성댓글 클릭 시 이동하는 페이지 
                            tmpHtml += `<td id="post" onclick="createRowPg(`+ tmpNum +`, 'comment')">`+ items[j].content +`</td>`;
                        }else { // 작성글 클릭 시 이동하는 페이지 
                            tmpHtml += `<td id="post" onclick="createRowPg(`+ tmpNum +`)">`+ items[j].title +`</td>`;
                        }
                        
                        if(items[j].time.split("T")[0].split("-")[0] == dateTime().split('-')[0]) {
                            tmpHtml += `<td>`+items[j].time.split("T")[0].split("-").slice(1).join('.')+`</td>`;
                        } else {
                            tmpHtml += `<td>`+items[j].time.split("T")[0].replaceAll('-', '.')+`</td>`;
                        }
                        tmpHtml += `</tr>`;
    
                        if(whatsInfo){
                            tmpHtml = tmpHtml.slice(0, tmpHtml.indexOf('<td></td>')+4 ) + ( items[j].commentNumber ) + tmpHtml.slice(tmpHtml.indexOf('<td></td>')+4)
                        } else {
                            //검색했을 경우 No를 검색 후 결과총 갯수에서 -1 할 수 있게끔 함.
                            tmpHtml = tmpHtml.slice(0, tmpHtml.indexOf('<td></td>')+4 ) + ( (srchItemCount--) - ((page-1) * recordsPerPage) ) + tmpHtml.slice(tmpHtml.indexOf('<td></td>')+4)
    
                        }
    
                        //한개 게시글을 html에 넣음.
                        html += tmpHtml;
                    }
                }
                
            }

            //검색된 게시글이 20개 이상일 경우에만 < > 버튼 보이기
            if(srchItemCount > 20){
                prevBtn.style.display = '';
                nextBtn.style.display = '';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
                
            if(whatsInfo) {
                document.querySelector('#commentList').innerHTML = html   
            } else {
                document.querySelector('#list').innerHTML = html;
            }
            
        
            //페이지네이션 숫자 초기화 후 numPages만큼 반복하면서 수를 추가함.
            pageNumber.innerText = '';
            for(let i = 1 ; i <= numPages ; i++){
                if(i == currentPage){
                    pageNumber.innerHTML += `<span class='clickPageNumber' style='text-decoration: underline'>` + i + `</span>`;  
                } else {
                    pageNumber.innerHTML += `<span class='clickPageNumber'>` + i + `</span>`;
                }
            }


        }

        prevBtn.addEventListener('click', () => {
            if(currentPage > 1){
                currentPage--;
                changePage(currentPage);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if(currentPage < numPages){
                currentPage++;
                changePage(currentPage);
            }
        });

        document.addEventListener('click', (e) => {
            if(e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")){
                const userNickname = location.search.split('?')[1].split('=')[1];
                // 현재 페이지 넘버가 클릭한 페이지와 다를때만 페이지 이동 할 수 있게 
                if(currentPage !== Number(e.target.textContent)) {
                    currentPage = e.target.textContent; 
                    changePage(currentPage, userNickname);
                }
            }
        })
        

       
    }

}

//글쓰기 페이지로 이동(글 수정, 글 조회)
function createRowPg(postUniqNo, whatsInfo) {
    
    // const nowUser = (localStorage.getItem('nowUser')) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : '';
    const nowUser = JSON.parse((localStorage.getItem('nowUser')))||'';
    const board = localStorage.getItem('board');
    let sendData = 'postUniqNo=' + postUniqNo;

    JSON.parse(board).forEach( (item, idx) => {
        if(nowUser && JSON.parse(board)[idx].writer == nowUser){
            sendData+='/nowUserPost';
        } else if(JSON.parse(board)[idx].postUniqNo !== undefined){
            location.href=`write?${sendData}`;
        }
    })

     



    // for(let i = 0 ; i < JSON.parse(board).length ; i++) {
    //     if(whatsInfo){
    //         let sendData = 'postUniqNo=' + postUniqNo;
    //         if(nowUser && JSON.parse(board)[i].writer == nowUser){
    //             sendData+='/nowUserPost';
    //         } else if(JSON.parse(board)[i].postUniqNo !== undefined){
    //             location.href=`write?${sendData}`;
    //         } 

    //     }else {
    //         let sendData = 'postUniqNo=' + postUniqNo;
    //         if(nowUser && JSON.parse(board)[i].writer == nowUser){
    //             sendData+='/nowUserPost';
    //         } else if(JSON.parse(board)[i].postUniqNo !== undefined){
    //             location.href=`write?${sendData}`;
    //         } 
    //     }
        
    //     break;
    // }

}



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