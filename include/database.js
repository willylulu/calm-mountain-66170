var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var MongoDatabase;

exports.connect = function(url) {
	// body...
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} 
		else {
			//HURRAY!! We are connected. :)
			console.log('Connection established to', url);
			MongoDatabase = db;
            exports.MongoDatabase = MongoDatabase;
		}
	});
}

exports.findAccount = function(json,callback) {
    // body...
    MongoDatabase.collection('accountPool').find(json).toArray(callback);
}

exports.getVideos= function(limit,start,callback) {
	// body...
	MongoDatabase.collection('youtubePool').find({},{id:1,hostID_FB:1,hostName:1}).skip(start).limit(limit).sort({datefield: 1}).toArray(callback);
}

exports.getDiscussions = function(limit,start,callback) {
    // body...
    MongoDatabase.collection('discussPool').find({},{title:1,userName:1,content:1,time:1,cid:1}).skip(start).limit(limit).sort({datefield: 1}).toArray(callback);
}

exports.getDiscussMessage = function(cid,callback) {
    // body...
    MongoDatabase.collection('discussMessagePool').find({cid:cid},{userName:1,content:1,time:1}).sort({datefield:1}).toArray(callback);
}

exports.getMessage= function(id,callback) {
	// body...
	MongoDatabase.collection('messagePool').find({id:id},{userName:1,message:1,status:1}).sort({datefield: -1}).toArray(callback);
}

exports.getImages= function(id,callback) {
	// body...
	MongoDatabase.collection('imagePool').find({userID:id},{type:1,url:1}).sort({datefield: 1}).toArray(callback);
}

exports.getAccountImage= function(md5_id,callback){
    MongoDatabase.collection('imagePool').find({userID:md5_id},{_id:0,userID:0}).sort({datefield: 1}).toArray(callback);
}

exports.getAccountVideo= function(id,callback){
    MongoDatabase.collection('youtubePool').find({hostID_FB:id},{id:1,hostID_FB:1,hostName:1}).sort({datefield: 1}).toArray(callback);
}

exports.getAccountDiscuss = function(md5_id,callback){
    MongoDatabase.collection('discussPool').find({userID:md5_id},{title:1,userName:1,content:1,time:1,cid:1}).sort({datefield: 1}).toArray(callback);
}

exports.messagePoolInsert = function(id,userName,message,status,callback) {
    // body...
    MongoDatabase.collection('messagePool').insertOne(
    {
        id:id,
        userName:userName,
        message:message,
        status:status,
        time: new Date()
    }
    ,callback);
}

exports.accountInsert = function(account,password,userName,uid,callback) {
    // body...
    MongoDatabase.collection('accountPool').insertOne(
    {
        account:account,
        password:password,
        userName:userName,
        uid:uid,
        time: new Date()
    }
    ,callback);
}

exports.insertImagePool= function(url,id,type,callback) {
	// body...
	MongoDatabase.collection('imagePool').insertOne(
    {
    	url: url,
    	userID: id,
    	type: type,
    	time: new Date()
    }
    ,callback);
}

exports.insertYoutubePool= function(id,hostID_FB,hostName,callback) {
	// body...
	MongoDatabase.collection('youtubePool').insertOne(
    {
        id:id,
        hostID_FB:hostID_FB,
        hostName:hostName,
        time: new Date()
    }
    ,callback);
}

exports.insertDiscussPool = function(title,userName,content,userID,cid,callback) {
    // body...
    MongoDatabase.collection('discussPool').insertOne(
    {
        title:title,
        userName:userName,
        content:content,
        userID:userID,
        cid:cid,
        time: new Date()
    }
    ,callback);
}

exports.insertMessagePool = function(userName,content,userID,cid,mid,callback) {
    // body...
    MongoDatabase.collection('discussMessagePool').insertOne(
    {
        userName:userName,
        content:content,
        userID:userID,
        cid:cid,
        mid:mid,
        time: new Date()
    }
    ,callback);
}

exports.updateDiscussPool=function (cid,content,userID,callback) {
    // body...
    MongoDatabase.collection('discussPool').update(
    {
        cid:cid,
        userID:userID
    },
    {
        $set:{content:content}
    },
    { 
        multi: false
    });
}

exports.getNickname = function(userID,url,callback) {
    // body...
    MongoDatabase.collection('imagePool').find({userID:userID,url:url},{nickname:1}).toArray(callback);
}

exports.setNickname = function(userID,url,nickname,callback) {
    // body...
    MongoDatabase.collection('imagePool').update(
    {
        userID:userID,
        url:url
    },
    {
        $set:{nickname:nickname}
    },
    { 
        multi: true
    });
    callback();
}

exports.deleteImagePool= function(id,url,callback) {
	// body...
	MongoDatabase.collection('imagePool').deleteOne(
        { 
            userID: id,
            url:url 
        },callback);
}

exports.deleteYoutubePool= function(id,callback) {
	// body...
	MongoDatabase.collection('youtubePool').deleteOne(
        { 
            id:id 
        },callback);
}

exports.deleteDiscussPool = function(cid,userID,callback) {
    // body...
    MongoDatabase.collection('discussPool').deleteOne(
        { 
            cid:cid,
            userID,userID
        },callback);
}