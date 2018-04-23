$('.streamModal').on('shown.bs.modal',streamModalShowHendler);
$('.streamModal').on('hidden.bs.modal',streamModalHideHendler);
$("#facebookLoginButton").click(facebookLoginButtonHendler);
$('#uploadImageSubmitButton').click(uploadImageSubmitButtonHendler);
$('.deleteImageByUrlButton').click(deleteImageByUrlButtonHendler);
$('#discussContent').focus(discussContentFocusHendler);
$("#discussContent").mouseup(selectPanelHendler);
$('#discussInput').keypress(discussInputHendler);
$('#discussImage').click(discussImageHendler);
$('#discussYoutube').click(discussYoutubeHendler);
$('#discussLink').click(discussLinkHendler);
$('#discussSubmit').click(discussSubmitHendler);

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	$('.modal-dialog').css('width','95%');
	$('.uploadPicture').hover(function() {
	// body...
		$(this).animate({width: '30%'},200);
			
	},function() {
		// body...
		$(this).animate({width: '20%'},200);
	});
	$('.uploadPicture').css('width','20%');
}

htmlAction($('#discussAccordion'),'get','getDiscussions','discussPanel',{page:0},function() {
	htmlPartial($('#discussAccordion'),'discussAccordionJs');
});
htmlAction($('#videoBody'),'get','getVideos','videoPanel',{page:0});