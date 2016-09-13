var appFunc = require('../utils/appFunc'),
    socket  = require('../socket/socket'),
    store   = require("../utils/localStore")
    ;

module.exports = {
    init: function(){
        appFunc.hideToolbar();

        this.bindEvents();
    },
    changPassword: function(){
        var _old_pass   = $$("#old-password").val().trim();
        var _new_pass   = $$("#new-password").val().trim();
        var _new_ag_pass= $$("#new-ag-password").val().trim();

        if(_old_pass==''){
            hiApp.alert(i18n.password.old_not_null);
            return false;
        }

        if(_new_pass==''){
            hiApp.alert(i18n.password.new_not_null);
            return false;
        }

        if(_new_ag_pass!=_new_pass){
            hiApp.alert(i18n.password.new_not_eq);
            return false;
        }

        hiApp.showPreloader(i18n.index.sending);
        socket.base_edit_password({
                oldPass     :_old_pass,
                newPass     :_new_pass,
                newPassAgain:_new_ag_pass
        },function(info){
            hiApp.hidePreloader();
            appFunc.hiAlert(info);
            $$("#old-password").val("");
            $$("#new-password").val("");
            $$("#new-ag-password").val("");
            store.setSyncStorageValue("password",appFunc.encrypt(_new_pass));
        });
    },
    bindEvents: function(){
        var bindings = [{
            element: '.chang-password',
            event: 'click',
            handler: this.changPassword
        }];

        appFunc.bindEvents(bindings);
    }
};