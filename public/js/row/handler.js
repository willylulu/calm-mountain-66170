$.fn.extend({
    animateCss: function (animationName,callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            callback();
        });
    }
});

function sendMessage(id) {
	// body...
	sendMessageBody(id);
}

function keypress (e,id) {
// body...
	if(e.keyCode==13){
		sendMessageBody(id);
	}
}

function t_sendMessage(id) {
	// body...
	sendMessageBodyOwnVideo(id);
}

function t_keypress (e,id) {
// body...
	if(e.keyCode==13){
		sendMessageBodyOwnVideo(id);
	}
}

function sendMessageBody(id) {
	// body...
	var text = $('#text_'+id).val();
	socket.emit("/sendMessage",{id:id,message:text,userName:userName});
	$('#text_'+id).val("");
}

function sendMessageBodyVideo(id) {
	// body...
	var text = $('#textVideo_'+id).val();
	$.post("/sendMessageVideo",{id:id,message:text,userName:userName},function(response) {
		// body...
		window.location.reload();
	});
	$('#textVideo_'+id).val("");
}

function sendMessageBodyOwnVideo(id) {
	// body...
	var text = $('#textOwn_'+id).val();
	$.post("/sendMessageVideo",{id:id,message:text,userName:userName},function(response) {
		// body...
		window.location.reload();
	});
	$('#textVideo_'+id).val("");
}

function postMessageOnPanel(name,id,response) {
	// body...
	$('#'+ name + id).html("");
	for(var key in response){
		var data = response[key];
		var msg_div = document.createElement("div");
		var cssType;
		if(data.status=="startStream")cssType="alert-info";
		else if(data.status=="Video")cssType="alert-danger";
		msg_div.className = "msg alert "+cssType;
		msg_div.innerHTML = data.userName +" : "+ data.message;
		msg_div.style="display:inline-block;";
		$('#'+ name + id).append(msg_div);
		var br = document.createElement("br");
		$('#'+ name + id).append(br);
	}
}

function imageUrlOnchange(){
	$("#imageDisplayByUrl")[0].src=$('#urlInput').val();
}

function showMessage(id) {
	// body...
	$.post('/getMessage',{id:id},function (response) {
		// body...
		postMessageOnPanel("message_Video",id,response);
	});
	getYoutubeData(0,id);
}

function keypressVideo(e,id) {
	// body...
	if(e.keyCode == 13){
		sendMessageBodyVideo(id);
	}
}

function getYoutubeData(num,id) {
	// body...
	$.post('/getYoutubeData',{id:id},function (response) {
		// body...
		useYoutubeData(num,id,response);
	});
}

function useYoutubeData(num,id,response) {
	// body...
	$('#myVideoName'+num+'_'+id).html(response.snippet.localized.title);
	$('#youtubeInfoTags'+num+'_'+id).html("");
	$('#youtubeInfoAuthor'+num+'_'+id).html(response.snippet.channelTitle);
	$('#youtubeInfoPublish'+num+'_'+id).html(new Date(response.snippet.publishedAt));
	$('#youtubeInfoView'+num+'_'+id).html(response.statistics.viewCount);
	$('#youtubeInfoLike'+num+'_'+id).html(response.statistics.likeCount);
	$('#youtubeInfoDislike'+num+'_'+id).html(response.statistics.dislikeCount);
	for (var i = 0; i < response.snippet.tags.length; i++) {
		var tag = response.snippet.tags[i];
		$('#youtubeInfoTags'+num+'_'+id).append("<span class=\"badge\">"+tag+"</span>&nbsp;");
	}
}

function hideMessage(id) {
	// body...
	$('#message_Video' + id).html(
		"<br/>"
	);
	$('#showMessageButton_' + id).html(
		"Show Message"
	);
}

function getOwnVideoMessage(id) {
	// body...
	$.post('/getMessage',{id:id},function (response) {
		// body...
		postMessageOnPanel("messageOwn_",id,response);
	});
}

function streamModalShowHendler(e) {
	var clientId = $(this).attr('client-id');
	socket.emit("registerStream",{'id':clientId});
}

function streamModalHideHendler(e) {
	var clientId = $(this).attr('client-id');
	socket.emit("unregisterStream",{'id':clientId});
}

function facebookLoginButtonHendler(){
	FB.login(function(response){
		post('/loginByFacebook', {userID:response.authResponse.userID,token:response.authResponse.accessToken});
	});
}

var uploadLock = false;
function uploadImageSubmitButtonHendler(){
	if(!uploadLock){
		$.post(
			'uploadImage',
			{data:imageDataUrl,type:$('#uploadImageSubmitButton').attr('value'),userID:userID},
			function(res){
				alert(res);
				uploadLock = false;
				switch($('#uploadImageSubmitButton').attr('value'))
				{
					case "1":
						$('#uploadImageSubmitButton').html('Upload Face');
					break;
					case "2":
						$('#uploadImageSubmitButton').html('Upload Background');
					break;
					case "3":
						$('#uploadImageSubmitButton').html('Upload Picture');
					break;
				}
				window.location.reload();
			}
		);
		$('#uploadImageSubmitButton').html("Uploading...");
		uploadLock = true;
	}
}

function deleteImageByUrlButtonHendler() {
	// body...
	if(confirm("Sure to delete?")){
		var url = $(this).attr('value');
		$.post('/deleteImage',{userID:userID,url:url},function(response) {
			// body...
			window.location.reload();
		});
	}
}

function deleteDrag(e){
    e.dataTransfer.setData("Text", e.target.src);
}
 
function deleteDrop(e){
    e.preventDefault();
    var data = e.dataTransfer.getData("Text");
    if(confirm("Sure to delete?")){
		$.post('/deleteImage',{userID:userID,url:data},function(response) {
			// body...
			window.location.reload();
		});
	}
}

function allowDeleteDrop(e){
    e.preventDefault();
}

function changeOwnVideoPage(id) {
	// body...
	if(id==0){
		if(OwnVideoShowNum>9){
			hideVideoToken(OwnVideoShowNum);
			OwnVideoShowNum = OwnVideoShowNum - 9;
			showVideoToken(OwnVideoShowNum);
		}
	}
	else{
		if(OwnVideoShowNum<=ownVideoNum){
			hideVideoToken(OwnVideoShowNum);
			OwnVideoShowNum = OwnVideoShowNum + 9;
			showVideoToken(OwnVideoShowNum);
		}
	}
}

var OwnVideoShowNum = 9;
function hideVideoToken(num) {
	// body...
	for(var i = OwnVideoShowNum - 9;i<OwnVideoShowNum;i++){
		$('#ownVideoLink_'+i).hide();
	}
}
function showVideoToken(num) {
	// body...
	for(var i = OwnVideoShowNum - 9;i<OwnVideoShowNum;i++){
		$('#ownVideoLink_'+i).show();
	}
}

function discussContentFocusHendler() {
	// body...
	$('#discussInput').hide();
}

function discussInputHendler(e) {
	// body...
	if(e.which==13){
		var text = $('#discussInput').val();
		var div = document.createElement("div");
		switch($('#discussInput').attr('tagType')){
			case '0':
				var link = document.createElement("a");
				link.setAttribute('href',text);
				link.innerHTML = text;
				div.appendChild(link);
			break;
			case '1':
				var img = document.createElement("img");
				img.src = text;
				div.appendChild(img);
			break;
			case '2':
				var iframe = document.createElement("iframe");
				iframe.width=420;
				iframe.height=315;
				var src = text;
				if(src.includes("https://www.youtube.com/watch")){
				src = src.substring(32);
				src = 'https://www.youtube.com/embed/'+src;
				if(src.indexOf('&')!=-1)src = src.substring(0,src.indexOf('&'));
				}
				else if(src.includes("https://youtu.be/")){
					src = src.substring(17);
					src = 'https://www.youtube.com/embed/'+src;
					if(src.indexOf('?')!=-1)src = src.substring(0,src.indexOf('?'));
				}
				iframe.src = src;
				iframe.setAttribute('frameborder', '0');
				iframe.setAttribute('allowFullScreen', '');
				div.appendChild(iframe);
			break;
		}
		$('#discussContent').append(div);
		$('#discussInput').val("");
	}
}

function discussImageHendler() {
	// body...
	$('#discussInput').show();
	$('#discussInput').val("");
	$('#discussInput').attr('placeholder','image url?');
	$('#discussInput').attr('tagType','1');
}

function discussYoutubeHendler() {
	// body...
	$('#discussInput').show();
	$('#discussInput').val("");
	$('#discussInput').attr('placeholder','youtube url?');
	$('#discussInput').attr('tagType','2');
}

function discussLinkHendler() {
	// body...
	$('#discussInput').show();
	$('#discussInput').val("");
	$('#discussInput').attr('placeholder','http://');
	$('#discussInput').attr('tagType','0');
}

function discussSubmitHendler() {
	// body...
	$('#selectPanel').remove();
	var title = $('#discussTitle').val();
	var content = $('#discussContent').html();
	var anony = $('#discussAnony').prop("checked");
	if($('#discussInput').val()!=""){
		if(confirm('something not inputed, still submit?')){
			$.post('/discussInsert',{title:title,content:content,anony:anony,userName:userName,userID:userID},function(res) {
				alert(res);
				window.location.reload();
			});
		}
	}
	else{
		$.post('/discussInsert',{title:title,content:content,anony:anony,userName:userName,userID:userID},function(res) {
			alert(res);
			window.location.reload();
		});
	}
}

var inter;
function selectPanelHendler(){
	if(window.getSelection){
		var selection = window.getSelection();
		var selectStr = selection.toString();
		if(selectStr!=""){
			var range = selection.getRangeAt(0);
			var rect = range.getBoundingClientRect();
			if($("#selectPanel").length==0){
				var well = document.createElement('div');
				well.id = 'selectPanel';
				well.className = 'well well-sm';
				well.innerHTML = '<form class=\'form-inline\'>The <input class=\'form-control\' value=\''+selectStr+'\' readonly > is :</form><br/>'
				well.contentEditable = 'false';
				var buttonGroup = document.createElement('div');
				buttonGroup.className = 'btn-group';
				var button1 = document.createElement('button');
				button1.className = 'btn btn-info';
				button1.innerHTML = 'Link';
				var button3 = document.createElement('button');
				button3.className = 'btn btn-info';
				button3.innerHTML = 'Image';
				var button4 = document.createElement('button');
				button4.className = 'btn btn-info';
				button4.innerHTML = 'Youtube';
				buttonGroup.appendChild(button1);
				buttonGroup.appendChild(button3);
				buttonGroup.appendChild(button4);
				well.appendChild(buttonGroup);
				$('#discussContent').append(well);
				inter = setInterval(selectPanelClearer,100);
			}
			var ori = $('#discussContent').offset();
			var top = rect.top+rect.height-ori.top+150;
			var left = rect.left+rect.width-ori.left;
			$('#selectPanel').css('position','absolute');
			$('#selectPanel').css('top',top+'px');
			$('#selectPanel').css('left',left+'px');
			if(button1&&button3&&button4){
				button1.onclick = selectIsLink;
				button3.onclick = selectIsImage;
				button4.onclick = selectIsYoutube;
			}
		}
		else{
			$('#selectPanel').remove();
		}
	}
}

function selectIsYoutube() {
	// body...
	var src = window.getSelection().toString();
	var range = window.getSelection().getRangeAt(0);
	range.deleteContents();
	window.getSelection().removeAllRanges();
	var iframe = document.createElement("iframe");
	iframe.width=420;
	iframe.height=315;
	if(src.includes("https://www.youtube.com/watch")){
		src = src.substring(32);
		src = 'https://www.youtube.com/embed/'+src;
		if(src.indexOf('&')!=-1)src = src.substring(0,src.indexOf('&'));
	}
	else if(src.includes("https://youtu.be/")){
		src = src.substring(17);
		src = 'https://www.youtube.com/embed/'+src;
		if(src.indexOf('?')!=-1)src = src.substring(0,src.indexOf('?'));
	}
	iframe.src = src;
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('allowFullScreen', '');
	range.insertNode(iframe);
	$('#selectPanel').remove();
}

function selectIsLink() {
	// body...
	var str = window.getSelection().toString();
	var range =  window.getSelection().getRangeAt(0);
	range.deleteContents();
	window.getSelection().removeAllRanges();
	var a = document.createElement('a');
	a.href = str;
	a.innerHTML = str;
	range.insertNode(a);
	$('#selectPanel').remove();
}

function selectIsImage() {
	// body...
	var src = window.getSelection().toString();
	var range = window.getSelection().getRangeAt(0);
	range.deleteContents();
	window.getSelection().removeAllRanges();
	var img = document.createElement('img');
	img.src = src;
	range.insertNode(img);
	$('#selectPanel').remove();
}

function selectPanelClearer() {
	// body...
	if(window.getSelection){
		if(window.getSelection().toString()==''){
			$('#selectPanel').remove();
			clearInterval(inter);
		}
	}
}

var page = 0;
function changeDiscussPage(command) {
	// body...
	if(command=='down'){
		if(page>0)page = page - 1;
	}
	else if(command=='up'){
		page = page + 1;
	}
	switchDiscussPage(page);
}

function switchDiscussPage(page) {
	// body...
	if($('.discussion').length==0)switchDiscussPageCont(page);
	else{
		$('.discussion').animateCss('bounceOutLeft',function() {
			// body...
			switchDiscussPageCont(page);
		});
	}
}

function switchDiscussPageCont(page) {
	// body...
	$('.discussion').remove();
	htmlAction($('#discussAccordion'),'get','getDiscussions','discussPanel',{page:page},function() {
		// body...
		htmlPartial($('#discussAccordion'),'discussAccordionJs');
		$('.discussion').animateCss('bounceInRight',function() {
			// body...
		});
	});
}

var videoPage = 0;
function changeVideoPage(command) {
	// body...
	if(command=='down'){
		if(videoPage>0)videoPage = videoPage - 1;
	}
	else if(command=='up'){
		videoPage = videoPage + 1;
	}
	switchVideoPage(videoPage);
}

function switchVideoPage(page) {
	// body...
	if($(".videoPanel").length==0)switchVideoPageCont(page);
	else{
		$("#videoBody").animateCss('zoomOut',function() {
			// body...
			switchVideoPageCont(page);
		});
	}
}

function switchVideoPageCont(page) {
	// body...
	$(".videoPanel").remove();
	htmlAction($('#videoBody'),'get','getVideos','videoPanel',{page:page},function() {
		// body...
		$("#videoBody").animateCss('zoomIn',function() {
			// body...
		});
	});
}

var imageDataUrl; 

function dragoverHandler(evt) {
	evt.preventDefault();
}

function dropHandler(evt) {//evt 為 DragEvent 物件
	evt.preventDefault();
	var files = evt.dataTransfer.files;//由DataTransfer物件的files屬性取得檔案物件


	for (var i in files) {
		if (files[i].type == 'image/jpeg'||files[i].type == 'image/png') {
			//將圖片在頁面預覽
			var fr = new FileReader();
			fr.onload = function(evt) {
			    var img = evt.target.result;
			    var imgx = document.createElement('img');
			    imgx.src = img;
			    imgx.style="height:100%";
			    document.getElementById('dropDIV').appendChild(imgx);
			    var canvasx = document.createElement('canvas');
			    var ctx = canvasx.getContext("2d");
			    ctx.drawImage(imgx, 0, 0);
			    console.log(fr.result);
				var res = fr.result.split(",");
				imageDataUrl = res[1];
			}  
			fr.readAsDataURL(files[i]);
		}
	}
}
