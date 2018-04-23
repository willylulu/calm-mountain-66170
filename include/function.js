var htmlspecialchars = require('htmlspecialchars');
var Md5 = require('js-md5');
class func
{
    static md5(a){
        return Md5(a);
    }

    static dberror(){
        var temp = {};
        temp.result = "db error";
        temp.code = -2;
        return temp;
    }

    static result(result,code){
        var temp = {};
        temp.result = result;
        temp.code = code;
        return temp;
    }

    static antiXSS(data){
        var ans = data;
        for(var key in ans){
            if(typeof(ans[key])=="string"){
                ans[key] = htmlspecialchars(ans[key]);
            }
        }
        return ans;
    }

    static generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };
}

module.exports = func;