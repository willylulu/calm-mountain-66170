var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyCb0sk_dhIf67-cHWv5Oo542mFIjzvGdCo');

exports.getDataById = function(id,callback) {
	// body...
	youTube.getById(id,callback);
}