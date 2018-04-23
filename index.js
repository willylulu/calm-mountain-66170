var http = require('http');
var express = require('express');
var session = require('express-session');
var path = require('path');
var md5 = require('js-md5');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var htmlspecialchars = require('htmlspecialchars');

var app = express();
var httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(httpServer);

var clients={};
var socketIds={};

var database = require('./include/database.js');
var picture = require('./include/picture.js');
var youtube = require('./include/youtube.js');
var facebook = require('./include/facebook.js');

addView('discussPanel');
addView('videoPanel');
addView('accountDiscuss');
addView('accountDiscussJs');
addView('discussAccordionJs');
addView('discussMessagePanel');
addView('accountImage');
addView('accountVideo');

database.connect('mongodb://willy3364:c0806449@ds021994.mlab.com:21994/luludatabase');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(cors());
app.use(compression());
app.use(session({
  secret: '12345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678',
  cookie: { maxAge: 60 * 1000 }
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', true);

var View = require('./include/view.js');
var view = new View(app);

app.get('/',function (req,res) {
    if(req.session.isVisitYouhub){
        loginByDefault(req,res,req.session.account,req.session.password);
    }
    else{
        var noLoginMan = {};
	    noLoginMan.name = "none";
	    noLoginMan.id = "-1";
	    res.render('index',{clients:clients,states:'no login',user:noLoginMan});
    }
});

app.get('/session',function (req,res) {
    // body...
    var json = {isVisitYouhub:req.session.isVisitYouhub,uid:req.session.uid};
    res.send(json);
});

app.get('/destorySession',function(req,res) {
    // body...
    req.session.destroy(function(err) {
        // cannot access session here
    });
    res.send("A");
});

app.post('/loginByFacebook',function(req,res) {
    var data = req.body;
    data = antiXSS(data);
    facebook.getFacebookAccount(data.token,data.userID,function(FBres) {
        res.render('index',{
            clients:clients,
            states:'login success',
            user:FBres
        });
    });
});

app.post('/loginByDefault',function(req,res) {
    // body...
    var data = antiXSS(req.body);
    loginByDefault(req,res,data.account,data.password);
});

function loginByDefault(req,res,account,password){
    database.findAccount({account:account,password:password},function(err,accountRes) {
        // body...
        console.log(accountRes);
        if(accountRes.length==0){
            var noLoginMan = {};
            noLoginMan.name = "none";
            noLoginMan.id = "-1";
            res.render('index',{clients:clients,states:'no login',user:noLoginMan});
        }
        else{
            req.session.isVisitYouhub = true;
            req.session.account = account;
            req.session.password = password;
            req.session.uid = accountRes[0].uid;
            var user = {};
            user.id = accountRes[0].uid;
            user.name = accountRes[0].userName;
            res.render('index',{
                clients:clients,
                states:'login success',
                user:user
            });
        }
    });
}

app.post('/register',function(req,res) {
    var data = antiXSS(req.body);
    var uid = generateUUID();
    database.findAccount({account:data.account},function(err,accountRes) {
        if(accountRes.length==0){
            database.accountInsert(data.account,data.password,data.userName,uid,success.bind({res:res}));
        }
        else{
            res.send("Account has been used !");
        }
    });
});

app.get('/hangoutXml',function (req,res) {
	res.sendFile(__dirname + '/app.xml');
});

app.get('/geturl',function (req,res) {
    var sendFiles = [];
    for (var key in clients) {
        sendFiles.push(clients[key]);
    }
	res.send(sendFiles);
});

app.get('/getVideos',function (req,res) {
    var page = parseInt(req.param('page'));
    var limit = 20;
    var start = limit*page;
    database.getVideos(limit,start,sendBack.bind({res:res}));
});

app.get('/getDiscussions',function(req,res) {
    var page = parseInt(req.param('page'));
    var limit = 5;
    var start = limit*page;
    database.getDiscussions(limit,start,sendBack.bind({res:res}));
});

app.post('/getMessage',function (req,res) {
    var data = antiXSS(req.body);
    database.getMessage(data.id,sendBack.bind({res:res}));
});

app.post('/uploadImage',function(req,res) {
	var data = antiXSS(req.body);
    picture.uploadImageByBase64(data.data,function (json) {
        database.insertImagePool(json.data.link,data.userID,data.type,success.bind({res:res}));
    });
});

app.post('/saveImage',function(req,res) {
	var data = antiXSS(req.body);
    picture.uploadImageByUrl(data.url,function (json) {
        database.insertImagePool(json.data.link,data.userID,data.type,success.bind({res:res}));
    });
});

app.post('/getImages',function(req,res) {
	var data = antiXSS(req.body);
    database.getImages(data.userID,sendBack.bind({res:res}));
});

app.post('/getAccountImage',function(req,res) {
    var data = antiXSS(req.body);
    database.getAccountImage(md5(data.userID),sendBack.bind({res:res}));
});

app.post('/getAccountVideo',function(req,res) {
    var data = antiXSS(req.body);
    database.getAccountVideo(data.userID,sendBack.bind({res:res}));
});

app.post('/getAccountDiscuss',function(req,res) {
    var data = antiXSS(req.body);
    database.getAccountDiscuss(md5(data.userID),sendBack.bind({res:res}));
});

app.post('/getDiscussionMessages',function(req,res) {
    var data = antiXSS(req.body);
    database.getDiscussMessage(data.cid,sendBack.bind({res:res}));
});

app.post('/sendMessageVideo',function (req,res) {
    var data = antiXSS(req.body);
    database.messagePoolInsert(data.id,data.userName,data.message,"Video",success.bind({res:res}));
});

app.post('/discussUpdate',function (req,res) {
    var data = req.body;
    if(data.content!=""){
        data.content = data.content.replace(/script/g, "");
        database.updateDiscussPool(data.cid,data.content,data.userID,success.bind({res:res}));
    }else{
        res.send("empty string");
    }
});

app.post('/discussInsert',function (req,res) {
    var data = req.body;
    data.title = antiXSS(data.title);
    if(data.content!=""){
        var cid = generateUUID();
        data.content = data.content.replace(/script/g, "");
        if(data.anony=='true'){
            database.insertDiscussPool(data.title,"Anonymous",data.content,data.userID,cid,success.bind({res:res}));
        }
        else{
            database.insertDiscussPool(data.title,data.userName,data.content,data.userID,cid,success.bind({res:res}));
        }
    }else{
        res.send("empty string");
    }
});

app.post('/discussMessageInsert',function (req,res) {
    var data = req.body;
    if(data.content!=""){
        var mid = generateUUID();
        console.log(data);
        data.content = data.content.replace(/script/g, "");
        database.insertMessagePool(data.userName,data.content,data.userID,data.cid,mid,success.bind({res:res}));
    }else{
        res.send("empty string");
    }
});

app.post('/deleteImage',function(req,res) {
    var data = antiXSS(req.body);
    database.deleteImagePool(data.userID,data.url,success.bind({res:res}));
});

app.post('/deleteVideo',function(req,res) {
    var data = antiXSS(req.body);
    database.deleteYoutubePool(id,success.bind({res:res}));
});

app.post('/discussDelete',function(req,res) {
    var data = antiXSS(req.body);
    database.deleteDiscussPool(data.cid,data.userID,success.bind({res:res}));
});

app.post('/getYoutubeData',function (req,res) {
    var data = antiXSS(req.body);
    youtube.getDataById(data.id,function(error, result) {
        if (error) {
            res.send(error);
        }
        else {
            var answer = {};
            answer.snippet = result.items[0].snippet;
            answer.statistics = result.items[0].statistics;
            res.send(answer);
        }
    });
});

app.post('/setNickname',function(req,res) {
    var data = antiXSS(req.body);
    if(data.nickname!=""){
        database.setNickname(data.userID,data.url,data.nickname,success.bind({res:res}));
    }
});

app.post('/getNickname',function(req,res) {
    var data = antiXSS(req.body);
    database.getNickname(data.userID,data.url,sendBack.bind({res:res}));
});

io.sockets.on('connection',function(socket){
	socket.emit('firstShakeHand',"Hello!");
    socket.on('sentYouInfo',function(data){
        data = antiXSS(data);
        var client = {};
        client.id = data.id;
        client.hostID_FB = data.hostID_FB;
        client.status = data.status;
        client.audients = [];
        clients[socket.id] = client;
        facebook.getFacebookName(data.hostID_FB,function (response) {
            if (response && !response.error) {
            /* handle the result */
                client.hostName = response.name;
            }
        });
        socketIds[data.id] = socket.id;
        socket.emit('sentYouInfoCheck','OK');
    });
    socket.on('changeClientStatus',function(data) {
        data = antiXSS(data);
        var client = clients[socket.id];
        client.status = data.status;
    });
    socket.on('sendMessage',function(data){
        if(clients[socketIds[data.id]] != undefined && data.message!=""){
            data = antiXSS(data);
            io.to(socketIds[data.id]).emit('sendMessage',{'message':data.message,userName:data.userName});
            var client = clients[socketIds[data.id]];
            for (var i = 0; i < client.audients.length; i++) {
                io.to(client.audients[i]).emit('sendMessage',{id:client.id,message:data.message,userName:data.userName,status:client.status});
            }
            if(client.status=="startStream"){
                database.insertMessagePool(client.id,data.userName,data.message,client.status,empty);
            }
        }
    });
    socket.on('registerStream',function(data){
        if(clients[socketIds[data.id]] != undefined)
        {
            data = antiXSS(data);
            var client = clients[socketIds[data.id]];
            if(client.audients.indexOf(socket.id)==-1)
            {
                client.audients.push(socket.id);
            }
        }
    });
    socket.on('unregisterStream',function(data){
        if(clients[socketIds[data.id]] != undefined)
        {
            data = antiXSS(data);
            var client = clients[socketIds[data.id]];
            if(client.audients.indexOf(socket.id)!=-1)
            {
                client.audients.splice(client.audients.indexOf(socket.id), 1);
            }
        }
    });
    socket.on('disconnect', function() {
        if(clients[socket.id] != undefined)
        {
            for (var i = 0; i < clients[socket.id].audients.length; i++) {
                io.to(clients[socket.id].audients[i]).emit('sendMessage',{userName:clients[socket.id].hostName,id:clients[socket.id].id,message:'Host has been end the Stream.',status:"Video"});
            }
            if(clients[socket.id].status=="startStream"){
                database.insertYoutubePool(clients[socket.id].id,clients[socket.id].hostID_FB,clients[socket.id].hostName,empty);
            }
            delete clients[socket.id];
        }
    });
});

function antiXSS(data) {
    var ans = data;
    for(var key in ans){
        if(typeof(ans[key])=="string"){
            ans[key] = htmlspecialchars(ans[key]);
        }
    }
    return ans;
}

function empty(err,data) {}

function success(err,data) {
    if(!err)this.res.send("Success!");
    else{
        this.res.send(err);
    }
}

function sendBack(err,data) {
    if(!err)this.res.send(data);
    else{
        this.res.send(err);
    }
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function addView(view) {
    // body...
    app.get('/'+view+'.ejs',function(req,res) {
        res.sendFile(__dirname +'/views/'+view+'.ejs');
    });
}
