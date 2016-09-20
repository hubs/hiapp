var service     = require('./service'),
    appFunc     = require('../utils/appFunc'),
    template    = require('./infos.tpl.html'),
    content     = require("../app/content")
    ;

var pack = {
    init: function(){
        pack.getDatas();
        pack.bindEvent();
    },
    getDatas: function(){
        console.log("infos get datas");
        var that = this;
        hiApp.showIndicator();
        service.getDatas({},function(tl){
            if(tl.status){
                that.renderDatas(tl.msg);
            }else{
                appFunc.hiAlert(tl.msg);
            }
            hiApp.hideIndicator();
        });
        appFunc.removeBadge(content.BADGE_INFO);
    },

    renderDatas: function(tl, type){
        var renderData = {
            datas: tl
        };
        var output = appFunc.renderTpl(template, renderData);
        //下面是下拉刷新之类的(没用到)
        if(type === 'prepend'){
            $$('#infosView').find('.home-infos').prepend(output);
        }else if(type === 'append') {
            $$('#infosView').find('.home-infos').append(output);
        }else {
            $$('#infosView').find('.home-infos').html(output);
        }
        appFunc.lazyImg();
    },
    //查看详情
    openItemPage: function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        var itemId = $$(this).data('id');
        infoF7View.router.loadPage('page/info.html?id=' + itemId);
    },

    //上拉刷新
    infiniteTimeline: function(){
        var $this = $$(this);
        //显示加载条
        hiApp.showIndicator();

        //获取最后一条数据的ID
        var items    = $this.find('.home-infos .card');
        var length   = items.length;
        var _last_id = parseInt(items.eq(length - 1).data('id'));

        service.getDatas({id:{$lt:_last_id}},function(res){
            //如果是正在滚动，则直接返回
            var status = $this.data('scrollLoading');
            if (status === 'loading') return;

            //更新状态
            $this.data('scrollLoading','loading');

            if(res.status){
                $this.data('scrollLoading','unloading');
                pack.renderDatas(res.msg, 'append');
            }else{
                hiApp.detachInfiniteScroll($this);// 从指定的HTML元素容器删除无限滚动事件监听器
            }
            hiApp.hideIndicator();
            appFunc.lazyImg();
        });
    },
    bindEvent: function(){
        var bindings = [{
            element: '#infosView',
            selector: '.home-infos .card-header-pic',
            event: 'click',
            handler: this.openItemPage
        },{//下拉刷新
            element: '#infosView',
            selector: '.infinite-scroll',
            event: 'infinite',//下拉
            handler: this.infiniteTimeline
        },{
            element: '#infosView',
            event: 'show',
            handler: this.init
        }];
        appFunc.bindEvents(bindings);
    }
};

module.exports = pack;