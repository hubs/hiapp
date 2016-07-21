var xhr = require('../utils/xhr');

module.exports = {
    loadChatHistory: function(callback) {
        xhr.simpleCall({
            func: 'chat'
        }, function (res) {
            callback(res.data);
        });
    }
};