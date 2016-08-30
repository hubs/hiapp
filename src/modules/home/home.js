require('./home.less');

var service         = require('./service'),
    appFunc         = require('../utils/appFunc'),
    template        = require('./home.tpl.html'),
    commentModule   = require('../comment/comment'),
    inputModule     = require('../input/input');
var type_info       =   2;

var pack = {
    init: function(){
        this.getTimeline();
        this.bindEvent();
    },
    getTimeline: function(){
        var that = this;
        //获取列表
        service.getTimeline(function(tl){
            that.renderTimeline(tl);

            hiApp.hideIndicator();

            //Unlock scroll loading status
            var ptrContent = $$('#homeView').find('.pull-to-refresh-content');
            ptrContent.data('scrollLoading','unloading');

            appFunc.lazyImg();
        });
    },
    //下拉刷新
    refreshTimeline: function(){
        //获取最新的ID
        var newestId = $$('#homeView').find('.home-timeline .card').eq(0).data('id');

        service.refreshTimeline(newestId,function(tl){
            // Find newest msg id in ptrContent;
            //刷新时间
           // pack.refreshItemTime();

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
    //上拉刷新
    infiniteTimeline: function(){
        var $this = $$(this);
        //显示加载条
        hiApp.showIndicator();

        //获取最后一条数据的ID
        var items = $this.find('.home-timeline .card');
        var length = items.length;
        var lastId = items.eq(length - 1).data('id');

        service.infiniteTimeline(lastId,function(tl){
            //如果是正在滚动，则直接返回
            var status = $this.data('scrollLoading');
            if (status === 'loading') return;

            //更新状态
            $this.data('scrollLoading','loading');

            //没有加载到数据
            if(tl.length === 0){
                hiApp.detachInfiniteScroll($this);// 从指定的HTML元素容器删除无限滚动事件监听器
                hiApp.hideIndicator();//隐藏滚动条
            }else{
                //加载到最后
                setTimeout(function(){
                    $this.data('scrollLoading','unloading');
                    pack.renderTimeline(tl, 'append');

                    hiApp.hideIndicator();
                },1500);
            }
            appFunc.lazyImg();
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

    //显示加载结果
    showLoadResult: function(text){
        setTimeout(function(){
            $$('#homeView .load-result').html(text).css('opacity','1').transition(1000);

            setTimeout(function(){
                $$('#homeView .load-result').css('opacity','0').transition(1000);
            },2100);
        },400);
    },
    //显示刷新时间
    refreshItemTime:function(){
        $$('#homeView').find('.card .ks-facebook-date').each(function(){
            var nowTime = appFunc.timeFormat($$(this).data('time'));
            $$(this).html(nowTime);
        });
    },

    //查看图片
    photoBrowser: function(){
        var _imgArr =  [];
        $$(this).parents(".item-image").find("img").each(function(){
            _imgArr.push(this.src);
        });

        var myPhotoBrowser = hiApp.photoBrowser({
            photos: _imgArr,
            toolbar: false,
            backLinkText: i18n.global.close
        });

        myPhotoBrowser.open();

    },

    //渲染数据
    renderTimeline: function(tl, type){
        var renderData = {
            timeline: tl
        };
        var output = appFunc.renderTpl(template, renderData);
        if(type === 'prepend'){
            $$('#homeView').find('.home-timeline').prepend(output);
        }else if(type === 'append') {
            $$('#homeView').find('.home-timeline').append(output);
        }else {
            $$('#homeView').find('.home-timeline').html(output);
        }
    },

    //查看详情
    openItemPage: function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        var itemId = $$(this).data('id');
        homeF7View.router.loadPage('page/tweet.html?id=' + itemId);
    },

    //点赞
    coolItem:function(){
        console.log($$(this).data('id'));
    },
    //评论
    commentItem:function(){
        console.log($$(this).data("id"));
        commentModule.commentPopup({id:$$(this).data('id'),comment_type:type_info});
    },
    bindEvent: function(){
        //上拉刷新
        var bindings = [{
            element: '#homeView',
            selector: '.pull-to-refresh-content',
            event: 'refresh',
            handler: this.refreshTimeline
        },{
            element: '#homeView',
            selector: '.pull-to-refresh-content',
            event: 'infinite',//下拉
            handler: this.infiniteTimeline
        },{
            element: '#homeView',
            selector: '.refresh-click',
            event: 'click',
            handler: this.refreshTimelineByClick //点击左上角刷新按钮
        },{
            element: '#homeView',
            selector: 'a.open-send-popup',
            event: 'click',
            handler: inputModule.openSendPopup  //发表新说说
        },{
            element: '#homeView',
            selector: '.home-timeline .ks-facebook-card',
            event: 'click',
            handler: this.openItemPage  //点击查看详情
        },{
            element: '#homeView',
            selector:'div.card-content .item-image>img',
            event: 'click',
            handler: this.photoBrowser  //点击图片
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
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;