require("./chat_detail.less");
var appFunc = require('../utils/appFunc'),
    template = require('./chat_detail.tpl.html'),
    template_group  =   require("./chat_detail_group.tpl.html")
    ;

module.exports = {
    init: function(query){
        appFunc.hideToolbar();


        var _id     =   query.id;   //群ID或用户ID
        var _type   =   query.type; //1:单聊,2:群聊
        var output  =   null;
        if(_type==1){
            var renderData = {
                obj:{
                    id          : _id,
                    filename    : 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                    switch_info : 'checked',
                    switch_top  : ''
                }
            };
            output = appFunc.renderTpl(template, renderData);
        }else{
            var renderData = {
                id          : _id,
                filenames   : [
                    {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }, {
                        filename:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/zhidao.png?v=md5',
                        username: 'hubs',
                        uid     : 5
                    }
                ],
                group_nums  : 2,
                group_name  : "无聊群",
                group_info  : "Hello 大家好,不能乱发垃圾信息,记得啊!!!!!!!",
                switch_info : 'checked',
                switch_top  : '',
                group_username:"哈喽!",
                group_admin : true //是否是管理员
            };
            output = appFunc.renderTpl(template_group, renderData);
            appFunc.lazyImg();
        }

        $$('#chat-detail-page').html(output);
        this.bindEvents();
    },

    //免打扰
    switchInfo:function(){
        console.log("switchInfo : "+$$(this).prop('checked'));
    },

    //置顶消息
    switchTop:function(){
        console.log("switchTop : "+$$(this).prop('checked'));
    },

    //退出群
    exitGroup:function(){
        console.log("Exit group!");
    },

    //修改自己在群里的名称
    changeMyGroupName:function(){
        console.log("chang name "+$$(this).data("name"));
        appFunc.prompt('这会在这个群内显示', '我在本群的昵称',$$(this).data("name"), function (value) {
            hiApp.alert(value);
        });
    },
    subtractGroupMember:function(){
        console.log("subtractGroupMember");
        $$(".content-block .col-25 span").addClass("badge").addClass("bg-red").html("-");
    },

    //删除群员
    delGroupMember:function(){
        console.log("delGroupMember => "+$$(this).data("id"));
    },

    //点击图片跳转到会员界面
    jumpToMemberByUid:function(){
        console.log("jumpToMemberByUid = "+$$(this).data("id"));
        chatF7View.router.loadPage('page/contacts_detail.html?uid=' + $$(this).data("id"));
    },
    bindEvents: function(){
        var bindings = [{
            element: '.switch-info',
            event: 'change',
            handler: this.switchInfo    //免打扰
        },{
            element: '.switch-top',
            event: 'change',
            handler: this.switchTop     //置顶消息
        },{
            element: '.btn-exit',
            event:'click',
            handler:this.exitGroup      //退出群
        },{
            element: '.group-my-name',
            event:'click',
            handler:this.changeMyGroupName  //修改自己在群里的名称
        },{
            element: '.col-subtract',
            event:'click',
            handler:this.subtractGroupMember //点击减符号时就可删除会员,只有管理员有权限
        },{
            element: '.badge-seat',
            event:'click',
            handler:this.delGroupMember //删除群员
        },{
            element:'.chat-to-member',
            event:'click',
            handler:this.jumpToMemberByUid  //点击图片跳转到会员界面
        }];

        appFunc.bindEvents(bindings);
    }
};