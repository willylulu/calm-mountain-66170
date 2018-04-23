var FB = require('fb');

exports.getFacebookAccount = function(token,id,callback){
	FB.setAccessToken(token);
    FB.api(id,callback);
}

exports.getFacebookName = function(id,callback){
	FB.api("/"+id,callback);
}