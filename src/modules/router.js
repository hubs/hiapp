var
    appFunc         = require('./utils/appFunc'),
    tweetModule     = require('./tweet/tweet'),//动态
    feedbackModule  = require('./feedback/feedback'),//反馈
    aboutModule     = require('./about/about'),//关于我们
    languageModule  = require('./language/language'),//语言选择
    messageModule   = require('./message/message'),//聊天消息页
    userModule      = require('./user_info/user_info'),//修改个人信息
    passwordModule  = require('./password/password'),//密码
    contactsDetailModule    =   require('./contacts_detail/detail'),//点击查看用户详情
    infoModule      = require('./info/info');//消息


module.exports = {
    init: function() {
        var that = this;
        $$(document).on('pageBeforeInit', function (e) {
            var page = e.detail.page;//获取当前的page 页面
            that.pageBeforeInit(page);//开始处理不同的页面
        });

        $$(document).on('pageAfterAnimation', function (e) {
            var page = e.detail.page;
            that.pageAfterAnimation(page);//处理完的动画
        });
    },
    pageAfterAnimation: function(page){
        var name = page.name;
        var from = page.from;//当前页面从哪个方向加载进来。如果是新加载的页面，则为"right"，如果是返回上一步的页面，则为"left"

        if(name === 'homeView' || name === 'contactView' || name === 'setting' ||name==='infosView'||"chatView"){
            if(from === 'left'){
                appFunc.showToolbar();
            }
        }
    },
    pageBeforeInit: function(page) {
        var name = page.name;   //就是 data-page 设定的名称
        var query = page.query;//当前页面的get参数，是一个对象。假设你的页面URL是 "about.html?id=10&count=20&color=blue"，那么query就是：    {id: '10', count: '20', color: 'blue'}
        console.log(query);
        console.log(name);
        switch (name) {
            case 'about'://关于我们
                aboutModule.init();
                break;
            case 'feedback'://反馈
                feedbackModule.init();
                break;
            case 'item'://说说详情页面
                tweetModule.init(query);
                break;
            case 'message'://聊天页面
                messageModule.init(query);
                break;
            case 'language'://语文选择页面
                languageModule.init();
                break;
            case 'info':
                infoModule.init(query);
                break;
            case 'user_info'://修改个人信息
                userModule.init();
                break;
            case 'password':
                passwordModule.init();
                break;
            case 'contacts_detail':
                contactsDetailModule.init();
                break;
        }
    }
};