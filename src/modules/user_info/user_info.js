require('./user_info.less');
var appFunc     = require('../utils/appFunc'),
    template    = require('./user_info.tpl.html'),
    socket      = require('../socket/socket'),
    db          = require("../db/db"),
    table       = require("../db/table"),
    store       = require("../utils/localStore")
    ;

module.exports = {
    init: function(){
        appFunc.hideToolbar();

        db.dbFindOne(table.T_MEMBER,{id:store.getIntValue("uid")},function(err,doc){
           if(err){
               appFunc.hiAlert(err);
               return;
           }
            console.log(doc);
            var output = appFunc.renderTpl(template, {obj:doc});
            $$('#user-info-content').html(output);

        });
        this.bindEvents();
    },
    //更新
    updateUser: function(){
       // hiApp.showPreloader(i18n.index.sending);
        socket.sys_edit_member({
            username    : $$("#input_username").val(),
            email       : $$("#email").val(),
            hobby       : $$("#hobby").val(),
            duties      : $$("#duties").val(),
            company     : $$("#company").val(),
            sex         : $$("#sex").val(),
            remark      : $$("#remark").val()
        },function(info){
            hiApp.hidePreloader();
            appFunc.hiAlert(info);
        });
    },

    //默认选中
    selectText: function(){
         $$(this).focus().val($$(this).val());//将光标移到文字后面
    },

    bindEvents: function(){
        var bindings = [{
            element: '.update-user',
            event: 'click',
            handler: this.updateUser
        },{
            element: '.item-input input',
            event: 'click',
            handler: this.selectText
        }];


        appFunc.bindEvents(bindings);
    }
};