var xhr = require('../utils/xhr');

module.exports = {
    getAnswers: function(callback) {
        xhr.simpleCall({
            func: 'answers'
        }, function (res) {
            callback(res.data);
        });
    },
    getMessages: function(callback){
        xhr.simpleCall({
            func:'message'
        },function(res) {
            callback(res.data);
        });
    },
    getFaces:function(callback){
        var _faces  =   [];
        for(var i=1;i<76;i++){
            _faces.push({img:"/img/face/"+i+".gif",name:'[em_'+i+']'});
        }
        callback(_faces)
    }
};