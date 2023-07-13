const dateTime = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hour = today.getHours() < 10 ? '0' + today.getHours(): today.getHours();
    let minutes = today.getMinutes() < 10 ? '0' + today.getMinutes(): today.getMinutes();
    let second = today.getSeconds() < 10 ? '0' + today.getSeconds(): today.getSeconds();

    return year + '-' + month  + '-' + day + "T" + hour + ":" + minutes + ":" + second ;
};