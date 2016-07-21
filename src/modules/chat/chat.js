require('./chat.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./chat.tpl.html');

var contacts = {
    init: function(){
        contacts.bindEvents();
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

    bindEvents: function(){
        var bindings = [{
            element: '#contactView',
            event: 'show',
            handler: contacts.loadContacts
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = contacts;
