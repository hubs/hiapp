require('./message.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./message.tpl.html'),
    faceTemplate    =   require("./face.tpl.html"),
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

        _that.renderFaces();

    },
    renderFaces:function(){
        service.getFaces(function(res){
            var _width  =   $$(".theme-cyan").width();
            var _chunk  =   0;
            if(_width>600){
                _chunk  =   42;
            }else{
                _chunk  =   18;
            }
            var i,j,temparray=[];
            for (i=0,j=res.length; i<j; i+=_chunk) {
                temparray.push(res.slice(i,i+_chunk));
            }

            var renderData = {
                faces: temparray
            };
            var output = appFunc.renderTpl(faceTemplate, renderData);
            $$('.swiper-container').html(output);

            //笑脸切换
            hiApp.swiper('.swiper', {
                pagination:'.swiper .swiper-pagination',
                spaceBetween: 5
            });
        });



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
        var input = $$("#ks-messages-input");
        var messageText = input.val();
        if (messageText.length === 0) return;

        // Empty input
        input.val('');

        /**
         *   text	string		消息文本，也可以使用HTML字符串，如果你想要添加图片消息，则应该传递<img src="...">。必选
         *   name	string		发送者名称。可选
         *   avatar	string		发送者头像url。可选
         *   type	string	'sent'	消息类型，'sent'或'received'。可选
         *   label	string		Message label. Optional
         *   day	string		日期，例如 - 'Today', 'Monday', 'Yesterday', 'Fri', '22.05.2014'。可选
         *   time	string		Time string, for example - '22:45', '10:30 AM'. Optional
         */
        // Add Message
        messageLayout.addMessage({
            text        : appFunc.replace_smile(messageText),
            avatar      : 'http://lorempixel.com/output/people-q-c-100-100-9.jpg',
            type        : "sent",
            time        : appFunc.now_time_hm(),
        });
        conversationStarted = true;

        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            messageLayout.addMessage({
                time        : appFunc.now_time_hm(),
                type        : "received",
                text        : answers[Math.floor(Math.random() * answers.length)],
                avatar      : 'http://lorempixel.com/output/people-q-c-100-100-9.jpg',
            });
        }, 1000);

        //隐藏提交按钮
        _that._submitHide();
    },
    //点击发送触发提交
    triggerSubmit: function(){
        $$('.ks-messages-form').trigger('submit');
    },

    //点击语音图标
    showVoiceForm: function(){
        $$(".form-speak").show();
        $$(".form-general").hide();
        _that.hideSmile();
        _that.hideBarMain();

    },
    //显示正常Form
    showKeyboard: function(){
        $$(".form-speak").hide();
        $$(".form-general").show();
        _that.hideSmile();
        _that.hideBarMain();
    },

    //显示笑脸
    showSmile:function(){
        console.log("showSmile");
        $$(".form-speak").hide();
        $$(".form-general").show();
        _that.hideBarMain();
        $$(".bar-face").show();
        $$(".message-toolbar").css("bottom","170px");
        $$(".message-body").css("padding-bottom","170px");
        $$(".message-body").scrollTop($$(".messages-content").offset().top + 170);
    },

    hideSmile:function(){
        $$(".bar-face").hide();
        $$(".message-toolbar").css("bottom","0");
        $$(".message-body").css("padding-bottom","0");
    },
    //显示更多
    showMore: function(){
        $$(".form-speak").hide();
        $$(".form-general").show();
        _that.hideSmile();
        _that.showBarMain();
    },

    showBarMain:function(){
        $$(".bar-main").show();
        $$(".message-toolbar").css("bottom","100px");
        $$(".message-body").css("padding-bottom","100px");
        $$(".message-body").scrollTop($$(".messages-content").offset().top + 100);
    },
    hideBarMain:function(){
        $$(".bar-main").hide();
        $$(".message-toolbar").css("bottom","0");
        $$(".message-body").css("padding-bottom","0");
    },
    //增加笑脸图片
    addImgFace: function(){
        console.log("add Img Face = "+$$(this).data("name"));
        appFunc.insertText(document.getElementById('ks-messages-input'),$$(this).data("name"));
        _that._submitShow();
    },

    changeText:function(){
        var _val    =   $$(this).val();
        console.log("val = "+_val+" and len = "+_val.length);
        if(_val.length>0){
            _that._submitShow();
        }else{
            _that._submitHide();
        }
    },
    //隐藏提交按钮
    _submitHide:function(){
        $$(".link-more").removeAttr("style");
        $$("#ks-send-message").hide();
    },
    //显示提交按钮
    _submitShow:function(){
        $$(".link-more").hide();
        $$("#ks-send-message").show();
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
        },{
            element: '#chatView',
            selector: '.bar-aface img',
            event:'click',
            handler:this.addImgFace
        },{
            element: '#ks-messages-input',
            event: 'keyup',
            handler:this.changeText //文字改变则显示提交按钮
        }];

        appFunc.bindEvents(bindings);
    }
};