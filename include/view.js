var fs = require('fs');
var ejs = require('ejs');
var func = require('./function.js');
class View
{
	constructor(app)
	{
		var that = this;
		app.post('/view',function (req,res) {
			var data = func.antiXSS(req.body);
			that.getView(data.action,data.json,function(content) {
				res.send(content);
			});
		});
	}

	getView(action,json,callback) {
		fs.readFile(__dirname+'/ejs/'+action+'.ejs',function(error, data){
		    if(error){ 
		        callback('error');
		    }
		    else {
		        var rowContent = data.toString();
		        var content = ejs.render(rowContent,json);
		        callback(content);
		    }
		});
	}
}

module.exports = View;