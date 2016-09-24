require('./info.less');
var appFunc         = require('../utils/appFunc'),
    commentModule   = require('../comment/comment'),
    template        = require('./info.tpl.html'),
    db              = require("../db/db"),
    table           = require("../db/table"),
    socket          = require("../socket/socket"),
    content         = require("../utils/content"),
    store           = require("../utils/localStore")
    ;

var pack  = {
    init: function(query){
        var _id = appFunc.parseInt(query.id);
        appFunc.hideToolbar();

        this.bindEvents();

        // render tweet card
        this.getData(_id);

        //初始化评论
        commentModule.init({mark_id:_id,type:content.COMMENT_TYPE_INFO});
    },
    //每次加载从服务端获取最新数据
    getCommentFromServer:function(_params){
        /**
         *  mark_id            : '',//资讯ID
         *  comment_num        : ''//客户端本地的评论数
         *  mark_update_time   : ''//资讯的最后更新时间
         */
        socket.info_get_info(
            _params,
            function(row){
                var _res        =  appFunc.parseJson(row);
                var _obj        =  _res.data.obj;
                var _appends    =  _res.data.appends;

                //如果被更改过,则更新　
                if(_obj){
                    db.dbUpdate(table.T_ARTICLE,{id:_obj.id},_obj);
                }
                if(_appends){
                    $$.each(_appends,function(index,res){
                        socket._pri_update_data(table.T_COMMENTS,res);
                    });
                }

                //获取评论
                commentModule.getComments({mark_id:_params.mark_id,type:content.COMMENT_TYPE_INFO});
            }
        );


    },

    getData: function(_id){
        db.dbFindOne(table.T_ARTICLE,{id:_id},function(err,row){
            var output = appFunc.renderTpl(template, row);
            $$('#infoContent').html(output);

            pack.getCommentFromServer({
                mark_id             : _id,
                comment_num         : row.comment_num,
                mark_update_time    : row.update_time
            });
        });

    },
    //评论
    commentItem:function(){
        commentModule.commentPopup({},function(text,mark_id){pack._rederComment(text,mark_id,pid)});
    },
    //追加!
    _rederComment:function(text,mark_id,pid){
        var _uid  = store.getStorageIntVal("uid");
        var _template = '<li class="comment-item">'+
            '<div class="avatar">'+appFunc.getFilenameByUidForUrl(_uid)+'</div>'+
            '<div class="comment-detail">'+
            '<div class="text">'+appFunc.getUsernameByUidForUrl(_uid)+': '+appFunc.atUser(pid)+appFunc.replace_smile(text)+'</div>'+
            '<div class="time">刚刚</div>'+
            '<input type="hidden" class="mark_id" value="'+mark_id+'">'+
            '<input type="hidden" class="type" value="1">'+
            '<input type="hidden" class="uid" value="'+_uid+'">'+
            '</div>'+
            '</li>';
        $$('#info-page-list #commentContent').prepend(_template);
        $$("#info-page-list #commentContent .none-comment").hide();
    },
    //jump comment page
    jumpCommentPage:function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        commentModule.createActionSheet($$(this),function(text,mark_id){pack._rederComment(text,mark_id,pid)});
    },

    bindEvents: function(){

        //点击弹出回复
        var bindings = [{
            element: '#infosView .item-comment-btn',
            event: 'click',
            handler: this.commentItem
        },{
            element: '#commentContent',
            selector: '.comment-item',
            event: 'click',
            handler: this.jumpCommentPage //:会员回复,先不弄先，如果加了估计还要加提醒功能
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;