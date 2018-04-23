module.exports = class
{
	construct(url)
	{
		this.mongodb = require('mongodb');
		this.MongoClient = mongodb.MongoClient;
		this.MongoClient.connect(url, function (err, db) 
		{
			if (err) 
			{
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				//HURRAY!! We are connected. :)
				console.log('Connection established to', url);
				this.MongoDatabase = db;
			}
		});
	}

	findAccount(json,callback)	
	{
		this.MongoDatabase.collection('accountPool').find(json).toArray(callback);
	}

	getVideos(limit,start,callback) 
	{
		// body...
		this.MongoDatabase.collection('youtubePool').find({},{id:1,hostID_FB:1,hostName:1}).skip(start).limit(limit).sort({datefield: 1}).toArray(callback);
	}

	getDiscussions(limit,start,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('discussPool').find({},{title:1,userName:1,content:1,time:1,cid:1}).skip(start).limit(limit).sort({datefield: 1}).toArray(callback);
	}

	getDiscussMessage(cid,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('discussMessagePool').find({cid:cid},{userName:1,content:1,time:1}).sort({datefield:1}).toArray(callback);
	}

	getMessage(id,callback) 
	{
		// body...
		this.MongoDatabase.collection('messagePool').find({id:id},{userName:1,message:1,status:1}).sort({datefield: -1}).toArray(callback);
	}

	getImages(id,callback) 
	{
		// body...
		this.MongoDatabase.collection('imagePool').find({userID:id},{type:1,url:1}).sort({datefield: 1}).toArray(callback);
	}

	getAccountImage(md5_id,callback)
	{
	    this.MongoDatabase.collection('imagePool').find({userID:md5_id},{_id:0,userID:0}).sort({datefield: 1}).toArray(callback);
	}

	getAccountVideo(id,callback)
	{
	    this.MongoDatabase.collection('youtubePool').find({hostID_FB:id},{id:1,hostID_FB:1,hostName:1}).sort({datefield: 1}).toArray(callback);
	}

	getAccountDiscuss(md5_id,callback)
	{
	    this.MongoDatabase.collection('discussPool').find({userID:md5_id},{title:1,userName:1,content:1,time:1,cid:1}).sort({datefield: 1}).toArray(callback);
	}

	messagePoolInsert(id,userName,message,status,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('messagePool').insertOne(
	    {
	        id:id,
	        userName:userName,
	        message:message,
	        status:status,
	        time: new Date()
	    }
	    ,callback);
	}

	accountInsert(account,password,userName,uid,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('accountPool').insertOne(
	    {
	        account:account,
	        password:password,
	        userName:userName,
	        uid:uid,
	        time: new Date()
	    }
	    ,callback);
	}

	insertImagePool(url,id,type,callback) 
	{
		// body...
		this.MongoDatabase.collection('imagePool').insertOne(
	    {
	    	url: url,
	    	userID: id,
	    	type: type,
	    	time: new Date()
	    }
	    ,callback);
	}

	insertYoutubePool(id,hostID_FB,hostName,callback) 
	{
		// body...
		this.MongoDatabase.collection('youtubePool').insertOne(
	    {
	        id:id,
	        hostID_FB:hostID_FB,
	        hostName:hostName,
	        time: new Date()
	    }
	    ,callback);
	}

	insertDiscussPool(title,userName,content,userID,cid,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('discussPool').insertOne(
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

	insertMessagePool(userName,content,userID,cid,mid,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('discussMessagePool').insertOne(
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

	updateDiscussPoo(cid,content,userID,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('discussPool').update(
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

	getNickname(userID,url,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('imagePool').find({userID:userID,url:url},{nickname:1}).toArray(callback);
	}

	setNickname(userID,url,nickname,callback) 
	{
	    // body...
	    this.MongoDatabase.collection('imagePool').update(
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

	deleteImagePool(id,url,callback) 
	{
		this.MongoDatabase.collection('imagePool').deleteOne(
        { 
            userID: id,
            url:url 
        },callback);
	}

	deleteYoutubePool(id,callback) 
	{
		this.MongoDatabase.collection('youtubePool').deleteOne(
        { 
            id:id 
        },callback);
	}

	deleteDiscussPool(cid,userID,callback) 
	{
	    this.MongoDatabase.collection('discussPool').deleteOne(
        { 
            cid:cid,
            userID,userID
        },callback);
	}
}