require("dotenv").config()
const { createCanvas, registerFont } = require( "canvas");
const fs = require("fs");
const moment = require("moment");
const express = require("express")
const webSever = express()
const superagent = require("superagent")
webSever.listen(3010)

webSever.use(express.static('static'))

const canvas = createCanvas(2048 , 1149 ); // create Canvas Instance
const context = canvas.getContext("2d"); // create context



function timeLeft() {
    var m = moment("2023-07-07");  // or whatever start date you have
    var today = moment().utc().add(7,"h").startOf('day');
 
    return Math.round(moment.duration(m - today).asDays());
}
function createPost() {
    context.fillStyle = "#20B2AA";
    context.fillRect(0, 0, 2048, 1149);

    registerFont(`./static/fonts/Roboto.ttf`, {
        family: "Roboto",
    });
    //register style 
    context.font = "70px Roboto";
    context.fillStyle = "white";

    //viết chữ
    context.textAlign = "Center";
    context.fillText("Kì thi Trung học Phổ thông Quốc gia\nnăm 2023 còn:",50, 550);

    //vẽ cái khung
    context.fillRect(1300, 300, 600, 600);
    context.fillStyle = "#20B2AA";
    context.fillRect(1325, 325, 550, 550);

    //ghi số
    context.font = "200px Roboto";
    context.textAlign = "Center";
    context.fillStyle = "White";
    context.fillText(timeLeft(),1425, 660);

    context.font = "70px Roboto";
    context.fillText("ngày nữa",1600, 960);



    const imageBuffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`./static/canvas.png`, imageBuffer);

    // superagent.post(process.env.Endpoint+"/canvas.png")\
    console.log(process.env.FBToken)
    superagent.post("https://graph.facebook.com/"+process.env.pageID+"/photos").send({
        url:process.env.Endpoint+"/canvas.png",
        access_token:process.env.FBToken,
        message:"[Bài đăng tự động]\nNếu bạn nhìn thầy bài viết này thì tức là chỉ còn "+timeLeft()+" ngày nữa là tới kì thi THPTQG năm 2023\nNgày dự thi: 07 Jul 2023"
    }).end((err,res) => {
        console.log("test")
        console.log(err)
    })
}

let currentTime = moment().utc().add(7,"h")
console.log(currentTime.minute())
setInterval(() => {
    let currentTime = moment().utc().add(7,"h")
    if(currentTime.hour()==6 && currentTime.minute()==00){
        console.log("Posted")
        createPost()
    }else{
        console.log("not")
    }
    
}, 60*1000);

