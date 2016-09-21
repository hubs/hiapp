require('./home.less');

var service         = require('./service'),
    appFunc         = require('../utils/appFunc'),
    template        = require('./home.tpl.html'),
    template_comment= require('../comment/comment.tpl.html'),
    commentModule   = require('../comment/comment'),
    inputModule     = require('../input/input'),
    socket          = require("../socket/socket"),
    content         = require("../app/content"),
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

    //下拉刷新(暂不实现)
    refreshTimeline: function(){
        //获取最新的ID
        var newestId = $$('#homeView').find('.home-timeline .card').eq(0).data('id');

        service.refreshTimeline(newestId,function(res){
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
        var _lastId = parseInt(items.eq(length - 1).data('id'));
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
                console.log("是否点赞" +res);
                if(res!=null){
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
            db.dbFindAll(table.T_MEMBER_COLLECT,{type:content.COLLECT_TALK_COOL,mark_id:item.id,status:1},function(err,res){
                if(res!=null&&res.length>0){
                    console.log("点赞人群 : err = "+err+" and res = "+res);
                    console.log(res);
                    var _output = '<i class="icon icon-heart"></i>';
                    $$.each(res,function(index,item){
                        _output += " "+appFunc.getUsernameByUidForUrl(item.uid)+' , ';
                    });
                    $$('.home-timeline .content-block-inner-'+item.id).html(_output.replace(/,+\s+$/,''));
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
        var _id     =   _that.data('id');
        socket.info_collect({
            mark_id : _that.data('id'),
            type    : content.COLLECT_TALK_COOL
        },function(reId){
            var _cool_icon  = $$('.home-timeline .content-block-inner-'+_id);
            var _uid        =   store.getStorageValue("uid");
            if(_cool_icon.find(".icon-heart").length>0){
                _cool_icon.append(' , '+appFunc.getUsernameByUidForUrl(_uid));
            }else{
                  _output = '<i class="icon icon-heart"></i> '+appFunc.getUsernameByUidForUrl(_uid)+' , ';
                _cool_icon.html(_output.replace(/,+\s+$/,''));
            }
            _that.find(".icon-zan").addClass("cool-ok");
        });
    },
    //评论
    commentItem:function(){
        var _id = $$(this).data("id");
        commentModule.commentPopup({id:_id,comment_type:content.COMMENT_TYPE_TALK},function(text,id){
            var _template = '<li class="comment-item">'+
                '<div class="comment-detail">'+
                '<div class="text">'+store.getStorageValue("username")+':'+appFunc.replace_smile(text)+'</div>'+
                '<div class="time">刚刚</div>'+
                '<input type="hidden" class="id" value="'+id+'">'+
                '<input type="hidden" class="type" value="1">'+
                '</div>'+
                '</li>';
            $$('.home-timeline .comments-content-'+_id).append(_template);
        });
    },

    //发表新评论
    popCommentItem:function(){
        inputModule.openSendPopup(function(info){
            console.log("发表新的评论: "+info);
            pack.refreshTimelineByClick();
        });
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
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;