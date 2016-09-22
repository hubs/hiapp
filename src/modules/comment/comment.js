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
            var renderData = {
                comments: res.msg
            };
            var output = appFunc.renderTpl(template, renderData);
            $$('#commentContent').html(output);
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

        renderData.mark_id  = params.mark_id||comment_params.mark_id;
        renderData.type     = params.comment_type||comment_params.type;
        renderData.pid      = params.uid||0;

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
        var _mark_id    = $$('#mark_id').val();
        var _type       = $$('#type').val();
        var _pid        = $$("#pid").val();
        socket.info_set_comment({
            mark_id         :   _mark_id,
            username        :   store.getStorageValue("username"),
            content         :   text,
            type            :   _type,
            pid             :   _pid
        },function(_reId){
            hiApp.hidePreloader();
            hiApp.closeModal('.comment-popup');
            console.log("fn_method = > "+fn_method);
            (typeof(fn_method) === 'function') ? fn_method(text,_reId,_pid) : '';
            appFunc.hiAlert("评论成功.");
        });
    },
    //底部弹出
    createActionSheet: function(_this,fn){
        var replyName = _this.find('.comment-detail .name').html();
        var _uid      = _this.find('.comment-detail .uid').val();
        var _type     = _this.find('.comment-detail .type').val();
        var _mark_id  = _this.find(".comment-detail .mark_id").val();
        var buttons1 = [
            {
                text: i18n.comment.reply_comment,
                bold: true,
                onClick:function(){
                    pack.commentPopup({uid:_uid,type:_type,name:replyName,mark_id:_mark_id},fn);
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