require('./chat.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./chat.tpl.html');

module.exports = {
    init: function(){
        this.bindEvents();
        this.getDatas();
    },
    getDatas: function(){
        var that = this;
        service.loadChatHistory(function(tl){
            that.renderDatas(tl);
        });
    },
    renderDatas: function(tl){
        $$.each(tl,function(index,val){
            //１：文本，２：图片，３：语音
            if(val.msg_type==1){
                val.text =   val.msg;
            }else if(val.msg_type==2){
                val.text =  "[图片]";
            }else if(val.msg_type==3){
                val.text =  "[语音]";
            }
        });
        var renderData = {
            chatHistorys: tl
        };
        var output = appFunc.renderTpl(template, renderData);
        $$('#chatView').find('.chat-list').html(output);
    },

    chatListClick:function(){
        console.log("hello click 11");
        hiApp.modal({
            verticalButtons: true,
            buttons: [
                {
                    text: '置顶聊天',
                    onClick: function() {
                        hiApp.alert('You clicked first button!')
                    }
                },
                {
                    text: '删除该聊天',
                    onClick: function() {
                        hiApp.alert('You clicked second button!')
                    }
                }
            ]
        })
    },

    bindEvents: function(){
        var bindings = [{
            element: '#chatView',
            selector: '.chat-list .item-content',
            event: 'click',
            handler: this.chatListClick
        }];

        appFunc.bindEvents(bindings);
    }
};

