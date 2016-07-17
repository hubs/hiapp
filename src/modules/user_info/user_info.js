var appFunc = require('../utils/appFunc'),
    template = require('./user_info.tpl.html');

module.exports = {
    init: function(){
        appFunc.hideToolbar();
        var renderData = {obj:{
                filename    : 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                username    : '王歆',
                chat_name   : 'guilinxiaomofang',
                tel         :  '13788581069',
                email       :  "273579540@qq.com",
                hobby       :  "唱歌,打球,无聊",
                duties      :  "技术员",
                company     :  "桂林唐朝国旅有限公司",
                sex         :  1==1?true:false,//1：男 ==1?true:false
                remark      :  "天下乌鸦一般黑."
             }
        };

        var output = appFunc.renderTpl(template, renderData);
        $$('#user-info-content').html(output);

        this.bindEvents();
    },
    //更新
    updateUser: function(){
        console.log("YES");
        hiApp.showPreloader(i18n.index.sending);
        setTimeout(function(){
            hiApp.hidePreloader();
            hiApp.alert(i18n.setting.feed_back_result);
        },1000);
    },

    //默认选中
    selectText: function(){
         $$(this).focus().val($$(this).val());//将光标移到文字后面
    },

    bindEvents: function(){
        var bindings = [{
            element: '.update-user',
            event: 'click',
            handler: this.updateUser
        },{
            element: '.item-input input',
            event: 'click',
            handler: this.selectText
        }];


        appFunc.bindEvents(bindings);
    }
};