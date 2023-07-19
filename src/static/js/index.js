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

//글쓰기 페이지로 이동(글 수정, 글 조회)
function createRowPg(postNo) {
    // debugger
    let sendData = 'postNo='+postNo;
    const nowUser = (localStorage.getItem('nowUser')) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : '';
    const board = localStorage.getItem('board');
    
    if(postNo == undefined){ 
        sendData = 'newWrite';
    } 

    if(nowUser && postNo == undefined){ // 글 쓰기
        sendData = 'newWrite';
        location.href=`write?${sendData}`;
    }   
// debugger
    if(nowUser && JSON.parse(board)[postNo].writer == nowUser){ // 본인 게시글인경우
        sendData+='/nowUserPost';
        location.href=`write?${sendData}`;
    } else if(postNo !== undefined) { // 타인 게시글인 경우
        location.href=`write?${sendData}`;
    } else {
        alert('로그인 후 이용하십시오.')
    }

}

//로그인 버튼 
function loginBtn(elem){
    const nowUser = (localStorage.getItem('nowUser')) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : '';

    //현재 로그인 유무 확인 후 로그인 페이지 이동 또는 로그아웃
    if(nowUser == ''){
        location.href='/login';
    } else {
        localStorage.setItem('nowUser',''); 
        location.href='/';
    }
}


function loadItems(vCnt, srchTarget, srchVal) {
    const items = JSON.parse(localStorage.getItem('board'))
    const nowUser = (localStorage.getItem('nowUser')) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : '';
    const searchItem = (srchVal) ? decodeURIComponent(srchVal) : '';

    //로그인 되어 있는경우 로그인한 사용자 닉네임, logout버튼 표시 
    //로그인 되어있지 않은 경우 login버튼만 표시
    if(nowUser != '' && nowUser != null){
        document.getElementById('whoami').innerText = nowUser;
        document.getElementById('whoami').setAttribute('onclick', 'userInfo(this)')
        document.getElementById('loginBtn').innerText = 'logout';
    } else {
        document.getElementById('whoami').innerText = '';
        document.getElementById('loginBtn').innerText = 'login';
    }

    //만약 로컬스토리지에 user 키값이 없을 경우 생성함. 관리자 계정과 함께 생성.
    if(localStorage.getItem('user') == null) {
        const data = {usrId: "admin", usrPw: "1234", usrNickName: "관리자", usrEmail: "suku0781@gmail.com"};
        const tmpArr = [];
        localStorage.setItem('user','[]');
        tmpArr.push(data);
        localStorage.setItem('user', JSON.stringify(tmpArr));
    }

    // 저장된 게시물이 있다면 
    if(items != null) {
        //pagination button
        const prevBtn = document.getElementById('button_prev');
        const nextBtn = document.getElementById('button_next');
        let html = "";
        let pageNumber = document.getElementById('page_number');
        let currentPage = 1; 
        let recordsPerPage = (vCnt)? vCnt : 10;
        let numPages = Math.ceil(JSON.parse(localStorage.getItem('board')).length / recordsPerPage);

        const tbody = document.querySelector('tbody');
        const srchInfoNotExist = (srchItem) => {
            document.querySelector('input').value = srchItem;
            tbody.innerHTML = `<tr><td colspan='4' style='white-space: nowrap;'>입력한 <strong>` + srchItem + `</strong> 의 결과가 존재하지 않습니다.</td></tr>`
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return false;
        }

        //게시글이 20개 이상일 경우 < > 버튼 보이기
        if(JSON.parse(localStorage.getItem('board')).length > 20){
            prevBtn.style.display = '';
            nextBtn.style.display = '';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        changePage(1, srchTarget, searchItem); // 첫 로딩할때는 디폴트로 1페이지

        // 수를 클릭할 때 해당 페이지네이션으로 이동
        function changePage(page, srchTarget, searchItem) {
            
            let tmpHtml = "";
            
            if(page < 1) page = 1;
            if(page > numPages-1) page = numPages;
            
            tbody.innerHTML = "";
            html = "";
            
            // 검색한 경우 
            if(searchItem){ 
                //디코딩 되었는지 확인 후 안되어있다면 디코딩 하기
                if( searchItem !== decodeURIComponent(searchItem) ) searchItem = decodeURIComponent(searchItem);

                let srchItemCount = 0; // 검색한 키워드가 일치하는 게시글 수를 담는 객체
                let srchIdxArr = [];
                
                //입력값과 일치하는 게시글 title 수를 체크 후 srchItemCount 에 담음
                JSON.parse(localStorage.getItem('board')).forEach((item, idx) => { 
                    if(srchTarget == 'title' && item.title.includes(searchItem)){
                        srchItemCount++; 
                        srchIdxArr.push(idx); 

                    } else if(srchTarget == 'nickname' && item.writer == searchItem){
                        srchItemCount++; 
                        srchIdxArr.push(idx); 
                    }
                });
                
                numPages = Math.ceil(srchItemCount / recordsPerPage);
                
                document.getElementById('srchSubject').value = srchTarget;
                document.getElementById('srchValue').value = searchItem;
                
                // 입력값이 존재하지 않을 경우 '입력한  의 결과가 존재하지 않습니다.' 문구 출력 
                if(srchIdxArr == '' && srchItemCount == 0) return srchInfoNotExist(searchItem);

                for(let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) ; i++){
                    let tmpNum = srchIdxArr[i];
                    if(items[tmpNum]){
                        // debugger
                        tmpHtml += `<tr id="target" onclick="">`;
                        tmpHtml += `<td></td>`;
                        tmpHtml += `<td id="post" onclick="createRowPg(`+ tmpNum +`)">`+items[tmpNum].title+`</td>`;
                        tmpHtml += `<td onclick="userInfo(this)" style="cursor:pointer;">`+items[tmpNum].writer+`</td>`;
                        
                        //만약 게시글을 작성한 년도가 현재 년도와 같다면 월-일 만 표시
                        if(items[tmpNum].time.split("T")[0].split("-")[0] == dateTime().split('-')[0]) {
                            tmpHtml += `<td>`+items[tmpNum].time.split("T")[0].split("-").slice(1).join('.')+`</td>`;
                        } else {
                            tmpHtml += `<td>`+items[tmpNum].time.split("T")[0].replaceAll('-', '.')+`</td>`;
                        }
                        tmpHtml += `</tr>`;

                        //검색했을 경우 No를 검색 후 결과총 갯수에서 -1 할 수 있게끔 함.
                        tmpHtml = tmpHtml.slice(0, tmpHtml.indexOf('<td></td>')+4 ) + ( (srchItemCount--) - ((page-1) * recordsPerPage) ) + tmpHtml.slice(tmpHtml.indexOf('<td></td>')+4)

                        //한개 게시글을 html에 넣음.
                        html += tmpHtml;

                        // 초기화
                        tmpHtml = '';
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
                
            // 검색하지 않은 경우
            } else { 
                let itemCount = JSON.parse(localStorage.getItem('board')).length
                
                //게시글 수 만큼 반복하여 viewCnt 수만큼 게시글 노출
                for(let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) ; i++){
                    if(items[i]){
                        tmpHtml += `<tr id="target" onclick="">`;
                        tmpHtml += `<td>`+ ( (itemCount--) - ((page-1) * recordsPerPage) ) +`</td>`;
    
                        for(let item in items[i]){
                            if(item == 'title'){
                                tmpHtml += `<td id="post" onclick="createRowPg(`+ i +`)">`+items[i].title+`</td>`;
                            } else if(item == 'contents'){ 
                                //목록에서 content 숨김.
                            } else if(item == 'time'){
                                //만약 게시글을 작성한 년도가 현재 년도와 같다면 월-일 만 표시
                                if(items[i].time.split("T")[0].split("-")[0] == dateTime().split('-')[0]) {
                                    tmpHtml += `<td>`+items[i].time.split("T")[0].split("-").slice(1).join('.')+`</td>`;
                                } else {
                                    tmpHtml += `<td>`+items[i].time.split("T")[0].replaceAll('-', '.')+`</td>`;
                                }
                                
                            } else {
                                tmpHtml += `<td onclick="userInfo(this)" style="cursor:pointer;">`+items[i][item]+`</td>`;
                            }
                        }
                        tmpHtml += `</tr>`;
                    }
                }
                html += tmpHtml;
            }

            tbody.innerHTML = html;
        
            //페이지네이션 숫자 초기화 후 numPages만큼 반복하면서 수를 추가함.
            pageNumber.innerText = '';
            // debugger
            for(let i = 1 ; i <= numPages ; i++){
                // debugger
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
                let srchItem = '';
                // debugger
                // 검색했을 경우
                if(location.search) srchItem = location.search.split('?')[1].split('&')[1].slice(7);

                // 현재 페이지 넘버가 클릭한 페이지와 다를때만 페이지 이동 할 수 있게 
                if(currentPage !== Number(e.target.textContent)) {
                    currentPage = e.target.textContent; 
                    changePage(currentPage, srchTarget, srchItem);
                }
            }
        })
        

       
    }

}

function userInfo(elem) {
    
    let sendData = (localStorage.getItem('nowUser') ) ? "readUserInfo="+elem.innerText : "readUserWrited="+elem.innerText;
    
    //본인 정보조회일 경우
    if( localStorage.getItem('nowUser') && elem.innerText == JSON.parse(localStorage.getItem('nowUser')).usrNickName) sendData = "myInfo";

    location.href = `userInfo?`+sendData;
}

function init() {
    // debugger
    const viewCount = document.querySelector('#viewCnt');
    
    // 페이지에 표시된 게시글 수 조정
    viewCount.addEventListener('change', () => {
        // console.log('viewCnt',viewCnt);
        loadItems(viewCount.value);
    });

    if(location.search){
        // const receiveDataValue = location.search.split('search=')[1];
        const receiveSrchTarget = location.search.split('?')[1].split('&')[0].slice(8); // 글제목 검색, 닉네임 검색 value값
        const receiveSrchValue = location.search.split('?')[1].split('&')[1].slice(7); // 검색어

        loadItems(viewCount.value,receiveSrchTarget, receiveSrchValue);
    } else {
        loadItems();

    }
    window.addEventListener('hashchange', hashHandler, false);
    

}

/**
 * 검색 함수 
 * 입력값을 sendData에 넣고 페이지를 리로드할때 sendData를 붙여서 
 * 구성할때 입력값이 포함된 제목의 글만 보일수있도록 함. 
 * @param {*} el 
 * @returns 
 */
function search() {
    event.preventDefault();
    const subject = document.getElementById('srchSubject').value;
    const value = document.getElementById('srchValue').value;
    const sendData = 'subject='+subject+'&search='+value;

    if(!validationChk(value)){
        return false;
    }
    
    return location.href=`?${sendData}`;
}

function validationChk(srchTxt){
    if(!srchTxt) {
        alert("검색어를 입력하십시오."); 
        return false;
    }
    if(srchTxt.length == 1 && ( srchTxt.includes(' ') )){ // validation check 함수 로직 짜야함.(직접)
        alert("검색어를 입력하십시오.")
        return false;
    }

    return true;
}

//이전 페이지가 로그인 페이지 일 경우 페이지 이동을 막는 함수.
function hashHandler() {
    if(document.referrer === "/login"){
        window.location.href="/"
    }
}


init();
