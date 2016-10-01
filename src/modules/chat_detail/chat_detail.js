require("./chat_detail.less");
var appFunc         = require('../utils/appFunc'),
    template        = require('./chat_detail.tpl.html'),
    template_group  = require("./chat_detail_group.tpl.html"),
    socket          = require("../socket/socket"),
    content         = require("../utils/content"),
    table           = require("../db/table"),
    db              = require("../db/db")
    ;

module.exports = {
    init: function(query){
        appFunc.hideToolbar();

        var _to_id      =   query.id;   //群ID或用户ID
        var _type       =   query.type; //1:单聊,2:群聊
        var output      =   null;
        if(_type==1){
            var _from_uid       = appFunc.getUserId();
            var _where          = {$or:[{add_uid:_from_uid,mark_id:_to_id},{add_uid:_to_id,mark_id:_from_uid}],type:_type};
            db.dbFindOne(table.T_CHAT_SETTING,_where,function(err,doc){
                var _switch_info = 'checked';
                var _switch_top  = '';
                if(db.returnComm(err,doc).status){
                    _switch_info = appFunc.parseInt(doc.switch_info)==1?"checked":"";
                    _switch_top  = appFunc.parseInt(doc.switch_top)==1?"checked":"";
                }
                var renderData = {
                    obj:{
                        id          : _to_id,
                        filename    : appFunc.getFilenameByUid(_to_id),
                        switch_info : _switch_info,
                        switch_top  : _switch_top
                    }
                };
                output = appFunc.renderTpl(template, renderData);
                $$('#chat-detail-page').html(output);
            });
        }else{
            //取得群信息
            db.dbFindOne(table.T_CHAT_GROUP,{id:_to_id},function(err,doc_group){
                if(doc_group&&!appFunc.isUndefined(doc_group)){

                    var renderData = {
                        id          : _to_id,
                        group_nums  : doc_group.nums,//群成人数
                        group_name  : doc_group.title,//群名
                        group_info  : doc_group.remark,//群描述
                        group_admin : appFunc.getUserId()==doc_group.create_uid, //是否是管理员
                        member_uids : [],
                        group_username:"", //我在本群的名称(暂时不做)
                        switch_info : '',
                        switch_top  : ''
                    };

                    //获取所有的群会员
                    db.dbFindAll(table.T_CHAT_GROUP_MEMBER,{mark_id:_to_id},function(err,doc_group_members){
                        var _res  = db.returnComm(err,doc_group_members);
                        if(_res.status){
                            $$.each(_res.msg,function(index,row){
                                renderData.member_uids.push({uid:row.uid});
                            });
                        }

                        //获取群设置
                        db.dbFindOne(table.T_CHAT_SETTING,_where,function(err,doc_setting) {
                            var _setting_res = db.returnComm(err, doc_setting);
                            if (_setting_res.status) {
                                renderData.switch_info = appFunc.parseInt(_setting_res.switch_info) == 1 ? "checked" : "";
                                renderData.switch_top  = appFunc.parseInt(_setting_res.switch_top)  == 1 ? "checked" : "";
                            }
                        });

                        output = appFunc.renderTpl(template_group, renderData);
                        $$('#chat-detail-page').html(output);
                        appFunc.lazyImg();
                    });
                }else{
                    appFunc.hiAlert("没有取到数据.");
                }
            });
        }
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

    //修改自己在群里的名称（暂时不做，2016-9-29）
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

    //增加会员进群
    addGroupMember:function(){
        var _group_id   =   $$(this).data("id");
        chatF7View.router.loadPage('page/contacts_group.html?group_id='+_group_id);
    },
    bindEvents: function(){
        /**
         * ,{
         *   element: '.group-my-name',
         *   event:'click',
         *   handler:this.changeMyGroupName  //修改自己在群里的名称
         *   }
         */
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
            element: '.col-subtract',
            event:'click',
            handler:this.subtractGroupMember //点击减符号时就可删除会员,只有管理员有权限
        },{
            element: '.badge-seat',
            event:'click',
            handler:this.delGroupMember //删除群员
        },{
            element: '.col-jia',
            event:'click',
            handler:this.addGroupMember //增加会员
        }];

        appFunc.bindEvents(bindings);
    }
};