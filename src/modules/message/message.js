require('./message.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./message.tpl.html');

var conversationStarted = false,
    answers = {},
    answerTimeout,
    messageLayout;
var uid   = 3;
module.exports = {
    init: function(query){
        var that = this;

        appFunc.hideToolbar();

        //这里初始化了回复内容
        service.getAnswers(function(a){
            answers = a;
        });


        var user = {
            id          : uid,
            username    : '王歆'
        };

        var name = user.username;
        $$('.chat-name').html(name);

        // render messages
        that.renderMessages();

        // Init Messages
        messageLayout = hiApp.messages('#contactView .messages', {
            autoLayout:true
        });

        this.bindEvents();
    },
    bindEvents: function(){
        var bindings = [{
            element: '.ks-messages-form',
            event: 'submit',
            handler: this.submitMessage
        },{
            element: '.ks-send-message',
            event: 'click',
            handler: this.triggerSubmit
        }];

        appFunc.bindEvents(bindings);
    },

    //初始化聊天记录
    renderMessages: function(message){
        hiApp.showIndicator();

        service.getMessages(function(m){
            setTimeout(function(){

                $$.each(m,function(index,val){
                    if(val.from_uid==uid){
                        val.from    = "sent";
                    }else{
                        val.from    = "received";
                    }
                    val.image   =  val.msg_type==2;//１：文本，２：图片，３：语音
                });

                console.table(m);



                var renderData = {
                    message: m
                };
                var output = appFunc.renderTpl(template, renderData);
                $$('.page[data-page="message"] .messages').html(output);

                hiApp.hideIndicator();

            },600);
        });
    },

    //发送消息
    submitMessage: function(e){

        e.preventDefault();
        var input = $$(this).find('.ks-messages-input');
        var messageText = input.val();
        if (messageText.length === 0) return;

        // Empty input
        input.val('');

        // Add Message
        messageLayout.addMessage({
            text: messageText,
            type: 'sent',
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        });
        conversationStarted = true;

        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            messageLayout.addMessage({
                text: answers[Math.floor(Math.random() * answers.length)],
                type: 'received'
            });
        }, 1000);
    },
    //点击发送触发提交
    triggerSubmit: function(){
        $$('.ks-messages-form').trigger('submit');
    }
};