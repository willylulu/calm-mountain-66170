var imgur = require('imgur');
imgur.setClientId('c482b7cba1c2d17');

exports.uploadImageByBase64 = function(data,callback) {
	// body...
	imgur.uploadBase64(data)
    .then(callback)
    .catch(function (err) {
        console.error(err.message);
    });
}

exports.uploadImageByUrl = function(url,callback){
	imgur.uploadUrl(url)
    .then(callback)
    .catch(function (err) {
        console.error(err.message);
    });
}