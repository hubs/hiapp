var appFunc     = require('../utils/appFunc'),
    service     = require('./service'),
    template    = require('./comment.tpl.html'),
    popupTpl    = require('./commentPopup.tpl.html'),
    socket      = require("../socket/socket"),
    store       = require("../utils/localStore"),
    face        = require("../faces/face")


    ;

var comment_params;
var fn_method;
var pack = {
    /**
     * @param id : comment 表的mark_id
     * @param type : 1:资讯评论，2:说说评论
     */
    init: function(params){
        comment_params  =   params;
    },
    //详情列表显示
    getComments: function(params){
        service.getComments(params,function(res){
            if(res.status){
                var renderData = {
                    comments: res.msg
                };
                var output = appFunc.renderTpl(template, renderData);
                $$('#commentContent').html(output);
            }else {
                appFunc.hiAlert(res.msg);
            }
        });
    },

    //弹出评论窗
    commentPopup: function(params,fn){
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
        renderData.pid  = params.id||0;

        fn_method = fn;

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
        var _pid        = $$("#pid").val();
        socket.info_set_comment({
            mark_id         :   _id,
            username        :   store.getStorageValue("username"),
            content         :   text,
            type            :   _type,
            pid             :   _pid
        },function(_reId){
            hiApp.hidePreloader();
            hiApp.closeModal('.comment-popup');
            (typeof(fn_method) === 'function') ? fn_method(text,_reId) : '';
            appFunc.hiAlert("评论成功.");
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