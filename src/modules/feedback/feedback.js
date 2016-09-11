var appFunc = require('../utils/appFunc'),
    socket  = require('../socket/socket'),
    store   = require("../utils/localStore")
    ;

module.exports = {
    init: function(){
        appFunc.hideToolbar();

        this.bindEvents();
    },
    sendFeedback: function(){
        hiApp.showPreloader(i18n.index.sending);
        socket.sys_feedBack({
            username        : store.getStorageValue("username"),
            content         : $$("#feedbackMessageText").val()
        },function(info){
            hiApp.hidePreloader();
            appFunc.hiAlert(info);
            $$("#feedbackMessageText").val("");
        });

    },
    bindEvents: function(){
        var bindings = [{
            element: '.send-feedback',
            event: 'click',
            handler: this.sendFeedback
        }];

        appFunc.bindEvents(bindings);
    }
};