/**
 * @date : 2016-8-25
 */
var appFunc     = require("../utils/appFunc");
var store       = require("../utils/localStore");
var Content     = require("../app/content");
var db          = require("../db/db");
var table       = require("../db/table");
var socket_io   = require("socket.io-client");
var pack = {

    init:function(){
        this._isLogging = false;
        this.socket     = socket_io(Content.SERVER_URL);
        this.setLogging(true);
        this._init();
        this._checkIsLogin();
    },
    setLogging : function(record) {
        this._isLogging = record? true : false;
    },

    _checkIsLogin:function(){
        if(!pack.getLoginStatus()){
            var _username = store.getValue("tel");
            var _password = store.getValue("password");
            if(!_username&&!_password){
                pack.setLoginStatus(false);
                appFunc.showLogin();
            }
        }

    },
    //设置登录状态
    setLoginStatus:function(bool){
      store.setValue("is_login",bool);
    },
    getLoginStatus:function(){
      return store.getValue("is_login")=='true';
    },

    setConnectStatus:function(bool){
      store.setValue("is_connect",bool);
    },
    getConnectStatus:function(){
      return store.getValue("is_connect")=='true';
    },
    //打印信息
    print : function(res,tag){
        if(this._isLogging){
            if(tag){
                console.log(tag+" -> ");
            }
            console.log(res);
        }
    },
    //连接,断开,错误信息
    _init:function(){
        //连接
        this.socket.on("connect",function(){
            console.log("connect!");
            pack.setConnectStatus(true);
            pack.base_login();//每次连接都自动登录一下
        });
        //断掉
        this.socket.on("disconnect",function(){
            console.log("disconnect!");
            pack.setConnectStatus(false);
            pack.setLoginStatus(false);
        });
        //错误
        this.socket.on("error",function(res){
           console.log("err=>"+res);
        });


        //客户端接收消息
        this.socket.on(Content.EVENT_BASE_CLIENT_RECEIVE,function(type,res){
            pack.print(type,"type");
            pack.print(res,"客户端接收消息 ["+Content.EVENT_BASE_CLIENT_RECEIVE+"]");
        });

        //A->B,这里是推荐给B,B收到后返回一个ack
        this.socket.on(Content.EVENT_CHAT_USER,function(type,res){
            pack.print(type,"type");
            pack.print(res,"客户端接收消息 [ "+Content.EVENT_CHAT_USER+"]");
        });

        //A->G(群),推荐给所有在线的群友
        this.socket.on(Content.EVENT_CHAT_GROUP,function(type,res){
            pack.print(type,"type");
            pack.print(res,"客户端接收消息 [ "+Content.EVENT_CHAT_GROUP+"]");
        });

    },


    _checkIsPassNoLogin:function(params,showMsg){
        return pack._checkIsPassComm(params,showMsg,true);
    },
    _checkIsPassOkLogin:function(params,showMsg){
        return pack._checkIsPassComm(params,showMsg,false);
    },
    _checkIsPassComm:function(params,showMsg,checkIsLogin){
        if(checkIsLogin){
            console.log("login status = "+pack.getLoginStatus());
            if (pack.getLoginStatus()) {
                showMsg = showMsg===false?false:true;
                if(showMsg){
                    appFunc.hiAlert('帐号是已登录状态,不能进行操作.' );
                }
                console.log("帐号是已登录状态,不能进行操作.");
                return false;
            }
        }else{
            if (!pack.getLoginStatus() ) {
                appFunc.hiAlert('帐号是未登录状态,不能进行操作.' );
                return false;
            }
        }

        if(!pack.getConnectStatus()){
            console.log(params);
            appFunc.hiAlert('当前未连接到服务器.' );
            return false;
        }
        if(params&&!appFunc.checkParamsHasNull(params)){
            appFunc.hiAlert("有参数为空.");
            return false;
        }
        return true;
    },
    //所有的共同操作
    _get_comm:function(params,event_name,callback){
        if(!this._checkIsPassOkLogin(params)){
            return;
        }

        params.token    =   store.getValue("token");
        params.fromUid  =   store.getValue("uid");

        if(this._isLogging){
            console.log(params);
        }
        //发送给服务器
        this.socket.emit(event_name,params,function(status,info){
            pack.print(info,"返回信息【"+event_name+"】+ status = "+status);
            hiApp.hidePreloader();
            if(status==Content.SEND_ERROR){
                appFunc.hiAlert(info);
            }else if(status==Content.SEND_SUCCESS){
                if(info instanceof String){
                    appFunc.hiAlert(info);
                }
                pack.print(info,"成功【"+event_name+"】。");
                (typeof(callback) === 'function') ? callback(info) : '';
            }else if(status==Content.SEND_INFO){
                appFunc.hiAlert(info);
            }else if(status==Content.SEND_REPLY){
                pack.setLoginStatus(false);
                pack.base_login();
            }
        });
    },

    //---------------------------------------------------------------------基础模块开始
    /**
     *  登录
     *  params = {username:'',password:''}
     */
    base_login:function(params,fn){
        if(!this._checkIsPassNoLogin(params,false)){
            return;
        }
        params  =   params||{username:store.getValue("tel"),password:appFunc.decrypt(store.getValue("password"))};
        var _username = params.username;
        var _password = params.password;

        if(!_username||!_password||_username=='undefined'){
            pack.setLoginStatus(false);
            appFunc.showLogin();
            return;
        }
        if(!appFunc.isMobile(_username)){
            hiApp.hidePreloader();
            appFunc.hiAlert("手机号格式不正确.");
            return;
        }

        if(this._isLogging){
            console.log(params);
        }

        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_LOGIN,params,function(status,info){
            pack.print(info,"返回信息【登录】+ status = "+status);
            if(status==Content.SEND_ERROR){
                hiApp.hidePreloader();
                appFunc.hiAlert(info);
            }
        });

        //从服务器接收数据

        this.socket.on(Content.EVENT_BASE_LOGIN,function(res){
            pack.print(res,"登录成功");
            store.setValue("username",res.username);
            store.setValue("tel",res.tel);
            store.setValue("password",appFunc.encrypt(res.password));
            store.setValue("uid",res.id);
            store.setValue("token",res.token);
            store.setValue("update_time",res.update_time);
            store.setValue("filename",Content.IMAGE_URL+res.filename);
            pack.setLoginStatus(true);

            db.dbUpdate(table.T_MEMBER,{id:store.getIntValue("uid")},res,function(err,doc){
                console.log("doc = "+doc);
               if(doc==0){
                   console.log("HAHHA");
                   db.dbInsert(table.T_MEMBER,res,function(err,docs){
                       pack.print(docs,"写入用户成功");
                   });
               }else{
                   pack.print("更新用户成功.");
               }
            });



           // pack.base_get_offline_msg();//获取离线消息
            appFunc.hideLogin();
            (typeof(fn) === 'function') ? fn(res) : '';

        });
    },

    /**
     * 登录成功后,同步消息
     */
    base_get_offline_msg:function(){
        var params  =   {
            last_article_id     :   store.getValue("article_id"),//最后资讯ID
            last_vote_id        :   store.getValue("vote_id"),//最后投票ID
            last_activity_id    :   store.getValue("activity_id"),//最后活动ID
            last_talk_id        :   store.getValue("talk_id"),//最后说说ID
            last_comment_id     :   store.getValue("comment_id"),//最后评论ID
            last_member_id      :   store.getValue("member_id"),//最后会员ID
            last_chat_id        :   store.getValue("chat_id"),//最后聊天ID
            last_chat_group_id  :   store.getValue("chat_group_id"),//群组ID
            last_update_time    :   store.getValue("update_time"),//最后更改个人信息时间
            token               :   store.getValue("token"),
            fromUid             :   store.getValue("uid")
        };

        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_OFFLINE_MSG,params,function(status,res){
            if(status==Content.SEND_REPLY){
                pack.base_login();
            }else if(status==Content.SEND_SUCCESS){
                pack.print(res,"获取离线信息成功");
            }
        });
    },

    /**注册
     * params = {
     *   username:'',
     *   tel:'',
     *   password:'',
     *   email:''
     * }
     */
    base_register:function(params,fn){

        if(!this._checkIsPassNoLogin(params)){
            return;
        }

        if(this._isLogging){
            console.log(params);
        }
        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_REGISTER,params,function(status,info){
            if(status==Content.SEND_ERROR){
                appFunc.hiAlert(info);
            }else if(status==Content.SEND_SUCCESS){
                appFunc.hiAlert(info);
                pack.print(info,"注册成功");
                (typeof(fn) === 'function') ? fn(info) : '';
            }
        });
    },

    /**
     * 获取密码
     * params = {
     *  tel:''
     * }
     */
    base_get_pass:function(params,fn){
        if(!this._checkIsPassNoLogin(params)){
            return;
        }

        if(this._isLogging){
            console.log(params);
        }
        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_GET_PASS,params,function(status,info){
            if(status==Content.SEND_ERROR){
                appFunc.hiAlert(info);
            }else if(status==Content.SEND_SUCCESS){
                appFunc.hiAlert(info);
                pack.print(info,"获取成功");
                (typeof(fn) === 'function') ? fn(info) : '';
            }
        });
    },

    /**
     * 修改密码
     * params = {
     *    token : ''
     *    fromUid:'',
     *    oldPass:'',
     *    newPass:'',
     *    newPassAgain:''
     * }
     *
     */
    base_edit_password:function(params,fn){
        pack._get_comm(params,Content.EVENT_BASE_EDIT_PASSWORD,fn);
    },
    //---------------------------------------------------------------------基础模块结束


    //---------------------------------------------------------------------资讯模块开始
    /**
     * 获取最新资讯与评论数据
     * @param params = {
     *   mark_id            : '',//资讯ID
     *   comment_num        : ''//客户端本地的评论数
     *   mark_update_time   : ''//资讯的最后更新时间
     *   token              : ''
     *   fromUid            : '',
     * }
     */
    info_get_info:function(params){
        pack._get_comm(params,Content.EVENT_INFO_GET_INFO);
    },

    /**
     * 评论：
     * @param params = {
     *   mark_id        : '',
     *   add_username   : ''
     *   content        : ''
     *   type           :  '',1:资讯评论，２:说说评论
     *   token          : ''
     *   fromUid        : '',
     * }
     */
    info_get_comment:function(params){
        pack._get_comm(params,Content.EVENT_INFO_COMMENT);
    },

    /**
     * 赞和收藏：
     * @param params = {
     *   mark_id        : '',
     *   type           :  '',1:资讯收藏,2:资讯点赞,3:说说收藏,4:说说点赞)
     *   token          : ''
     *   fromUid        : '',
     * }
     */
    info_collect:function(params){
        pack._get_comm(params,Content.EVENT_INFO_COLLECT);
    },

    /**
     * 投票：
     * @param params = {
     *   mark_id        : '',//vote_details的ID
     *   vote_id        :  '',//投票主键ID,主要用于判断此用户是否已投票
     *   token          : ''
     *   fromUid        : '',
     * }
     */
    info_vote:function(params){
        pack._get_comm(params,Content.EVENT_INFO_VOTE);
    },

    /**
     * 获取最新的投票结果 ：
     * @param params = {
     *   mark_id             : '',//投票ID
     *   mark_update_time    : '',//投票的最后更新时间
     *   vote_num            : '',//投票数
     *   token               : ''
     *   fromUid             : '',
     * }
     */
    info_get_vote:function(params){
        pack._get_comm(params,Content.EVENT_INFO_GET_VOTE);
    },


    /**
     * 获取最新的投票结果 ：
     * @param params = {
     *   mark_id             : '',//
     *   add_username        : '',//
     *   status              : '',//1:参加,0:取消
     *   token               : ''
     *   fromUid             : '',
     * }
     */
    info_activity:function(params){
        pack._get_comm(params,Content.EVENT_INFO_ACTIVITY);
    },

    /**
     * 获取最新的活动人数 ：
     * @param params = {
     *   mark_id             : '',//活动ID
     *   mark_update_time    : '',//最后更新时间
     *   num                 : '',//参数人数
     *   token               : ''
     *   fromUid             : '',
     * }
     */
    info_get_activity:function(params){
        pack._get_comm(params,Content.EVENT_INFO_GET_ACTIVITY);
    },


    //---------------------------------------------------------------------资讯模块结束

    //---------------------------------------------------------------------聊天模块开始
    /**
     * 创建群组 ：
     * @param params = {
     *   create_username   : '',//创建者姓名
     *   groupName         : '',//群名
     *   remark            : '',// 群描述
     *   group_members     : '',//群员(使用,号分隔,包括创建者自己,所以最少也有一名成员)
     *   token             : ''
     *   fromUid           : '',
     * }
     */
    chat_create_group:function(params){
        pack._get_comm(params,Content.EVENT_CHAT_CREATE_GROUP);
    },

    /**
     * 群邀请 ：
     * @param params = {
     *   mark_id           : '',//群ID
     *   uid               : '',//被邀请的UID
     *   token             : ''
     *   fromUid           : '',
     * }
     */
    chat_group_invite:function(params){
        pack._get_comm(params,Content.EVENT_CHAT_GROUP_INVITE);
    },

    /**
     * 群名修改 ：
     * @param params = {
     *   mark_id           : '',//群ID
     *   group_username    : '',//修改后的群组名
     *   token             : ''
     *   fromUid           : '',
     * }
     */
    chat_group_rename:function(params){
        pack._get_comm(params,Content.EVENT_CHAT_GROUP_RENAME);
    },

    /**
     * 群消息免打扰 ：
     * @param params = {
     *   mark_id           : '',//群ID
     *   status            : '',//1:开启,0:关闭
     *   token             : ''
     *   fromUid           : '',
     * }
     */
    chat_group_ingore:function(params){
        pack._get_comm(params,Content.EVENT_CHAT_GROUP_INGORE);
    },

    /**
     * 会话聊天 ：
     * @param params = {
     *   to_mark_id      : '',//接收者/群
     *   type            : '',//类型 1:个人,2:群
     *   msg             ： '',//消息(传上来的数据)
     *   rep_msg         : '',//消息(返回给客户端的数据)
     *   msg_type        : '',// 1:文本，2：图片，3：语音
     *   msg_ext         : '',//文件后辍,只有图片和语音才会有
     *   token           : ''
     *   fromUid         : '',
     * }
     */
    chat:function(params){
        pack._get_comm(params,Content.EVENT_CHAT);
    },

    /**
     * 加载会员最新信息 ：
     * @param params = {
     *   member_id       : '',//需要查看会员的最新信息
     *   update_time     : '',//本地会员最后更新的时间
     *   token           : ''
     *   fromUid         : '',
     * }
     */
    chat_get_member:function(params){
        pack._get_comm(params,Content.EVENT_CHAT_GET_MEMBER);
    },


    //---------------------------------------------------------------------聊天模块结束

    //---------------------------------------------------------------------说说模块开始
    /**
     * 发表说说 ：
     * @param params = {
     *   add_username        : '',//发布者姓名
     *   content             : '',//内容
     *   imgs                : '',//图片
     *   token               : ''
     *   fromUid             : '',
     * }
     */
    talk:function(params){
        pack._get_comm(params,Content.EVENT_TALK);
    },
    //---------------------------------------------------------------------说说模块结束

    //---------------------------------------------------------------------系统模块开始
    /**
     *反馈(未实现)
     * @param params = {
     *   add_username    : ""
     *   content         : ""
     *   token           : ''
     *   fromUid         : '',
     * }
     */
    sys_feedBack:function(params,fn){
        pack._get_comm(params,Content.EVENT_SYS_FEEDBACK,fn);
    },
    //---------------------------------------------------------------------系统模块结束


    //---------------------------------------------------------------------个人信息模块开始


    /**
     *上传头像或背影
     * @param params = {
     *   msg             :""
     *   type        `   :"" //1:头像,2:背影
     *   msg_ext         :"" //后辍名
     *   token           : ''
     *   fromUid         : '',
     * }
     */
    sys_edit_img:function(params,fn){
        pack._get_comm(params,Content.EVENT_SYS_EDIT_IMG,fn);
    },


    /**
     *修改会员信息
     * @param params = {
     *   email:  :""
     *   hobby:  :""//爱好
     *   duties  :""//职位
     *   company :""
     *   sex     :""
     *   remark  : ""
     *   token           : ''
     *   fromUid         : '',
     * }
     */
    sys_edit_member:function(params,fn){
        pack._get_comm(params,Content.EVENT_SYS_EDIT_MEMBER,fn);

        //从服务器接收数据
        this.socket.on(Content.EVENT_SYS_EDIT_MEMBER,function(res){
            pack.print(res,"sys_edit_member　更新成功");
            store.setValue("username",res.username);
            store.setValue("tel",res.tel);
            res.password="";
            db.dbUpdate(table.T_MEMBER,{id:store.getIntValue("uid")},res,function(err,docs){
                if(err){
                    pack.print(err,"err");
                }else{
                    pack.print(docs,"更新成功");
                }
            });
        });
    }
    //---------------------------------------------------------------------个人信息模块结束
};

module.exports = pack;