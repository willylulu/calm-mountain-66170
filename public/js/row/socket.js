var socket = io.connect("https://calm-mountain-66170.herokuapp.com");

socket.on('firstShakeHand',function(data){
    console.log(data);
});

socket.on('sendMessage',function(data){
	var msg_div = document.createElement("div");
	var cssType;
	if(data.status=="startStream")cssType="alert-info";
	else if(data.status=="prepare")cssType="alert alert-warning";
	else if(data.status=="Video")cssType="alert-danger";
    msg_div.className = "msg alert "+cssType;
    msg_div.innerHTML = data.userName +" : "+ data.message;
    msg_div.style = "width:20vw";
    $('#message_' + data.id).append(msg_div);
});