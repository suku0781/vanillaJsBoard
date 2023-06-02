

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
        console.log(mkForm.style.display, id);
        if(mkForm.style.display == "none"){
            mkForm.style.display = "";
            
            document.getElementById('createList').innerText = "cancel";
            document.getElementById('no').innerText = cnt;
            document.getElementById('titleInp').value = JSON.parse(localStorage.getItem('board'))[cnt][0];
            document.getElementById('contentInp').value = JSON.parse(localStorage.getItem('board'))[cnt][1];
            document.getElementById('createTime').value = JSON.parse(localStorage.getItem('board'))[cnt][2];
            document.getElementById('delete').style.display = "";
        } else {
            mkForm.style.display = "none";
            document.getElementById('createList').innerText = "makeList";
        }
    } else {
        //makeList버튼 클릭 시 이벤트
        if(mkForm.style.display == "none"){
            mkForm.style.display = "";
            elem.innerText = "cancel";
            // debugger;
            if( JSON.parse(localStorage.getItem('board')) == null){
                document.getElementById('no').innerText = 0;
            } else {
                document.getElementById('no').innerText = JSON.parse(localStorage.getItem('board')).length ;
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
    let formCnt = document.getElementById('mkForm').children[1].innerText;
    let title = document.getElementById("titleInp").value;
    let contents = document.getElementById("contentInp").value;
    let createTimeDate = document.getElementById("createTime").value;
    let item = [title, contents, createTimeDate];
    let oldData = JSON.parse(localStorage.getItem('board'));

    if(localStorage.getItem('board') == null){
        localStorage.setItem('board', '[]');
    }

    if( oldData == null ){
        console.log("오는지 테스트");
        originData.push(item);
        localStorage.setItem('board', JSON.stringify(originData));
    } else if( oldData[formCnt] ){ // 수정
        let tmpOldData1 = oldData[formCnt][0];
        let tmpOldData2 = oldData[formCnt][1];
        let tmpOldData3 = oldData[formCnt][2];

        oldData[formCnt][0] = title;
        oldData[formCnt][1] = contents;

        //만약 날짜를 수정했다면 수정된 날짜를 아니면 현재 날짜를 저장
        (createTimeDate != oldData[formCnt][2]) ? oldData[formCnt][2] = createTimeDate : oldData[formCnt][2] = dateTime;
        if( tmpOldData1 == oldData[formCnt][0] && tmpOldData2 == oldData[formCnt][1] && tmpOldData3 == oldData[formCnt][2]){
            alert("수정사항 없음.")
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
            alert("글 등록됨.");
        }
        // debugger;
        localStorage.setItem('board', JSON.stringify(oldData));
    }
    
    // debugger;
}

function deleteRow(cnt) {
    let target = JSON.parse(localStorage.getItem('board'));
    let cnt2 = document.getElementById('no').innerText;
    
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

function loadItems() {
    let items = localStorage.getItem('board');
    if(items != null) {
        let parseItems = JSON.parse(items);
        let html = "";
        let count = 0;
        for(let i of parseItems){
            if(parseItems < 10){

            } else {
                
            }
            console.log(parseItems.length)
            html += `<tr id="target" onclick="createRowTbl('update', this.id, `+ count +`)">`;
        
            html += `<td>`+count+`</td>`;
            
            for(let j of i){
                html += `<td>`+j+`</td>`;
            }
            html += `</tr>`;
            count++;
        
        }

        document.getElementById('target').insertAdjacentHTML("afterend",html);
    }
}

function init() {
    loadItems();
}

init();
