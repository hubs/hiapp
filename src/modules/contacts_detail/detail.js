require('./detail.less');

var appFunc     = require('../utils/appFunc'),
    service     = require('./service'),
    template    = require('./detail.tpl.html'),
    db          = require("../db/db"),
    table       = require("../db/table"),
    Content     = require("../app/content")

    ;

var contacts = {
    init: function(query){

        appFunc.hideToolbar();

        var _uid    =   parseInt(query.uid);
        console.log("uid = "+_uid);
        db.dbFindOne(table.T_MEMBER,{id:_uid},function(err,doc){
            if(err){
                appFunc.hiAlert(err);
                return;
            }
            console.log(doc);
            doc.filename    = Content.IMAGE_URL+doc.filename;
            doc.sex         = doc.sex=='1'?'icon-nan':'icon-nv';
            doc.lastTalk    = db.dbFindOne(table.T_TALK,{add_uid:doc.id},function(err,res){
                return res.content;
            });

            var output = appFunc.renderTpl(template, {obj:doc});
            $$('.contact-detail-page').html(output);
        });
        this.bindEvents();
    },

    beforeLoadContacts: function(){
        if($$('#contactView .contacts-list .list-group .contact-item').length > 0) {
            return false;
        }else {
            hiApp.showIndicator();
            return true;
        }
    },
    showTelAction:function(){
        var buttons1 = [
            {
                text: '操作',
                label: true
            },
            {
                text: '<a class="external actions-link" href="tel:13788581069">拨打电话</a>',
                bold: true
            },
            {
                text: '<a class="external actions-link" href="sms:13788581069">发送信息</a>',
            }
        ];
        var buttons2 = [
            {
                text: '取消',
                color: 'red'
            }
        ];
        var groups = [buttons1, buttons2];
        hiApp.actions(groups);
    },
    bindEvents: function(){
        var bindings = [{
            element: '.detail-tel',
            event: 'click',
            handler: this.showTelAction

        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = contacts;
