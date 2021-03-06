require('./setting.less');

var appFunc     = require('../utils/appFunc'),
    template    = require('./setting.tpl.html'),
    socket      = require('../socket/socket'),
    store       = require("../utils/localStore")
    ;

var settingView = {
    init: function(){
        settingView.bindEvents();
    },
    renderSetting: function(){
        //if($$('#settingView .page-content')[0]) return;

        hiApp.showIndicator();

        var renderData = {
            filename    : store.getStorageValue("filename"),
            username    : store.getStorageValue("username"),
            chat_name   : store.getStorageValue("tel")
        };

        console.log(renderData);

        var output = appFunc.renderTpl(template, renderData);
        $$('#settingView .page[data-page="setting"]').html(output);

        hiApp.hideIndicator();
    },
    logOut: function(){
        hiApp.confirm(i18n.setting.confirm_logout,function(){
            socket.base_logut();
        });
    },
    bindEvents: function(){
        var bindings = [{
            element: '#settingView',
            event: 'show',
            handler: settingView.renderSetting
        },{
            element: '#settingView',
            selector: '.logout-button',
            event: 'click',
            handler: settingView.logOut
        },{
            element: '#settingView',
            selector: '.update-button',
            event: 'click',
            //handler: settingView.checkVersion
        }];
        appFunc.bindEvents(bindings);
    }
};

module.exports = settingView;