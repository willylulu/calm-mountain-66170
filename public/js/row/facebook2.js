window.fbAsyncInit = function() {
  FB.init({
    appId      : '1179771528730560',
    xfbml      : true,
    version    : 'v2.5'
  });
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      post('/loginByFacebook', {userID:response.authResponse.userID,token:response.authResponse.accessToken});
    } 
    else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
    } 
    else {
    // the user isn't logged in to Facebook.
    location.replace("/notLogin");
    }
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));