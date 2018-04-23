var renderJson = {};

renderJson.videoPanel = function(data,key) {
	return{
		id:data.id,
		hostName:data.hostName
	};
}

renderJson.discussPanel = function(data,key) {
	return{
		cid:data.cid,
		title:data.title,
		content:data.content,
		time:new Date(data.time),
		name:data.userName
	};
}

renderJson.accountDiscuss = function(data,key) {
	// body...
	return{
		cid:data.cid,
		title:data.title,
		content:data.content,
		time:new Date(data.time),
		name:data.userName
	};
}

renderJson.accountImage = function(data) {
	return{
		images : data
	};
}

renderJson.accountVideo = function(data) {
	return{
		videos : data
	};
}

renderJson.discussMessagePanel = function(data,key,json) {
	// body...
	return{
		userName:data.userName,
		content:data.content,
		time:new Date(data.time),
		cid:json.cid
	};
}

function htmlAction(parent,method,controller,view,json,callback) {
	// body...
	if(method=='get'){
		$.get('/'+controller,json,function(response) {
			// body...
			setTimeout(function() {
				var ejs = new EJS({url:'/'+view});
				for(var key in response){
					var data = response[key];
					setTimeout(function(argument) {
						// body...
					},0);
					var html = ejs.render(renderJson[view](data,key,json));
					parent.append(html);
				}
				if(callback)callback();
			},0);
		});
	}
	else if(method=='post'){
		$.post('/'+controller,json,function(response) {
			// body...
			setTimeout(function() {
				// body...
				var ejs = new EJS({url:'/'+view});
				for(var key in response){
					var data = response[key];
					var html = ejs.render(renderJson[view](data,key,json));
					parent.append(html);
				}
				if(callback)callback();
			},0);
		});
	}
}

function htmlActionSingle(parent,method,controller,view,json,callback) {
	// body...
	if(method=='get'){
		$.get('/'+controller,json,function(response) {
			// body...
			setTimeout(function() {
				// body...
				var ejs = new EJS({url:'/'+view});
				var html = ejs.render(renderJson[view](response));
				parent.append(html);
				if(callback)callback();
			},0);
		});
	}
	else if(method=='post'){
		$.post('/'+controller,json,function(response) {
			// body..
			setTimeout(function() {
				// body...
				var ejs = new EJS({url:'/'+view});
				var html = ejs.render(renderJson[view](response));
				parent.append(html);
				if(callback)callback();
			});
		});
	}
}

function htmlPartial(parent,view) {
	// body...
	setTimeout(function() {
		// body...
		var ejs = new EJS({url:'/'+view});
		var html = ejs.render();
		parent.append(html);
	},0);
}