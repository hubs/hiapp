require('./message.less');

var appFunc         = require('../utils/appFunc'),
    service         = require('./service'),
    template        = require('./message.tpl.html'),
    faceTemplate    = require("./face.tpl.html"),
    homeJs          = require('../home/home'),
    camera          = require('../components/camera'),
    geo             = require('../components/geolocation'),
    socket          = require("../socket/socket"),
    content         = require("../utils/content"),
    table           = require("../db/table"),
    db              = require("../db/db"),
    dbHelper        = require("../utils/dbHelper")
    ;

var _that   = null,
    messageLayout;

var _to_uid     = 0;
var _chat_type  = 0;//类型:1:个人，２：群
var pack = {
    init: function(query){
        _to_uid     =   appFunc.parseInt(query.uid); //跟谁聊天
        _chat_type  =   appFunc.parseInt(query.type);//聊天类型
        _that       =   this;
        appFunc.hideToolbar();

        var user = {
            id          :  _to_uid,
            username    : appFunc.getUsernameByUid(_to_uid),
            type        : _chat_type,
            chat_type   : _chat_type==1?"icon-person":"icon-people"
        };
        $$('.chat-name').html(user.username);
        $$('.chat-person').data("type",user.type);
        $$('.chat-person').data("id",user.id);
        $$('.chat-person i').addClass(user.chat_type);
        $$('.right-chat-detail').attr("href",'page/chat_detail.html?id=' +_to_uid+"&type="+_chat_type);

        // render messages
        _that.renderMessages();

        // Init Messages
        messageLayout = hiApp.messages('.messages', {
            autoLayout:true
        });


        _that.renderFaces();
        this.bindEvents();
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
            $$('.face-swiper-container').html(output);

            //笑脸切换
            hiApp.swiper('.swiper', {
                pagination:'.swiper .swiper-pagination',
                spaceBetween: 5
            });
        });
    },
    //初始化聊天记录
    renderMessages: function(){
        hiApp.showIndicator();
        //加载最新的用户信息
        if(_chat_type==1){
            db.dbFindOne(table.T_MEMBER,{id:_to_uid},function(err,doc){
                var _res = db.returnComm(err,doc);
                if(_res.status){
                    var _obj = _res.msg;

                    socket.chat_get_member({
                        member_id   : _to_uid,
                        update_time : _obj.update_time//每次都获取最新的算了
                    },function(res){
                        res     =   appFunc.parseJson(res);
                        socket._pri_update_data(table.T_MEMBER,res);

                        if(res.username!=doc.username){
                            dbHelper.dbUpdateUsername(res.username,res.id);
                        }

                        if(res.filename!=doc.filename){
                            appFunc.setFilenameByUid(res.id,res.filename);
                        }

                        pack._getDbMessage();
                    });
                }else{
                    hiApp.hiAlert("没找到用户信息");
                }
            });
        }else{
            db.dbFindOne(table.T_CHAT_GROUP,{id:_to_uid},function(err,doc){
                var _res = db.returnComm(err,doc);
                if(_res.status){
                    var _obj = _res.msg;
                    socket.chat_get_group_info({
                        group_id    : _to_uid,
                        update_time : _obj.update_time,//每次都获取最新的算了
                    });
                    pack._getDbMessage();
                }else{
                    hiApp.hiAlert("没找到群信息");
                }
            });
        }
    },

    _getDbMessage:function(){
        service.getMessages({
            type        :   _chat_type,
            from_uid    :   appFunc.getUserId(),
            to_mark_id  :   _to_uid
        },function(res){
            hiApp.hideIndicator();
            pack._renderData(res);
        });
    },
    _renderData:function(res,type){
        var _datas  =   res.msg;
        if(res.status){
            var _time   =   '';//去除重复的时间
            _datas  =   _datas.reverse();
            $$.each(_datas,function(index,row){
                if(row.from_uid==appFunc.getUserId()){
                    row.from    = "sent";
                }else{
                    row.from    = "received";
                }
                row.is_image    =  row.msg_type==2;//１：文本，２：图片，３：语音

                //去除相同时间显示
                var _temp_time  = appFunc.format_chat_time(row.create_time,false);
                if(_time==_temp_time){
                    row.create_time = '';
                    row.show_time = false;
                }else{
                    _time = _temp_time;
                    row.show_time = true;
                }

            });
        }
        var renderData = {
            message: _datas
        };
        var output = appFunc.renderTpl(template, renderData);
        console.log(type);
        if(type === 'prepend'){
            $$('.page[data-page="message"] .messages').prepend(output);
        }else if(type === 'append') {
            $$('.page[data-page="message"] .messages').append(output);
        }else {
            $$('.page[data-page="message"] .messages').html(output);
        }
        hiApp.hideIndicator();
        appFunc.lazyImg();
    },
    //发送消息
    submitMessage: function(e){

        e.preventDefault();
        var input = $$("#ks-messages-input");
        var messageText = input.val();
        if (messageText.length === 0) return;

        // Empty input
        input.val('');

        /**params = {
             *   to_mark_id      : '',//接收者/群
             *   type            : '',//类型 1:个人,2:群
             *   msg             ： '',//消息(传上来的数据)
             *   text_msg         : '',//文字版消息
             *   msg_type        : '',// 1:文本，2：图片，3：语音
             *   msg_ext         : '',//文件后辍,只有图片和语音才会有
             *   token           : ''
             *   fromUid         : '',
             * }
         */
        socket.chat({
            to_mark_id  :   _to_uid,
            type        :   _chat_type,
            text_msg    :   messageText,
            msg_type    :   content.CHAT_TYPE_TEXT
        },function(res){
            var _res  = appFunc.parseJson(res);
            socket._pri_update_data(table.T_CHAT,_res);
            /**
             *   text	string		消息文本，也可以使用HTML字符串，如果你想要添加图片消息，则应该传递<img src="...">。必选
             *   name	string		发送者名称。可选
             *   avatar	string		发送者头像url。可选
             *   type	string	'sent'	消息类型，'sent'或'received'。可选
             *   label	string		Message label. Optional
             *   day	string		日期，例如 - 'Today', 'Monday', 'Yesterday', 'Fri', '22.05.2014'。可选
             *   time	string		Time string, for example - '22:45', '10:30 AM'. Optional
             */
            messageLayout.addMessage({
                text        : appFunc.text(messageText),
                avatar      : appFunc.getFilenameByUid(appFunc.getUserId()),
                type        : "sent",
                time        : appFunc.now_time_hm()
            });

            console.log('add_mesg');
        });

        // Add answer after timeout
/*      if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            messageLayout.addMessage({
                time        : appFunc.now_time_hm(),
                type        : "received",
                text        : answers[Math.floor(Math.random() * answers.length)],
                avatar      : 'http://lorempixel.com/output/people-q-c-100-100-9.jpg',
            });
        }, 1000);
        */

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
        $$(".form-speak .link-more").css("display","flex");
    },
    //显示正常Form
    showKeyboard: function(){
        $$(".form-speak").hide();
        $$(".form-general").show();
        _that.hideSmile();
        _that.hideBarMain();
        $$(".form-speak .link-more").hide();
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
        $$(".form-general .link-more").removeAttr("style");
        $$("#ks-send-message").hide();
    },
    //显示提交按钮
    _submitShow:function(){
        $$(".form-general .link-more").hide();
        $$("#ks-send-message").show();
    },

    //加载历史数据
    infiniteTimeline: function(){
        var $this = $$(this);
        //显示加载条
        hiApp.showIndicator();

        //获取最后一条数据的ID
        var item = $this.find('#message-history .message-last').eq(0);
        if(appFunc.isUndefined(item)){
            $this.data('scrollLoading','unloading');
        }else{
            var _last_id    =   item.data("id");
            service.getMessages({
                type        :   _chat_type,
                from_uid    :   appFunc.getUserId(),
                to_mark_id  :   _to_uid,
                id          :   _last_id
            },function(res){
                 //更新状态
                 $this.data('scrollLoading','loading');
                 if(res.status){
                     $this.data('scrollLoading','unloading');
                     pack._renderData(res,'prepend');
                 }
                 hiApp.hideIndicator();
                 hiApp.pullToRefreshDone();
           });
        }
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
            element: '.message-pic img',
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
            element: '.face-swiper-container .bar-aface img',
            event:'click',
            handler:this.addImgFace //增加笑脸
        },{
            element: '#ks-messages-input',
            event: 'keyup',
            handler:this.changeText //文字改变则显示提交按钮
        },{
            element: '#message-history',
            selector: '.pull-to-refresh-content',
            event: 'refresh',//下拉
            handler: this.infiniteTimeline
        }];

        appFunc.bindEvents(bindings);
    }
};
module.exports = pack;