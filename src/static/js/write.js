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
    const board = localStorage.getItem('board');
    const nowUser = (localStorage.getItem('nowUser')) ? JSON.parse(localStorage.getItem('nowUser')).usrNickName : '';
    let receiveData = location.href.split('?')[1];
    
    if(receiveData == "newWrite" ){
        console.log("새글 작성")
        document.getElementById('no').value = (board) ? (JSON.parse(board).length)+1:1 ;
        document.getElementById('titleInp').value = "";
        document.getElementById('contentInp').value = "";
        document.getElementById('writer').value = nowUser;
        document.getElementById('createTime').value = dateTime();
    } else{
        //만약 뒤로가기 했을 경우 최신작성글 보이기 // 이거 수정해야함.
        if(window.performance.navigation.type == 2) history.pushState(null, null, 'write.html?postNo=0/nowUserPost'); 
        
        //파라미터에 /가 있는지 체크 후 postNo추출
        receiveData = (location.search.includes('/'))? location.href.split('postNo=')[1].split('/')[0] : location.href.split('postNo=')[1];

        document.getElementById('no').value = receiveData;
        document.getElementById('no').style.border = 0;
        document.getElementById('writer').style.border = 0;
        document.getElementById('titleInp').style.border = 0;
        document.getElementById('createTime').style.border = 0;
        document.getElementById('writer').value = JSON.parse(board)[receiveData].writer;
        document.getElementById('titleInp').value = JSON.parse(board)[receiveData].title;
        document.getElementById('createTime').value = JSON.parse(board)[receiveData].time;
        document.getElementById('contentInp').value = JSON.parse(board)[receiveData].contents;
        
        if(location.search.includes('nowUserPost')){
            //현재 로그인한 사용자가 작성한 포스트일 경우에만 스마트에디터로 편집할 수 있다.
            console.log("현재 유저 포스트")
            document.getElementById('titleInp').style.border = '1px solid';
            document.getElementById('createTime').style.border = '1px solid';
        } else {
            console.log("타 유저 포스트")
            document.getElementById('titleInp').setAttribute('disabled', '');
            document.getElementById('createTime').setAttribute('disabled', '');
            document.getElementById('btnBox').style.display = 'none';
            document.getElementById('contentInp').style.display='none';
            
            document.getElementById('contentInp').parentNode.innerHTML = document.getElementById('contentInp').value;

        }
    }
        
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
        
        if( title == "" || contents == "" || contents == "<p><br></p>"|| title.length == 0 ){
            alert("title 혹은 contents 입력사항 없음.");
        } else {    
            oldData.unshift(item);
            alert("글 등록됨.");
            location.href='/';
        }
        localStorage.setItem('board', JSON.stringify(oldData));
        
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

