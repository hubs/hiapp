var service = require('./service'),
    appFunc = require('../utils/appFunc'),
    template = require('./infos.tpl.html');

var infos = {
    init: function(){
        this.getDatas();
        this.bindEvent();
    },
    getDatas: function(){
        var that = this;
        service.getDatas(function(tl){
            that.renderDatas(tl);
            hiApp.hideIndicator();
        });
    },

    renderDatas: function(tl, type){
        var renderData = {
            datas: tl
        };
        var output = appFunc.renderTpl(template, renderData);
        //下面是下拉刷新之类的
        if(type === 'prepend'){
            $$('#infosView').find('.home-infos').prepend(output);
        }else if(type === 'append') {
            $$('#infosView').find('.home-infos').append(output);
        }else {
            $$('#infosView').find('.home-infos').html(output);
        }
    },
    //查看详情
    openItemPage: function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        var itemId = $$(this).data('id');
        infoF7View.router.loadPage('page/info.html?id=' + itemId);
    },
    bindEvent: function(){
        var bindings = [{
            element: '#infosView',
            selector: '.home-infos .card-header-pic',
            event: 'click',
            handler: this.openItemPage
        }];
        appFunc.bindEvents(bindings);
    }
};

module.exports = infos;