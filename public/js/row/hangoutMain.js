var socket;
var youtubeLiveId;

var userID;
var images;
var ctx;
var canvas;
var panCanvas;
var panCtx;
//var img;
var trashCanImage = 'http://www.tenforums.com/geek/gars/images/2/types/thumb_Recycle_Bin_Empty.png';
var trashCanImg;
var pictureArray = [];

//var pictureOverlayUrl = "null";
//var pictureOverlayImage;
//var pictureOverlay;
function getPicture(url) {
	// body..
	var picture = {};
	picture.OverlayUrl = url;
	picture.x = 0;
	picture.y = 0;
	picture.w = 60;
	picture.h = 60;
	picture.img = document.createElement("img");
	picture.img.src = url;
	picture.img.onload = function(){ // 影像載入後，執行裡面的內容
		drawImageOnCanvas(picture.img,picture.x,picture.y,picture.w,picture.h);
	}
	picture.OverlayImage = gapi.hangout.av.effects.createImageResource(picture.OverlayUrl);
	picture.Overlay = picture.OverlayImage.createOverlay({
		'scale': {
			'magnitude': 0.125,
			'reference': gapi.hangout.av.effects.ScaleReference.WIDTH
		}
	});
 	picture.Overlay.setPosition(picture.x,picture.y);
	picture.Overlay.setVisible(true);
	pictureArray.push(picture);
}

var faceOverlayUrl = "null";
var faceOverlayImage;
var overlay;
function face(url) {
	// body...
	if(url==faceOverlayUrl)faceOverlayUrl = "null";
	else faceOverlayUrl = url;
	if(faceOverlayUrl!="null"){
		if(overlay!=undefined)overlay.setVisible(false);
		faceOverlayImage = gapi.hangout.av.effects.createImageResource(faceOverlayUrl);
		overlay = faceOverlayImage.createFaceTrackingOverlay(
        {'trackingFeature':
         gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
         'scaleWithFace': true,
         'rotateWithFace': true,
         'scale': 1.5});
		overlay.setVisible(true);
	}
	else{
		overlay.setVisible(false);
	}
}

var backgroundImageUrl;
var backgroundImage;
var backgroundReplacement = null;
var backgroundTroggle = "null";

function background(url) {
	// body...
	if(url==backgroundImageUrl)backgroundTroggle = "null";
	else backgroundTroggle = url;
	if(backgroundTroggle!="null"){
		backgroundImageUrl = url;
		backgroundImage = gapi.hangout.av.effects.createImageResource(backgroundImageUrl);
		gapi.hangout.av.effects.requestBackgroundReplacementLock(
		function(hasLock) {
			if (!hasLock) {
				alert('Fail to get the background replacement lock.');
				return;
			}
			backgroundReplacement = gapi.hangout.av.effects.getBackgroundReplacement();
			backgroundReplacement.resetModel();
			backgroundReplacement.setAlphaThresholdAutoUpdating(true);
			backgroundReplacement.setImageResource(backgroundImage);
			backgroundReplacement.setVisible(true);
		});
	}
	else{
		gapi.hangout.av.effects.releaseBackgroundReplacementLock();
	}
}

var isMouseDown = false;
var choosePic = -1;
function moveOnCanvas(event) {
	var pos = $('#screenCanvas')[0].getBoundingClientRect();
	if(isMouseDown){
		if(choosePic!=-1){
			var x = (event.pageX - pos.left)/canvas.width-0.5;
			var y = (event.pageY - pos.top)/canvas.height-0.5;
			pictureArray[choosePic].Overlay.setPosition(-x,y);
			pictureArray[choosePic].x = x;
			pictureArray[choosePic].y = y;
			cleanImageOnCanvas();
			drawImageOnCanvas(pictureArray[choosePic].img,pictureArray[choosePic].x,pictureArray[choosePic].y,pictureArray[choosePic].w,pictureArray[choosePic].h);
		}
		else{
			var mx = event.clientX - pos.left;
			var my = event.clientY - pos.top;
    		panCtx.lineTo(mx, my);
    		panCtx.stroke();
    		cleanImageOnCanvas();
		}
	}
}

function downOnCanvas(event) {
	// body...
	choosePic = -1;
	isMouseDown = true;
	var pos = $('#screenCanvas')[0].getBoundingClientRect();
	var x = (event.pageX - pos.left)/canvas.width-0.5;
	var y = (event.pageY - pos.top)/canvas.height-0.5;
	for (var i = 0; i < pictureArray.length; i++) {
		var pic = pictureArray[i];
		if(pic.x+0.2>x&&x>pic.x-0.2&&pic.y+0.2>y&&y>pic.y-0.2){
			choosePic = i;
			break;
		}
	}
	if(choosePic==-1){
		panCtx.beginPath();
	 	panCtx.strokeStyle = $('#panColor').val();
		panCtx.lineWidth = 2;
		var mx = event.clientX - pos.left;
		var my = event.clientY - pos.top;
		panCtx.moveTo(mx,my);
	}
}

function upOnCanvas(event) {
	// body...
	var pos = $('#screenCanvas')[0].getBoundingClientRect();
	var x = (event.pageX - pos.left)/canvas.width-0.5;
	var y = (event.pageY - pos.top)/canvas.height-0.5;
	if(choosePic!=-1&&x>0.35&&y>0.35){
		pictureArray[choosePic].Overlay.setVisible(false);
		pictureArray[choosePic].Overlay.dispose();
		pictureArray[choosePic].OverlayImage.dispose();
		pictureArray.splice(choosePic, 1);
		cleanImageOnCanvas();
	}
	isMouseDown = false;
	choosePic = -1;
}

function drawImageOnCanvas(img,x,y,w,h){
	ctx.drawImage(img, (x+0.5)*canvas.width-w/2, (y+0.5)*canvas.height-h/2, w, h);
}

function cleanImageOnCanvas(){
	if(ctx!=undefined){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(panCtx.getImageData(0,0,canvas.width,canvas.height),0,0);
		ctx.drawImage(trashCanImg,canvas.width-60,canvas.height-60, 60, 60);
		for (var i = 0; i < pictureArray.length; i++) {
			var pic = pictureArray[i];
			drawImageOnCanvas(pic.img,pic.x,pic.y,pic.w,pic.h);
		}
	}
}

function cleanPan() {
	// body...
	if(panCtx!=undefined){
		panCtx.clearRect(0, 0, canvas.width, canvas.height);
		cleanImageOnCanvas();
	}
}

var panOverlayImage;
var panOverlay;
function drawPanCanvas() {
	// body...
	if(panOverlayImage!=undefined){
		panOverlay.setVisible(false);
		panOverlay.dispose();
		panOverlayImage.dispose();
	}
	panOverlayImage = gapi.hangout.av.effects.createImageResource(panCanvas.toDataURL());
	panOverlay = panOverlayImage.createOverlay({
		'scale': {
			'magnitude': 1,
			'reference': gapi.hangout.av.effects.ScaleReference.WIDTH
		}
	});
	panOverlay.setPosition(0,0);
	panOverlay.setVisible(true);
}

function canvasInit(){
	canvas = $("#screenCanvas")[0]; // 取得物件
	ctx = canvas.getContext("2d");
	panCanvas = document.createElement('canvas');
	panCanvas.width = canvas.width;
	panCanvas.height = canvas.height;
	panCtx = panCanvas.getContext("2d");
	trashCanImg = document.createElement("img"); // 建立元素
		// 設定相關屬性
	trashCanImg.src = trashCanImage;
	trashCanImg.onload = function(){ // 影像載入後，執行裡面的內容
		ctx.drawImage(trashCanImg,canvas.width-60,canvas.height-60, 60, 60);
	}
	setInterval(drawPanCanvas,500);
}

function fitCanvas(videoCanvas,videoCanvasBody){
	var ratio = videoCanvas.getAspectRatio();
	var width = videoCanvasBody.width();
	var width2 = videoCanvasBody.height()*ratio;
	if(width>width2){
		width = width2;
	}
	videoCanvas.setWidth(width);

	$('#videoControlPanel').css('height',videoCanvasBody.height());
	$('#videoControlPanel').css('overflow','auto');
	$('#screenCanvas')[0].width = $('#videoControlPanel').width()*0.8;
	$('#screenCanvas')[0].height = $('#screenCanvas')[0].width/ratio;

	subtitleCanvas.width = width;
	subtitleCanvas.height = 100;
	subtitleCtx.textAlign="center"; 
	subtitleCtx.fillStyle = "red";
	subtitleCtx.font = "50px Georgia";
	subtitleCtx.translate(subtitleCanvas.width,0);
	subtitleCtx.scale(-1,1);
	cleanImageOnCanvas();
}

var subtitleCanvas = document.createElement('canvas');
var subtitleCtx = subtitleCanvas.getContext('2d');
var recognition;
var toggle = false;
function startSpeech() {
	if (!('webkitSpeechRecognition' in window)) {
		alert("Your browser doesn't support this function!");
	} else {
		if(toggle==false){
			recognition = new webkitSpeechRecognition();

			recognition.continuous=true;
			recognition.interimResults=true;
			recognition.lang="cmn-Hant-TW";

			recognition.onstart=function(){
				$('#catchVoice').val("Start Detect");
			};

			recognition.onend=function(){
				$('#catchVoice').val("Stop Detect");
			};

			recognition.onresult=function(event){
				var i = event.resultIndex;
				var j = event.results[i].length-1;
				$('#catchVoice').val(event.results[i][j].transcript);
				sendSpeech();
			};
			toggle = true;
			recognition.start();
			$('#speechToggle').text("Stop");
		}
		else{
			toggle = false;
			if(recognition!=undefined){
				recognition.stop();
				$('#catchVoice').val("");
				sendSpeech();
				$('#speechToggle').text("Start");
			}
		}
	}
}

function sendSpeech() {
	// body...
	var text = $('#catchVoice').val();
	patchToScreen(text);
}

function patchToScreen(text) {
	// body...
	subtitleCtx.clearRect(0,0,subtitleCanvas.width,subtitleCanvas.height);
	var x = subtitleCanvas.width/2;
	var y = subtitleCanvas.height/2;
	subtitleCtx.fillText(text,x,y);
	drawSubtitleCanvas();
}

var subtitleOverlayImage;
var subtitleOverlay;
function drawSubtitleCanvas() {
	// body...
	if(subtitleOverlayImage!=undefined){
		subtitleOverlay.setVisible(false);
		subtitleOverlay.dispose();
		subtitleOverlayImage.dispose();
	}
	subtitleOverlayImage = gapi.hangout.av.effects.createImageResource(subtitleCanvas.toDataURL());
	subtitleOverlay = subtitleOverlayImage.createOverlay({
		'scale': {
			'magnitude': 1,
			'reference': gapi.hangout.av.effects.ScaleReference.WIDTH
		}
	});
	subtitleOverlay.setPosition(0,0.4);
	subtitleOverlay.setVisible(true);
}

function init() {
	// When API is ready...
	userID = md5(gadgets.views.getParams().appData);
	console.log(userID);
	$.post('https://calm-mountain-66170.herokuapp.com/getImages',{userID:userID},function(response){
		var type1 = [];
		var type2 = [];
		var type3 = [];
		for(var key in response){
			var item = response[key];
			switch(item.type){
				case '1':type1.push(item);break;
				case '2':type2.push(item);break;
				case '3':type3.push(item);break;
				default: console.log('unknown type');
			}
		}
		$.post('https://calm-mountain-66170.herokuapp.com/view',{action:'picture',json:{items:type3}},function(content){
			$('#pictureContenter').html(content);
		});
		$.post('https://calm-mountain-66170.herokuapp.com/view',{action:'face',json:{items:type1}},function(content){
			$('#faceContenter').html(content);
		});
		$.post('https://calm-mountain-66170.herokuapp.com/view',{action:'background',json:{items:type2}},function(content){
			$('#backgroundContenter').html(content);
		});
	});

	socketEvent();

	gapi.hangout.onApiReady.add(function(ApiReadyEvent) {
		// body...
		var videoCanvas = gapi.hangout.layout.getVideoCanvas();
		var videoCanvasBody = $('#videoCanvasBody');
		fitCanvas(videoCanvas,videoCanvasBody);
		videoCanvas.setVisible(true);
		$(window).resize(function() {
			fitCanvas(videoCanvas,videoCanvasBody);
		});
	});

	gapi.hangout.onair.onYouTubeLiveIdReady.add(function(YouTubeLiveIdReadyEvent){
		youtubeLiveId = YouTubeLiveIdReadyEvent.youTubeLiveId;
		socket.emit('sentYouInfo',{id:youtubeLiveId,hostID_FB:gadgets.views.getParams().appData,status:"prepare"});
	});

	gapi.hangout.onair.onBroadcastingChanged.add(function(BroadcastingChangedEvent){
		if(BroadcastingChangedEvent.isBroadcasting){
			socket.emit('changeClientStatus',{status:"startStream"});
		}
	});
}

function socketEvent()
{
	socket = io.connect("https://calm-mountain-66170.herokuapp.com");
	socket.on('firstShakeHand',function(data){
	});
	socket.on('sentYouInfoCheck',function(data){
	});
	socket.on('sendMessage',function(data){

		var msg_div = document.createElement("div");
		if(data.status=="startStream")cssType="alert-info";
		else if(data.status=="prepare")cssType="alert alert-warning";
		else if(data.status=="Video")cssType="alert-danger";
	    msg_div.className = "msg alert "+cssType;
	    msg_div.innerHTML = data.userName +" : "+ data.message;
		$('#commit').append(msg_div);
	});
}

gadgets.util.registerOnLoadHandler(init);
canvasInit();
$('#screenCanvas').mouseup(upOnCanvas);
$('#screenCanvas').mousedown(downOnCanvas);
$('#screenCanvas').mousemove(moveOnCanvas);

window.fbAsyncInit = function() {
FB.init({
appId      : '1730976823823523',
xfbml      : true,
version    : 'v2.7'
});
};

(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

