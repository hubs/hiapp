require('./home.less');

var service         = require('./service'),
    appFunc         = require('../utils/appFunc'),
    template        = require('./home.tpl.html'),
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
    //----------------------------------------------------------------------------(暂不实现开始)
    //下拉刷新(暂不实现)
    refreshTimeline: function(){
        //获取最新的ID
        var newestId = $$('#homeView').find('.home-timeline .card').eq(0).data('id');

        service.refreshTimeline(newestId,function(tl){

            setTimeout(function () {
                //显示正在加载
                $$('#homeView .refresh-click').find('i').removeClass('reloading');

                //这里表示没有加载到最新数据

                if(tl.length === 0) {
                    pack.showLoadResult(i18n.index.nothing_loaded);
                    hiApp.pullToRefreshDone();
                    return false;
                }

                var length = tl.length;

                if(length >= 15){
                    pack.renderTimeline(tl);//如果数据大于15条，则全部更换
                }else if(length > 0){
                    pack.renderTimeline(tl, 'prepend');//在前面加上数据
                }else{
                    pack.showLoadResult(i18n.index.nothing_loaded);
                }

                hiApp.pullToRefreshDone();
                appFunc.lazyImg();
            },1500);

        });
    },
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
        $$.each(datas,function(index,item){
            item.filename = content.IMAGE_URL+store.getValue("filename_"+item.add_uid);

            db.dbFindAll(table.T_COMMENTS,{mark_id:item.id},function(){
                console.log("----item ");
            });

        });
        var renderData = {
            timeline: datas
        };

        var output = appFunc.renderTpl(template, renderData);
        console.log("render");
        $$('#homeView').find('.home-timeline').html(output);
    },


    //点赞
    coolItem:function(){
        socket.info_collect({
            mark_id : $$(this).data('id'),
            type    : content.COLLECT_TALK_COOL
        },function(info){

            appFunc.hiAlert(info);
        });
    },
    //评论
    commentItem:function(){
        console.log($$(this).data("id"));
        commentModule.commentPopup({id:$$(this).data('id'),comment_type:2});
    },


    bindEvent: function(){
        /**
         * {
                element: '#homeView',
                selector: '.pull-to-refresh-content',
                event: 'refresh',
                handler: this.refreshTimeline
            },
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
            handler: inputModule.openSendPopup  //发表新说说
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
            handler:pack.getTimeline  //评论
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;