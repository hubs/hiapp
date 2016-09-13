var socket          = require("./socket/socket"),
    db              = require("./db/db"),
    localforage     = require('localforage'),
    store           = require("./utils/localStore");
//初始化页面
module.exports = {
    init: function () {
        db.init();
        socket.init();

        //由于有二种驱动保存前辍
        var _driver = localforage.driver();

        if(_driver!=store.getValue("storage")){
            store.setValue("storage",_driver);
            //如果是已登录了,则需要同步一下数据
            if(socket.getLoginStatus()){
                socket.base_get_offline_msg();
            }
        }

    },
};