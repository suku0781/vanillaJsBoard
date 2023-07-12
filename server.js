import nodemailer from 'nodemailer';
import express from 'express';
import senderInfo from './senderInfo.json' assert { type: "json" };
import path from 'path';
import { fileURLToPath } from "url";  

const app = express();
const PORT = 8080;

const __dirname = fileURLToPath(new URL(".", import.meta.url)); // src 경로를 루트경로로 지정. 상대경로x

console.log('tesst:::',__dirname)
console.log("test2:::", express.static(path.join(__dirname, './')))

app.use(express.json());
app.use(express.static(path.join(__dirname, './'))); // app.use: 미들웨어. 지정된 경로에 지정된 미들웨어 함수를 마운트 하는데 사용.

// console.log("app", app)

app.listen(PORT, () => {
    console.log('server running on ' + ":" + PORT);

    

    app.post('/mail', (req, res) => {
        const email = req.body.usrEmail;
        console.log("email : ", email)

        let code = create_code();
        console.log("인증 코드 : ", code);

        const limit_time = '3분';
        const service_name = 'vanillaJsBoard';
        //메일 제목
        const subject = '[' + service_name + '] 회원가입 이메일 인증코드가 도착하였습니다. ';

        //메일 내용
        const emailHtml = `<p>안녕하세요.</p>
        <p>해당 메일은 `+email+`이 가입하려는 사람이 본인이 맞는지 확인하는 메일입니다. </p>
        <p>`+service_name+` 인증코드는 [<strong>`+code+`</strong>] 입니다.</p>
        <p>이 코드는 `+limit_time+`후 만료 됩니다. </p>`;

        let success = () => {
            console.log(JSON.stringify({result:true}));
            res.status(200).send({
                result:true,
                code : code,
            });
        };

        let fail = () => {
            console.log("전송 실패");
            res.status(200).send({result:false});
        };

        //이메일 전송 요청
        sendGmail(service_name, email, subject, emailHtml, success, fail);

    });
});

function sendGmail(fromServiceName, toEmail, subject, html, success, fail){
    console.log('senderInfo.user',senderInfo.user,'senderInfo.pass',senderInfo.pass);
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user : senderInfo.user,
            pass : senderInfo.pass
        },
        port : 587,
        host : 'smtp.gmail.com',
        secure : false,
        requireTLS : true, 
        tls : {
            rejectUnauthorized : false
        },
        maxConnections : 5,
        maxMessages : 10,
    });

    let mail_from;
    if(fromServiceName == undefined){
        mail_from = senderInfo.user;
    } else {
        mail_from = fromServiceName + " <" + senderInfo.user + ">";
    }

    let mailOptions = {
        from : mail_from,
        to : toEmail, 
        subject : subject,
        html : html
    };

    console.log('mailOptions', mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
            fail()
            return false;
        } else {
            console.log('Email sent : ' + info.response);
            success();
        }

    });
}

function create_code() {
    let n = Math.floor(Math.random() * 1000000);

    return n.toString().padStart(6, "0");
}

