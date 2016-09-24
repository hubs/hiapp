require('./home.less');
var service         = require('./service'),
    appFunc         = require('../utils/appFunc'),
    template        = require('./home.tpl.html'),
    template_comment= require('../comment/comment.tpl.html'),
    commentModule   = require('../comment/comment'),
    inputModule     = require('../input/input'),
    socket          = require("../socket/socket"),
    content         = require("../utils/content"),
    store           = require("../utils/localStore"),
    table           = require("../db/table"),
    db              = require("../db/db")
    ;

var pack = {
    init: function(){
        this.getTimeline();
        this.bindEvent();
    },
    getTimeline: function(){
        hiApp.showIndicator();
        console.log("loadTimeLine");
        //获取列表
        service.getTimeline({},function(res){
            if(res.status){
                pack.renderTimeline(res.msg);
            }else{
                appFunc.hiAlert(res.msg);
            }
            hiApp.hideIndicator();

            //Unlock scroll loading status
            var ptrContent = $$('#homeView').find('.pull-to-refresh-content');
            ptrContent.data('scrollLoading','unloading');

            appFunc.lazyImg();
        });
        appFunc.removeBadge(content.BADGE_TALK);
    },

    //下拉刷新
    refreshTimeline: function(){
        //获取最新的ID
        var newestId = $$('#homeView').find('.home-timeline .card').eq(0).data('id');

        service.refreshTimeline(newestId,function(res){
            console.log("lastNewsId = "+newestId);
            console.log(res);
            //显示正在加载
            setTimeout(function(){
                $$('#homeView .refresh-click').find('i').addClass('reloading');
            },350);

            //下拉300像素
            $$('#homeView .pull-to-refresh-content').scrollTop(0,300);

            //这里表示没有加载到最新数据
            if(res.status) {
                pack.renderTimeline(res.msg, 'prepend');//在前面加上数据
                hiApp.pullToRefreshDone();
            }else{
                pack.showLoadResult(i18n.index.nothing_loaded);
                hiApp.pullToRefreshDone();
                return false;
            }
            appFunc.lazyImg();

        });
        appFunc.removeBadge(content.BADGE_TALK);
    },
    //----------------------------------------------------------------------------(暂不实现开始)
    //点击左上脚刷新
    refreshTimelineByClick: function(){
        //左边在图标在转动
        setTimeout(function(){
            $$('#homeView .refresh-click').find('i').addClass('reloading');
        },350);
        //下拉300像素
        $$('#homeView .pull-to-refresh-content').scrollTop(0,300);

        //触发下拉刷新
        hiApp.pullToRefreshTrigger('#homeView .pull-to-refresh-content');
    },

    //查看详情(暂时放弃2016-9-17)
    openItemPage: function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        var itemId = $$(this).data('id');
        homeF7View.router.loadPage('page/tweet.html?id=' + itemId);
    },
    //----------------------------------------------------------------------------(暂不实现结束)
    //上拉刷新
    infiniteTimeline: function(){
        var $this = $$(this);
        //显示加载条
        hiApp.showIndicator();

        //获取最后一条数据的ID
        var items = $this.find('.home-timeline .card');
        var length = items.length;
        var _lastId = appFunc.parseInt(items.eq(length - 1).data('id'));
        service.getTimeline({id:{$lt:_lastId}},function(res){

            //如果是正在滚动，则直接返回
            var status = $this.data('scrollLoading');
            if (status === 'loading') return;

            //更新状态
            $this.data('scrollLoading','loading');

            //没有加载到数据

            if(res.status){
                $this.data('scrollLoading','unloading');
                pack.renderTimeline(res.msg, 'append');
            }else{
                hiApp.detachInfiniteScroll($this);// 从指定的HTML元素容器删除无限滚动事件监听器
            }
            hiApp.hideIndicator();
            appFunc.lazyImg();
        });
    },


    //显示加载结果
    showLoadResult: function(text){
        setTimeout(function(){
            $$('#homeView .load-result').html(text).css('opacity','1').transition(1000);

            setTimeout(function(){
                $$('#homeView .load-result').css('opacity','0').transition(1000);
            },2100);
        },400);
    },

    //查看图片
    photoBrowser: function(){
        var _imgArr =  [];
        $$(this).parents(".item-image").find("img").each(function(){
            _imgArr.push(this.src);
        });

        var myPhotoBrowser = hiApp.photoBrowser({
            photos: _imgArr,
            toolbar: true,
            backLinkText: "关闭",
            ofText:"图片游览"
        });

        myPhotoBrowser.open();

    },

    //渲染数据
    renderTimeline: function(datas, type){
        var _uid    =   store.getStorageIntVal("uid");
        $$.each(datas,function(index,item){
            var _add_uid        =   item.add_uid;
            item.filename       =   content.IMAGE_URL+appFunc.getFilenameByUid(_add_uid);
            /**
             * 需要判断
             *  1:是否已点赞
             *  2:评论数据
             *  3:获取当前点赞的姓名显示
             */
            db.dbFindOne(table.T_MEMBER_COLLECT,{type:content.COLLECT_TALK_COOL,mark_id:item.id,uid:_uid,status:1},function(err,res){

                if(res!=null){
                    console.log("是否点赞" +res);
                    $$(".home-timeline i.cool-"+item.id).addClass("cool-ok");
                }
            });
            //获取评论
            db.dbFindAll(table.T_COMMENTS,{type:content.COMMENT_TYPE_TALK,add_uid:_uid,mark_id:item.id},function(err,res){
                if(res!=null&&res.length>0){
                    console.log(" 获取评论: "+res);
                    var renderData = {
                        comments: res
                    };
                    var output = appFunc.renderTpl(template_comment, renderData);
                    $$('.home-timeline .comments-content-'+item.id).html(output);
                }
            },{id:1});

            //获取点赞人群
            db.dbFindAll(table.T_MEMBER_COLLECT,{type:content.COLLECT_TALK_COOL,mark_id:appFunc.parseInt(item.id),status:appFunc.parseInt(1)},function(err,res){
                if(res!=null&&res.length>0){
                    console.log("点赞人群 : err = "+err+" and res = "+res);
                    console.log(res);
                    var _output = '<i class="icon icon-heart"></i>';
                    $$.each(res,function(index,item){
                        _output += " "+appFunc.getUsernameByUidForUrl(item.uid)+' , ';
                    });
                    var _cool_str   =   $$('.home-timeline .content-block-inner-'+item.id);
                    _cool_str.html(_output.replace(/,+\s+$/,''));
                    _cool_str.show();
                }
            },{id:1});
        });
        var renderData = {
            timeline: datas
        };
        var output = appFunc.renderTpl(template, renderData);
        if(type === 'prepend'){
            $$('#homeView').find('.home-timeline').prepend(output);
        }else if(type === 'append') {
            $$('#homeView').find('.home-timeline').append(output);
        }else {
            console.log("render");
            $$('#homeView').find('.home-timeline').html(output);
        }
    },


    //点赞
    coolItem:function(){
        var _that   =   $$(this);
        var _isCool =   _that.find("i.cool-ok").length;//1:表示已取，点击则取消赞,0:表示点赞
        var _id     =   _that.data('id');
        socket.info_collect({
            mark_id : _that.data('id'),
            type    : content.COLLECT_TALK_COOL
        },function(reId){
            var _cool_icon  = $$('.home-timeline .content-block-inner-'+_id);
            var _uid        = store.getStorageValue("uid");
            var _cool_arr   = [];
            var _len        = _cool_icon.find(".icon-heart").length;
            if(_len>0){
                _cool_icon.find("a.item-link").each(function(){
                    _cool_arr.push($$(this).data("id"));
                });
            }
            if(_isCool==1){//取消点赞
                appFunc.rm_array(_cool_arr,_uid,true);//删除自己
            }else{//这里是点赞操作
                _cool_arr.push(_uid);//写入自己
            }

            if(_cool_arr.length>0){
                var _output = '<i class="icon icon-heart"></i> ';
                for (var i = 0; i < _cool_arr.length; i++) {
                    _output +=appFunc.getUsernameByUidForUrl(_cool_arr[i])+' , ';
                }
                _cool_icon.html(_output.replace(/,+\s+$/,''));
                _cool_icon.show();
                _that.find(".icon-zan").addClass("cool-ok");
            }else{
                _cool_icon.html("");
                _cool_icon.hide();
                _that.find(".icon-zan").removeClass("cool-ok");
            }


        });
    },
    //评论
    commentItem:function(){
        var _mark_id = $$(this).data("id");
        commentModule.commentPopup({mark_id:_mark_id,type:content.COMMENT_TYPE_TALK},function(text,mark_id,pid){pack._rederComment(text,mark_id,pid,_mark_id)});
    },

    //追加!
    _rederComment:function(text,mark_id,pid,_target_id){
        var _uid  = store.getStorageIntVal("uid");
        var _template = '<li class="comment-item">'+
            '<div class="avatar">'+appFunc.getFilenameByUidForUrl(_uid)+'</div>'+
            '<div class="comment-detail">'+
            '<div class="text">'+appFunc.getUsernameByUidForUrl(_uid)+': '+appFunc.atUser(pid)+appFunc.replace_smile(text)+'</div>'+
            '<div class="time">刚刚</div>'+
            '<input type="hidden" class="mark_id" value="'+_target_id+'">'+
            '<input type="hidden" class="type" value="2">'+
            '<input type="hidden" class="uid" value="'+_uid+'">'+
            '</div>'+
            '</li>';
        $$('.home-timeline .comments-content-'+_target_id).append(_template);
    },
    //发表新评论
    popCommentItem:function(){
        inputModule.openSendPopup(function(res){
            socket._pri_update_data(table.T_TALK,res,function(){
                console.log("refresh!!");
                pack.refreshTimelineByClick();
            });
        });
    },
    jumpCommentPage:function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        var _target_id  =   $$(this).find(".comment-detail .mark_id").val();
        commentModule.createActionSheet($$(this),function(text,mark_id,pid){pack._rederComment(text,mark_id,pid,_target_id)});
    },
    bindEvent: function(){
        /**
         *
             {
                element: '#homeView',
                selector: '.refresh-click',
                event: 'click',
                handler: this.refreshTimelineByClick //点击左上角刷新按钮
            },
             {
                element: '#homeView',
                selector: '.home-timeline .ks-facebook-card',
                event: 'click',
                handler: this.openItemPage  //点击查看详情
            },
         */
        //上拉刷新
        var bindings = [{
            element: '#homeView',
            selector: '.pull-to-refresh-content',
            event: 'refresh',
            handler: this.refreshTimeline
        },{
            element: '#homeView',
            selector: '.infinite-scroll',
            event: 'infinite',//下拉
            handler: this.infiniteTimeline
        },{
            element: '#homeView',
            selector:'div.card-content .item-image>img',
            event: 'click',
            handler: this.photoBrowser  //点击图片
        },{
            element: '#homeView',
            selector: 'a.open-send-popup',
            event: 'click',
            handler:this.popCommentItem   //发表新说说
        },{
            element: '#homeView',
            selector:'div.card-footer .cool',
            event: 'click',
            handler: this.coolItem  //点赞
        },{
            element: '#homeView',
            selector: 'div.card-footer .comment',
            event: 'click',
            handler:this.commentItem  //评论
        },{
            element: '#homeView',
            event: 'show',
            handler:pack.getTimeline  // 获取最新数据
        },{
            element: '.home-timeline',
            selector: '.comment-item',
            event: 'click',
            handler: this.jumpCommentPage //:会员回复,先不弄先，如果加了估计还要加提醒功能
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;