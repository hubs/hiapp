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
        //增加欢迎界面
        this._check_show_welcome();

    },
    _check_show_welcome:function(){
        if(store.getStorageValue("welcome_skip")=='true') {
            $$("#footer").show();
        }else{
            $$("#welcome-page").show();
            hiApp.swiper('.swiper-container', {
                pagination:'.swiper-pagination'
            });
            $$(".welcomescreen-closebtn").click(function(){
                console.log("skip!");
                store.setStorageValue("welcome_skip",true);
                $$("#welcome-page").hide();
                $$("#footer").show();
            });
        }
    }
};