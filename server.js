//Goi module express
var module = require('express');
var app = module();

//Khai bao bien messenger co dinh dang json
var messenger = {'status' : '200 OK'};

//Khai bao bien de dinh tuyen
var myRouter = module.Router();

//Khai bao mảng devStatus co kieu byte, do dai 8..
//Mỗi 1 phần tử trong mảng devStatus là 1 byte
var devStatus = new Uint8Array(8);

//Trang chu 
app.get('/', function(req, res){
	res.send('Hello every body');
});

//Ham thay doi trang thai thietbi
function switchstt(status) {
	//Neu off thi gui trang thai 0x30 tuc la off toi znp va set truong message trong bien messenger thanh "tat den"
    if(status == "off") {
		devStatus[7] = 0x30;
		messenger.message = "Tắt đèn";
	}
	else if(status == "on"){
		devStatus[7] = 0x31;
		messenger.message = "Bật đèn";
	}
}

//Ham dinh tuyen
myRouter.route("/device/switch/:status").post(function(req, res, next) {
	//set cac gia tri cho tung bien trong mang devStatus
    devStatus[0]=0x44; // D
    devStatus[1]=0x31; // 1
    devStatus[2]=0x34; // command
    devStatus[3]=0x31; // button id
    devStatus[4]=0xa2; // address
    devStatus[5]=0x6a; // address
    devStatus[6]=0x10; // end point
    //Goi ham switchstt voi tham so truyen vao la status nhu trong duong dan
    switchstt(req.params.status) //gui len tham so status
    //Hien thi ra ket qua 
    res.send(messenger);//tra ve 
})
//Set nghe o port 8888
var port = 8888;
app.listen(port);
//Đặt trang chủ là /, nếu thay '/' = 'home' thì trang chủ khi vào 127.0.0.1:8888 là 127.0.0.1:8888/home/
app.use('/', myRouter);
//In ra man hinh console
console.log('Server is running on port %s', port);