require('./info.less');
var appFunc         = require('../utils/appFunc'),
    commentModule   = require('../comment/comment'),
    template        = require('./info.tpl.html'),
    db              = require("../db/db"),
    table           = require("../db/table"),
    socket          = require("../socket/socket"),
    content         = require("../app/content"),
    store           = require("../utils/localStore")
    ;

var pack  = {
    init: function(query){
        var _id = parseInt(query.id);
        appFunc.hideToolbar();

        this.bindEvents();

        // render tweet card
        this.getData(_id);

        //初始化评论
        commentModule.init({id:_id,type:content.COMMENT_TYPE_INFO});
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
                var _res        =  JSON.parse(row);
                var _obj        =  _res.data.obj;
                var _appends    =  _res.data.appends;

                //如果被更改过,则更新　
                if(_obj){
                    db.dbUpdate(table.T_ARTICLE,{id:_obj.id},_obj);
                }
                if(_appends){
                    $$.each(_appends,function(index,res){
                        console.log("append!!");
                        socket._pri_update_data(table.T_COMMENTS,res);
                    });
                }

                //获取评论
                commentModule.getComments({id:_params.mark_id,type:content.COMMENT_TYPE_INFO});
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
        commentModule.commentPopup({},function(text,id){
            var _template = '<li class="comment-item">'+
                    '<div class="comment-detail">'+
                    '<div class="text">'+store.getStorageValue("username")+':'+appFunc.replace_smile(text)+'</div>'+
                    '<div class="time">刚刚</div>'+
                    '<input type="hidden" class="id" value="'+id+'">'+
                    '<input type="hidden" class="type" value="1">'+
                    '</div>'+
                '</li>';
            $$('#info-page-list #commentContent').prepend(_template);
        });
    },

    bindEvents: function(){

        /**
         *  {
                element: '#commentContent',
                selector: '.comment-item',
                event: 'click',
                handler: commentModule.createActionSheet :会员回复,先不弄先，如果加了估计还要加提醒功能
            },

         */
        //点击弹出回复
        var bindings = [{
            element: '#infosView .item-comment-btn',
            event: 'click',
            handler: this.commentItem
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;