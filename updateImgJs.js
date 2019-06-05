"use strict";

function choiceFile(obj) {
	var file = obj.files;
	var selectImg = document.getElementById('select-out-Img'); //裁剪后显示图片的位置
	var reader = new FileReader(); // 操作图片
	if (/image/.test(file[0].type)) {
		reader.readAsDataURL(file[0]);
	} else {
		alert('请选择图片!');
		obj.value = "";
		return;
	}
	reader.onerror = function() {
		document.write("图片加载错误");
	}
	// 图片加载完成
	reader.onload = function() {
		selectImg.src = reader.result;
	}
};

//剪切框的拖拽
var cutBox = document.getElementById("cutBox");
var boxX = null;
var boxY = null;
var cutBoxLeft = null;
var cutBoxTop = null;
//鼠标状态
var isMouseDrop = false;
var selectOut = document.getElementById("select-out");
var canvasInfo = null

cutBox.onmousedown = function(e) {
	//获取鼠标的位置
	var e = e || window.event;
	boxX = e.clientX - cutBox.offsetLeft;
	boxY = e.clientY - cutBox.offsetTop;
	isMouseDrop = true; //设为true表示可以移动
}
document.onmousemove = function(e) {　　　　　　　 //是否为可移动状态
	if (isMouseDrop) {　　　　
		var e = e || window.event;
		//得到距离左边和上边距离
		var moveX = e.clientX - boxX;
		var moveY = e.clientY - boxY;
		var maxX = selectOut.offsetWidth - cutBox.offsetWidth;
		var maxY = selectOut.offsetHeight - cutBox.offsetHeight;
		//移动限定范围
		moveX = Math.min(maxX, Math.max(0, moveX));
		moveY = Math.min(maxY, Math.max(0, moveY));
		cutBox.style.left = moveX + "px";
		cutBox.style.top = moveY + "px";　　
	} else {
		return;　　　　
	}
}
//鼠标抬起不可移动
document.onmouseup = function() {
	isMouseDrop = false;
};

//canvas 绘制
var canvasImg = document.getElementById('choiceImg'); //裁剪后显示图片的位置
var canvasCxt = canvasImg.getContext('2d'); //转换canvas
var dataEmpty = canvasImg.toDataURL(); //存储初始Base64 
//裁剪图片并显示到canvas中
function cutImg() {
	canvasCxt.clearRect(0, 0, 300, 200);
	var sx = cutBox.offsetLeft;
	var sy = cutBox.offsetTop;
	var img = document.getElementById('select-out-Img');
	canvasCxt.drawImage(img, sx, sy, 300, 200, 0, 0, 300, 200);
};

//获取截取的图片转换base64 上传
function updateImage() {
	var dataImg = canvasImg.toDataURL();
	dataImg = dataImg.split(',')[1];
	if (dataImg == dataEmpty) {
		alert("请选择图片文件！");
		return
	};
	//创建ajax post 请求
	var updateHttp = new XMLHttpRequest();
	updateHttp.open("post", "http://localhost/8080", true);
	var data = {
		"base64": dataImg
	}
	updateHttp.setRequestHeader("content-type", "application/json");
	updateHttp.send(JSON.stringify(data));
	updateHttp.onreadystatechange = function() {
		if (updateHttp.readyState == 4) {
			if (updateHttp.status >= 200 && updateHttp.status < 300) {
				alert("上传图片成功！");
				window.location.href = '';
			} else {
				alert("上传图片失败！");
				window.location.href = '';
			};
		};
	}
};