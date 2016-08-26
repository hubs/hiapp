var socket          = require("./socket/socket"),
    db              = require("./db/db");
//初始化页面
module.exports = {
    init: function () {
        db.init();
        socket.init();
    },
};