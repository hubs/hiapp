var appFunc = require('../utils/appFunc');

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


       /* hiApp.showPreloader(i18n.index.sending);
        setTimeout(function(){
            hiApp.hidePreloader();
            hiApp.alert(i18n.setting.feed_back_result);
        },1000);*/
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