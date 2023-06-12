let dateTime;
function createRowTbl(elem, id, cnt) {
    let mkForm = document.getElementById("mkForm");
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hour = today.getHours() < 10 ? '0' + today.getHours(): today.getHours();
    let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes(): today.getMinutes();
    dateTime = year + '-' + month  + '-' + day + "T" + hour + ":" + minutes ;

    document.getElementById("createTime").value = dateTime;

    if(elem == "update" && id == "target"){

        if(mkForm.style.display == "none"){
            mkForm.style.display = "";
            // debugger;
            document.getElementById('createList').innerText = "cancel";
            document.getElementById('no').innerText = cnt+1;
            document.getElementById('titleInp').value = JSON.parse(localStorage.getItem('board'))[cnt][0];
            document.getElementById('contentInp').value = JSON.parse(localStorage.getItem('board'))[cnt][1];
            document.getElementById('writer').innerText = JSON.parse(localStorage.getItem('board'))[cnt][2];
            document.getElementById('createTime').value = JSON.parse(localStorage.getItem('board'))[cnt][3];
            document.getElementById('delete').style.display = "";
        } else {
            mkForm.style.display = "none";
            document.getElementById('createList').innerText = "makeList";
        }
        if(localStorage.getItem('nowUser') ) {
            if(localStorage.getItem('nowUser') == JSON.parse(localStorage.getItem('board'))[cnt][2]){
                document.getElementById('btnBox').style.display='';
            } else {
                document.getElementById('btnBox').style.display='none';
            }
        } else {
            document.getElementById('btnBox').style.display='none';
        }
    } else {
        //makeList버튼 클릭 시 이벤트
        if(!localStorage.getItem('nowUser') && document.getElementById('createList').innerText != 'cancel' ) {
            alert('로그인 후 이용하십시오.'); 
            return false;
        }

        if(mkForm.style.display == "none"){
            mkForm.style.display = "";

            if(document.getElementById('btnBox').style.display == 'none'){
                document.getElementById('btnBox').style.display = '';
            }

            elem.innerText = "cancel";
            
            if( JSON.parse(localStorage.getItem('board')) == null){
                document.getElementById('no').innerText = 0;
            } else {
                document.getElementById('no').innerText = (JSON.parse(localStorage.getItem('board')).length)+1 ;
            }
            
            document.getElementById('titleInp').value = "";
            document.getElementById('contentInp').value = "";
            document.getElementById('createTime').value = dateTime;
            document.getElementById('delete').style.display = "none";

        } else {
            mkForm.style.display = "none";
            elem.innerText = "makeList";
        }
    }
    
}

function createRowPg () {
    location.href="writeList.html";
}

let originData = [];
function submitForm() {
    let formCnt = (document.getElementById('mkForm').children[1].innerText)-1;
    let title = document.getElementById("titleInp").value;
    let contents = document.getElementById("contentInp").value;
    let createTimeDate = document.getElementById("createTime").value;
    let nowUser = localStorage.getItem('nowUser');
    let item = {title, contents, nowUser, createTimeDate};
    let oldData = JSON.parse(localStorage.getItem('board'));
    let map = new Map();

    // debugger;
    if(localStorage.getItem('board') == null){
        localStorage.setItem('board', item);
    }

    if( oldData == null ){
        originData.push(item);
        localStorage.setItem('board', JSON.stringify(originData));
    } else if( oldData[formCnt] ){ // 수정
        // debugger;
        let tmpOldData1 = oldData[formCnt][0]; // title
        let tmpOldData2 = oldData[formCnt][1]; // content
        let tmpOldData3 = oldData[formCnt][3]; // datetime

        oldData[formCnt][0] = title;
        oldData[formCnt][1] = contents;

        //만약 날짜를 수정했다면 수정된 날짜를 아니면 현재 날짜를 저장
        (createTimeDate != oldData[formCnt][3]) ? oldData[formCnt][3] = createTimeDate : oldData[formCnt][3] = dateTime;
        
        if( tmpOldData1 == oldData[formCnt][0] && tmpOldData2 == oldData[formCnt][1]){
            alert("수정사항 없음.");
            return false;
        } else {
            if(title == "" || contents == ""){
                alert("title 혹은 contents 입력사항 없음.");
                return false;
            } else {
                alert("글 수정됨.");

            }
        }
        localStorage.setItem('board', JSON.stringify(oldData));
    } else { // 등록
        if( title == "" || contents == "" ){
            alert("title 혹은 contents 입력사항 없음.");
        } else {    
            oldData.push(item);
            console.log(oldData, typeof(oldData));
            debugger;
            alert("글 등록됨.");
        }
        // debugger;
        localStorage.setItem('board', JSON.stringify(oldData));
    }
    
    // debugger;
}

function deleteRow(cnt) {
    let target = JSON.parse(localStorage.getItem('board'));
    let cnt2 = (document.getElementById('no').innerText)-1;
    
    if(target.length != cnt2){
        if(confirm("글 삭제?")) {
            target.splice(cnt2, 1);
            localStorage.setItem('board', JSON.stringify( target ));
            location.reload();
        }
    } else {
        alert("실패!");
    }

}

const logoutFunc = () => {
    
};

function loginFunc(elem){
    if(!localStorage.getItem('nowUser')){
        localStorage.setItem('nowUser',''); 
    }
    if(localStorage.getItem('nowUser') == ''){
        location.href='/login.html';
    }
    if(localStorage.getItem('nowUser') != ''){
        localStorage.setItem('nowUser',''); 
        location.href='/';
    }
}


function loadItems(vCnt) {
    const array = [
        {key: 'a', value:'1'},
        {key: 'b', value:'2'}
    ];

    const items = JSON.parse(localStorage.getItem('board'))
    //sort 


    //sort end
    if(localStorage.getItem('nowUser') != '' && localStorage.getItem('nowUser') != null){
        document.getElementById('whoami').innerText = localStorage.getItem('nowUser');
        document.getElementById('loginBtn').innerText = 'logout';
    } else {
        document.getElementById('whoami').innerText = '';
        document.getElementById('loginBtn').innerText = 'login';
    }

    if(items != null) {
        let html = "";

        //pagination

        if(JSON.parse(localStorage.getItem('board')).length > 20){
            document.getElementById('button_prev').style.display = '';
            document.getElementById('button_next').style.display = '';
        } else {
            document.getElementById('button_prev').style.display = 'none';
            document.getElementById('button_next').style.display = 'none';
        }

        // debugger;
        
        const prevBtn = document.getElementById('button_prev');
        const nextBtn = document.getElementById('button_next');
        let pageNumber = document.getElementById('page_number');
        let currentPage = 1; 
        let recordsPerPage = (vCnt)? vCnt : 10;
        let numPages = Math.ceil(JSON.parse(localStorage.getItem('board')).length / recordsPerPage);
        
        let pageNumbers = function() {
            pageNumber.innerHTML = "";
            
            for(let i = 1 ; i <= numPages ; i++){
                pageNumber.innerHTML += `<span class='clickPageNumber'>` + i + `</span>`;
            }
        };

        pageNumbers();
        
        let changePage = function(page) {
            const tbody = document.querySelector('tbody');
            
            if(page < 1) page = 1;
            if(page > numPages-1) page = numPages;
            
            tbody.innerHTML = "";
            html = "";

            debugger;

            for(let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) ; i++){
                if(items[i]){
                    html += `<tr id="target" onclick="createRowTbl('update', this.id, `+ i +`)">`;
                    html += `<td>`+(i+1)+`</td>`;

                    for(let item in items[i]){
                        html += `<td>`+items[i][item]+`</td>`;
                    }

                }
                html += `</tr>`;
            }
            tbody.innerHTML = html;
        
        };
        
        changePage(1);

        let addEventListeners = function() {
            prevBtn.addEventListener('click', prevPage);
            nextBtn.addEventListener('click', nextPage);
        }

        let prevPage = function() {
            if(currentPage > 1){
                currentPage--;
                changePage(currentPage);
            }
        };

        let nextPage = function () {
            if(currentPage < numPages){
                currentPage++;
                changePage(currentPage);
            }
        };

        let clickPage = function () {
            document.addEventListener('click', function(e) {
                if(e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")){
                    currentPage = e.target.textContent;
                    changePage(currentPage);
                }
            })
        };

        clickPage();
        addEventListeners();
    }

}

function init() {
    loadItems();
}

init();

const select = document.querySelector('#viewCnt');

function changeSelect() {
    console.log('viewCnt',viewCnt);
    loadItems(select.value);
}

select.addEventListener('change', changeSelect);