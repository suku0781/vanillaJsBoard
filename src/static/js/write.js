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

const zeroFill = (value, fillCount) => {
    let result = value;
    if(typeof value === 'number') result = value.toString();

    let fillText= Array(fillCount+1 - result.length).join('0');
    return result.toString().length < fillCount ? fillText + result : result;
};

let oEditors = [];
nhn.husky.EZCreator.createInIFrame({
    oAppRef: oEditors,
    elPlaceHolder: "contentInp",
    sSkinURI: "/smarteditor2/dist/SmartEditor2Skin.html",
    fCreator: "createSEditor2",
    htParams : { 
        // 툴바 사용 여부 (true:사용/ false:사용하지 않음) 
        bUseToolbar : true, 
        // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음) 
        bUseVerticalResizer : false, 
        // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음) 
        bUseModeChanger : false,

        SE_EditingAreaManager: {
            sDefaultEditingMode : "WYSIWYG"	// 로딩 시 디폴트 편집 모드를 설정 Editor 모드 : WYSIWYG, HTML 모드 : HTMLSrc, TEXT 모드 : TEXT 
        },
    }
});

function loadItems() {
    const board = JSON.parse(localStorage.getItem('board'));
    const nowUser = (localStorage.getItem('nowUser')) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : '';
    const paramObj = {};
    let receiveData = location.href.split('?')[1];
    
    if(receiveData == "newWrite" ){
        console.log("새글 작성")
        document.getElementById('no').value = (board) ? (board.length)+1:1 ;
        document.getElementById('titleInp').value = "";
        document.getElementById('contentInp').value = "";
        document.getElementById('writer').value = nowUser;
        document.getElementById('createTime').value = dateTime();
        document.getElementById('comment').style.display='none';
    } else{
        //만약 뒤로가기 했을 경우 최신작성글 보이기 // 이거 수정해야함.
        // if(window.performance.navigation.type == 2) history.pushState(null, null, 'write.html?postNo=0/nowUserPost'); 
        
        //파라미터에 /가 있는지 체크 후 postNo추출
        receiveData = (location.search.includes('/'))? location.href.split('postUniqNo=')[1].split('/')[0] : location.href.split('postUniqNo=')[1];
        let tmpNum = '';
        board.forEach((item, idx) => {
            if(receiveData == item.postUniqNo){
                tmpNum = idx;
                document.getElementById('no').value = item.postUniqNo;
                document.getElementById('no').style.border = 0;
                document.getElementById('writer').style.border = 0;
                document.getElementById('titleInp').style.border = 0;
                document.getElementById('createTime').style.border = 0;
                document.getElementById('writer').value = item.writer;
                document.getElementById('titleInp').value = item.title;
                document.getElementById('createTime').value = item.time;
                document.getElementById('contentInp').value = item.contents;

            }

        })
        
        if(location.search.includes('nowUserPost')){
            //현재 로그인한 사용자가 작성한 포스트일 경우에만 스마트에디터로 편집할 수 있다.
            console.log("현재 유저 포스트")
            document.getElementById('titleInp').style.border = '1px solid';
            document.getElementById('createTime').style.border = '1px solid';
            paramObj.isMyPost = true;
        } else {
            console.log("타 유저 포스트")
            document.getElementById('titleInp').setAttribute('disabled', '');
            document.getElementById('createTime').setAttribute('disabled', '');
            document.getElementById('btnBox').style.display = 'none';
            document.getElementById('contentInp').style.display='none';
            
            document.getElementById('contentInp').parentNode.innerHTML = document.getElementById('contentInp').value;
            paramObj.isMyPost = false;
        }
        paramObj.postUniqNo = board[tmpNum].postUniqNo;
        paramObj.postWriter = board[tmpNum].writer;
        // document.getElementById("commentTarget")
        loadComment(paramObj);
    }
        
}

function loadComment(paramObj) {
    const nowUser = JSON.parse(localStorage.getItem('nowUser'));
    // const item = {postNo, nickname, time, content, bigComment, declarationYn};
    // const item = {postNo:paramObj.postWriter, time:dateTime(), declarationYn:false};
    // const postWriter = paramObj.postWriter;
    let commentLen = 0;
    let oldData = '';
    let html = '';

    if(!localStorage.getItem('comment')){
        localStorage.setItem('comment','[]');
    } else {
        oldData = JSON.parse(localStorage.getItem('comment'));
    }

    JSON.parse(localStorage.getItem('comment')).forEach( (item, idx) => {
        if(item.postNo == paramObj.postUniqNo){
            html += `<dd id="commentTarget" style="display:flex;">
                        <div id='commentHead'>
                            <p>`+item.commentNumber+`</p>`;

            if(nowUser.usrNickName == item.nickname){
                html += `<h3 id='commentWriter'><a href='userInfo?myInfo'>`+item.nickname+`</a></h3>`
            } else {
                html += `<h3 id='commentWriter'><a href='userInfo?readUserInfo=`+item.nickname+`'>`+item.nickname+`</a></h3>`
            }
            html += `<p>` + item.time.split("T")[0].split("-").join('.') + ` ` + item.time.split("T")[1] + `</p>
                    </div>
                    <div id='commentBody'>
                        <p>`+ item.content+`</p>
                    </div>
                    <div id='commentBtnBox'>
                        <button id='bigComment' type='button' onclick='commentBtnFunc(this)'>댓글달기</button>
                        <button id='likeComment' type='button' onclick='commentBtnFunc(this)'>좋아요</button>
                        <button id='reportComment' type='button' onclick='commentBtnFunc(this)'>신고</button>
                    </div>
                </dd>`;
                if(item.bigComment) {
                    const bigComment = item.bigComment;
                    const bigCommentArr = bigComment.split('{').slice(1);
                    console.log(bigCommentArr)

                    let bigCommentNumber = '';
                    let bigCommentNick = '';
                    let bigCommentValue = '';
                    let bigCommentTime = '';
                    
                    bigCommentArr.forEach( (tem, idx) => {
                        bigCommentNumber = tem.split(',')[0].split(':')[1].replaceAll('"','');
                        bigCommentNick = tem.split(',')[2].split(':')[1].replaceAll('"','');
                        bigCommentValue = tem.split(',')[3].split(':')[1].replaceAll('"','');
                        bigCommentTime = tem.split(',')[5].split('"time":')[1].replaceAll('"','').split('-').join('.').split('T').join(' ');
                        console.log(tem)
                    
                        html+= `<div id="bigCommentBox" style="center; display: flex; margin: 0 10%; padding: 5px 0;">
                                    <div id='commentHead'>
                                        <p>`+bigCommentNumber+`</p>`;
                        if(nowUser.usrNickName == item.nickname){
                            html += `<h3 id='commentWriter'><a href='userInfo?myInfo'>`+bigCommentNick+`</a></h3>`
                        } else {
                            html += `<h3 id='commentWriter'><a href='userInfo?readUserInfo=`+bigCommentNick+`'>`+bigCommentNick+`</a></h3>`
                        }
                        html += `<p>` + bigCommentTime + `</p>
                                    </div>
                                    <div id='commentBody'>
                                        <p>`+ bigCommentValue+`</p>
                                    </div>
                                </div>`
                    })
                }
            html += `<hr id='commentHr'>`;

            commentLen++;
        }
    } );

    document.getElementById('commentLength').innerText = 'comment('+commentLen+')';
    document.getElementById('commentTarget').insertAdjacentHTML('afterend', html);
    if(commentLen) document.getElementsByTagName('hr')[document.getElementsByTagName('hr').length-1].remove();
            
}

function submitForm(elem) {
    event.preventDefault();
    console.log('elem : ',elem)

    let no = Number(document.getElementById('no').value);
    let title = document.getElementById('titleInp').value;
    let inputContents = oEditors.getById['contentInp'].exec("UPDATE_CONTENTS_FIELD", []);

    let contents = document.getElementById('contentInp').value;

    let time = document.getElementById('createTime').value;
    let writer = document.getElementById('writer').value;
    let item = {title, contents, writer, time};
    let oldData = JSON.parse(localStorage.getItem('board'));
    let originData = [];

    console.log('inputContents', inputContents)

    if( oldData == null ){ // board 키가 없으면 생성
        console.log("이거 뛰어넌ㅁ나?", "title", title, title.length,"contnets",contents)
        if( title == "" || contents == "" || contents == "<p><br></p>"|| title.length == 0 ){
            alert("title 혹은 contents 입력사항 없음.");
        } else {    
            originData.push(item);
            localStorage.setItem('board', JSON.stringify(originData));
            alert("글 등록됨.", title, contents);
            location.href='/';
        }
        
    } else if( oldData[no] ){ // 수정
        let tmpOldData1 = oldData[no].title; // title
        let tmpOldData2 = oldData[no].contents; // content
        let tmpOldData3 = oldData[no].dateTime; // dateTime()

        
        console.log("tmpOldData1",tmpOldData1,"tmpOldData2",tmpOldData2);
        console.log("title",title, "contents",contents);
        console.log("oldData[no].title",oldData[no].title, "oldData[no].contents",oldData[no].contents);
        
        //만약 날짜를 수정했다면 수정된 날짜를 아니면 현재 날짜를 저장
        (time != oldData[no].time) ? oldData[no].time = time : oldData[no].time = dateTime();
        
        if( tmpOldData1 == title && tmpOldData2 == contents ){
            alert("수정사항 없음.");
            return false;
        } else {
            
            if( title == "" || contents == "" || contents == "<p><br></p>"|| title.length == 0 ){
                alert("title 혹은 contents 입력사항 없음.");
                return false;
            } else {
                oldData[no].title = title;
                oldData[no].contents = contents;

                alert("글 수정됨.");
                location.href='/';
            }
        }
        localStorage.setItem('board', JSON.stringify(oldData));
    } else { // 등록
        let todaySubmittedPostNo = 0;
        JSON.parse(localStorage.getItem('board')).forEach((item, idx) => {
            if(item.time.split('T')[0] == dateTime().split('T')[0]){
                todaySubmittedPostNo++;
            }
        })
        
        if( title == "" || contents == "" || contents == "<p><br></p>"|| title.length == 0 ){
            alert("title 혹은 contents 입력사항 없음.");
        } else {    
            const today = Number(dateTime().split('T')[0].replaceAll('-','').slice(2));
            item.postUniqNo = today+zeroFill(todaySubmittedPostNo, 4);
            oldData.unshift(item);
            alert("글 등록됨.");
            location.href='/';
        }
        localStorage.setItem('board', JSON.stringify(oldData));
        
    } 
    
}

function submitComment(elem){
    const no = document.getElementById('no').value;
    const nowUser = JSON.parse(localStorage.getItem('nowUser'));
    const elementId = elem.previousElementSibling.id;
    const value = elem.previousElementSibling.value;
    const commentNumber = (elem.parentElement.previousElementSibling) ? elem.parentElement.previousElementSibling.children[0].children[0].innerHTML : 0;
    


    let cntForCommentNumber = 0;
    JSON.parse(localStorage.getItem('comment')).forEach( item => {if(item.postNo == document.getElementById('no').value) cntForCommentNumber++; } )
    // commentNumber또는 bigCommentNumber를 조합함.
    let forCommentNumber = (elementId == 'commentValue') ? no + zeroFill(cntForCommentNumber, 4) : commentNumber+'d'+zeroFill(cntForCommentNumber, 4) ;


    const item = {commentNumber:forCommentNumber, postNo:no, nickname:nowUser.usrNickName, content:value, bigComment:'', time:dateTime(), declarationYn:false};
    const oldData = JSON.parse(localStorage.getItem("comment"));
    const originData = [];

    const validComment = (value) => {
        if(value.length == 0) {
            alert("댓글을 입력하십시오."); 
            return false;
        }

        if(value.length > 200) {
            alert("댓글을 200자 이내로 작성하십시오.");
            return false;
        }

        if(value.includes('<script>')){
            alert("잡았다 요놈!");
            //몇일간 접속 차단 기능 예정
            return false;
        }

        return true;
    };
    if(elementId == 'commentValue'){
        oldData.unshift(item);
        
        if(confirm("댓글을 등록하시겠습니까?" )){
            if(validComment(value)){
                alert("댓글이 등록되었습니다.");
                localStorage.setItem('comment', JSON.stringify(oldData));
                location.reload();
    
            }
        }
    } else if(elementId == 'bigCommentValue'){
        if(confirm("대댓글을 등록하시겠습니까?")){
            oldData.forEach(tem => {
                if(tem.commentNumber == commentNumber){
                    tem.bigComment += JSON.stringify(item) + ',';
                }
            })
            localStorage.setItem('comment', JSON.stringify(oldData));
            alert("대댓글이 등록되었습니다.");
            location.reload();
        }   
    }

}

function commentBtnFunc(elem){
    switch(elem.id) {
        case 'bigComment':
            const html = `<div id="inpBigCommentBox" style="justify-content: center; display: flex;"> 
                                <br>
                                <textarea id="bigCommentValue" type="text" placeholder="input Comment" escapeXml="false" style="width: 75%; resize: none;"></textarea>
                                <button type="button" onclick="submitComment(this)">submit</button>
                                <br>
                            </div>`;
            // const commentNumber = elem.parentElement.previousElementSibling.previousElementSibling.children[0].innerText.split(':')[1];
            // 대댓글 작성 textarea 노출 / 미노출 
            if(elem.parentElement.parentElement.nextElementSibling == null || 
                elem.parentElement.parentElement.nextElementSibling.tagName == 'DD' ||
                elem.parentElement.parentElement.nextElementSibling.tagName == 'HR' ||
                elem.parentElement.parentElement.nextElementSibling.id == 'bigCommentBox'){
                elem.parentElement.parentElement.insertAdjacentHTML('afterend', html);
            } else {
                document.getElementById('inpBigCommentBox').remove();
            }
        break;
        case 'likeComment':

        break;
        case'reportComment':

        break;
    }
}

function init() {

    loadItems();

}

init();


function deleteRow() {
    let target = JSON.parse(localStorage.getItem('board'));
    let cnt2 = Number(document.getElementById('no').value);
    
    if(target[cnt2]){
        if(confirm("게시글을 삭제하시겠습니까?")) {
            target.splice(cnt2, 1);
            localStorage.setItem('board', JSON.stringify( target ));
            location.href='/';
        }
    } else {
        alert("삭제 실패!");
    }

}

