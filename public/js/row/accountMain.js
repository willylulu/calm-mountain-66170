function accountMain(id) {
	// body...
	htmlActionSingle($('#myPictures'),'post','getAccountImage','accountImage',{userID:id});
	htmlActionSingle($('#myVideos'),'post','getAccountVideo','accountVideo',{userID:id});
	htmlAction($('#myDiscussions'),'post','getAccountDiscuss','accountDiscuss',{userID:id,page:0},function() {
		htmlPartial($('#myDiscussions'),'accountDiscussJs');
	});
}
