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
        var text  = $$("#feedbackMessageText").val();
        if(appFunc.getCharLength(text) < 4){
            hiApp.alert(i18n.index.err_text_too_short);
            return false;
        }

        hiApp.showPreloader(i18n.index.sending);
        socket.sys_feedBack({
            username        : store.getStorageValue("username"),
            content         : text
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