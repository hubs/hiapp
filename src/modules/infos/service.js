var xhr = require('../utils/xhr');

module.exports = {
    getDatas: function(callback){
        xhr.simpleCall({
            func:'infos'
        },function(res){
            callback(res.data);
        });
    }
};