require('./message.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./message.tpl.html'),
    homeJs = require('../home/home'),
    camera = require('../components/camera'),
    geo = require('../components/geolocation');
    ;

var conversationStarted = false,
    answers = {},
    answerTimeout,
    _that   = null,
    messageLayout;

var uid   = 3;
module.exports = {
    init: function(query){
         _that = this;

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
        _that.renderMessages();

        // Init Messages
        messageLayout = hiApp.messages('.messages', {
            autoLayout:true
        });

        this.bindEvents();

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

              //  appFunc.lazyImg();

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
    },

    //点击语音图标
    showVoiceForm: function(){
        $$(".form-speak").show();
        $$(".form-general").hide();
        _that.hideBarMain();
    },
    //显示正常Form
    showKeyboard: function(){
        $$(".form-speak").hide();
        $$(".form-general").show();
        _that.hideBarMain();
    },

    //显示笑脸
    showSmile:function(){

        _that.hideBarMain();
    },
    //显示更多
    showMore: function(){
        $$(".form-speak").hide();
        $$(".form-general").show();
        _that.showBarMain();
    },

    showBarMain:function(){
        $$(".bar-main").show();
        $$(".message-body").css("padding-bottom","100px");
        $$(".message-toolbar").css("bottom","100px");
    },
    hideBarMain:function(){
        $$(".bar-main").hide();
        $$(".message-body").css("padding-bottom","0");
        $$(".message-toolbar").css("bottom","0");
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
        },{
            element: '#chatView',
            selector:'.message-pic img',
            event: 'click',
            handler: homeJs.photoBrowser  //点击图片
        },{
            element: '.link-voice',
            event: 'click',
            handler: this.showVoiceForm //语音
        },{
            element: '.link-smile',
            event: 'click',
            handler: this.showSmile //笑脸
        },{
            element: '.link-keyboard',
            event: 'click',
            handler:this.showKeyboard //文字输入
        },{
            element: '.link-more',
            event: 'click',
            handler:this.showMore //显示更多
        },{
            element: '.bar-camera',
            event: 'click',
            handler:camera.getPicture //拍照
        },{
            element: '.bar-pic',
            event: 'click',
            handler:camera.getPicture //相册
        },{
            element: '.bar-map',
            event: 'click',
            handler:geo.cleanGeo //坐标
        }];

        appFunc.bindEvents(bindings);
    }
};