require('./detail.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./detail.tpl.html');

var contacts = {
    init: function(){
        appFunc.hideToolbar();
        var renderData = {obj:{
            uid         : 1,
            filename    : 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
            username    : '王歆',
            chat_name   : 'guilinxiaomofang',
            tel         :  '13788581069',
            email       :  "273579540@qq.com",
            hobby       :  "唱歌,打球,无聊",
            duties      :  "技术员",
            company     :  "桂林唐朝国旅有限公司",
            sex         :  1==1?"icon-nan":"icon-nv",//1：男 ==1?true:false
            remark      :  "天下乌鸦一般黑.",
            lastTalk    :  "好无聊的一天啊,哈哈哈俣,嘎嘎,什么我,我会写,记得,还有什么,多打点字吧,好吧,那就多打一点吧,没什么问题吗,应该没问题.",
        }
        };

        var output = appFunc.renderTpl(template, renderData);
        $$('.contact-detail-page').html(output);

        this.bindEvents();
    },
    loadContacts: function(){

    },
    beforeLoadContacts: function(){
        if($$('#contactView .contacts-list .list-group .contact-item').length > 0) {
            return false;
        }else {
            hiApp.showIndicator();
            return true;
        }
    },
    showTelAction:function(){
        var buttons1 = [
            {
                text: '操作',
                label: true
            },
            {
                text: '<a class="external actions-link" href="tel:13788581069">拨打电话</a>',
                bold: true
            },
            {
                text: '<a class="external actions-link" href="sms:13788581069">发送信息</a>',
            }
        ];
        var buttons2 = [
            {
                text: '取消',
                color: 'red'
            }
        ];
        var groups = [buttons1, buttons2];
        hiApp.actions(groups);
    },
    bindEvents: function(){
        var bindings = [{
            element: '#contactView',
            event: 'show',
            handler: contacts.loadContacts
        },{
            element: '.detail-tel',
            event: 'click',
            handler: this.showTelAction

        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = contacts;
