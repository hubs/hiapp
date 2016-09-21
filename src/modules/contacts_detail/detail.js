require('./detail.less');

var appFunc     = require('../utils/appFunc'),
    service     = require('./service'),
    template    = require('./detail.tpl.html'),
    db          = require("../db/db"),
    table       = require("../db/table"),
    Content     = require("../app/content"),
    socket      = require("../socket/socket"),
    dbHelper    = require("../utils/dbHelper")

    ;

var pack = {
    init: function(query){

        appFunc.hideToolbar();

        var _uid    =   parseInt(query.uid);
        console.log("_uid = "+_uid);
        db.dbFindOne(table.T_MEMBER,{id:_uid},function(err,doc){
            if(err){
                appFunc.hiAlert(err);
                return;
            }
            if(doc==null){
                return;
            }
            console.log(doc);

            /**
             * member_id       : '',//需要查看会员的最新信息
             *   update_time     : '',//本地会员最后更新的时间
             *   token           : ''
             *   fromUid         : '',
             */
            socket.chat_get_member({
                member_id   : _uid,
                update_time : doc.update_time,//每次都获取最新的算了
            },function(res){
                res     =   JSON.parse(res);
                socket._pri_update_data(table.T_MEMBER,res);
                pack._get_member_info(res);
                var output = appFunc.renderTpl(template, {obj:res});

                if(res.username!=doc.username){
                    dbHelper.dbUpdateUsername(res.username,res.id);
                }

                if(res.filename!=doc.filename){
                    appFunc.setFilenameByUid(res.id,res.filename);
                }

                $$('.contact-detail-page').html(output);
            });

            pack._get_member_info(doc);
            var output = appFunc.renderTpl(template, {obj:doc});
            $$('.contact-detail-page').html(output);

            console.log("redner end");
        });
        this.bindEvents();
    },

    _get_member_info:function(doc){
        doc.filename    = Content.IMAGE_URL+doc.filename;
        doc.sex         = doc.sex=='1'?'icon-nan':'icon-nv';
        doc.lastTalk    = db.dbFindOne(table.T_TALK,{add_uid:doc.id},function(err,res){
            console.log("talk = ");
            console.log(res);
            if(res!=null) {
                return $$(".lastTalk").html(res.content);
            }
        });
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
        console.log("call tel");
    },
    bindEvents: function(){
        var bindings = [{
            element: '.contact-detail-page',
            selector: '.detail-tel',
            event: 'click',
            handler: this.showTelAction

        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;
