var appFunc     = require('../utils/appFunc'),
    service     = require('./service'),
    template    = require('./comment.tpl.html'),
    popupTpl    = require('./commentPopup.tpl.html'),
    socket      = require("../socket/socket"),
    store       = require("../utils/localStore"),
    face        = require("../faces/face")

    ;

var comment_params;
var pack = {

    /**
     * @param id : comment 表的mark_id
     * @param type : 1:资讯评论，2:说说评论
     */
    init: function(params){
        comment_params  =   params;
        this.getComments(params);
    },
    //详情列表显示
    getComments: function(params){
        service.getComments(function(c){
            var random = Math.floor(Math.random()*2);
            if(!random) c = null;
            setTimeout(function(){
                var renderData = {
                    comments: c,
                    rtime: function(){
                        return appFunc.timeFormat(this.time);
                    }
                };
                var output = appFunc.renderTpl(template, renderData);
                $$('#commentContent').html(output);
            },1500);
        });
    },



    //弹出评论窗
    commentPopup: function(params){
        console.log(params);
        var renderData = {
            comment: i18n.timeline.comment
        };
        //如果是回复TA的,就传name进来
        if(params.name){
            renderData.title = i18n.comment.reply_comment;
            renderData.placeholder = i18n.comment.reply + '@' + params.name + ':';
        }else {
            renderData.title = i18n.timeline.comment;
            renderData.placeholder = i18n.comment.placeholder;
        }

        renderData.id   = params.id||comment_params.id;
        renderData.type = params.comment_type||comment_params.type;

        var output = appFunc.renderTpl(popupTpl, renderData);
        hiApp.popup(output);

        var bindings = [{
            element:'#commentBtn',
            event: 'click',
            handler: pack.sendComment
        },{
            element:".icon-emotion",
            event: 'click',
            handler: face.renderFace
        }];

        appFunc.bindEvents(bindings);
    },
    //发送评论
    sendComment: function(){
        var text = $$('#contentText').val();


        if(appFunc.getCharLength(text) < 4){
            hiApp.alert(i18n.index.err_text_too_short);
            return false;
        }

        hiApp.showPreloader(i18n.comment.commenting);

        var _id         = $$('#id').val();
        var _type       = $$('#type').val();


        socket.info_set_comment({
            mark_id         :   _id,
            username        :   store.getValue("username"),
            content         :   text,
            type            :   _type
        },function(info){
            hiApp.hidePreloader();
            appFunc.hiAlert(info);
            hiApp.closeModal('.comment-popup');

        });
    },
    //底部弹出
    createActionSheet: function(){
        var replyName = $$(this).find('.comment-detail .name').html();
        var _id       = $$(this).find('.comment-detail .id').val();
        var _type     = $$(this).find('.comment-detail .type').val();
        var buttons1 = [
            {
                text: i18n.comment.reply_comment,
                bold: true,
                onClick:function(){
                    pack.commentPopup({id:_id,type:_type,name:replyName});
                }
            }

        ];
        var buttons2 = [
            {
                text: i18n.global.cancel,
                color: 'red'
            }
        ];

        var groups = [buttons1, buttons2];
        hiApp.actions(groups);
    }
};

module.exports = pack;