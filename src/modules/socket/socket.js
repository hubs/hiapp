/**
 * @date : 2016-8-25
 */
var appFunc     = require("../utils/appFunc");
var store       = require("../utils/localStore");
var Content     = require("../app/content");
var db          = require("../db/db");
var table       = require("../db/table");
var socket_io   = require("socket.io-client");
var socketPack = {

    init:function(){
        this._isLogin   = false;
        this._isLogging = false;
        this._isConnect = false;
        this.socket     = socket_io(Content.SERVER_URL);
        this.setLogging(true);
        this._init();
    },
    setLogging : function(record) {
        this._isLogging = record? true : false;
    },
    //打印信息
    print : function(res,tag){
        if(this._isLogging){
            if(tag){
                console.log(tag+" -> ");
            }
            console.table(res);
        }
    },
    //连接,断开,错误信息
    _init:function(){
        //连接
        this.socket.on("connect",function(){
            console.log("connect!");
            socketPack._isConnect = true;
        });
        //断掉
        this.socket.on("disconnect",function(){
            console.log("disconnect!");
            socketPack._isConnect  = false;
            socketPack._isLogin    = false;
        });
        //错误
        this.socket.on("error",function(res){
           console.log("err=>"+res);
        });

    },

    _checkIsNotConnect:function(){
        return this._isConnect;
    },

    _checkIsPass:function(params){
        if ( this._isLogin ) {
            appFunc.hiAlert('帐号已登录.' );
            return false;
        }
        if(this._checkIsNotConnect()){
            appFunc.hiAlert('当前未连接到服务器.' );
            return false;
        }
        if(params&&!appFunc.checkParamsHasNull(params)){
            appFunc.hiAlert("有参数为空.");
            return false;
        }
        return true;
    },

    /**
     *  登录
     *  params = {username:'',password:''}
     */
    base_login:function(params){

        if(!this._checkIsPass()){
            return;
        }

        params  =   params||{username:store.getValue("username"),password:store.getValue("password")};

        var _username = params.username;
        var _password = params.password;
        if(!_username&&!_password){
            return;
        }

        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_LOGIN,params,function(status,info){
            if(status==Content.SEND_ERROR){
                appFunc.hiAlert(info);
            }
        });

        //从服务器接收数据
        this.socket.on(Content.EVENT_BASE_LOGIN,function(res){
            this.print(res,"登录成功");
            store.setValue("username",res.username);
            store.setValue("password",res.password);
            store.setValue("uid",res.id);
            store.setValue("token",res.token);
            socketPack._isLogin =   true;
            db.dbInsert(table.T_MEMBER,res,function(err,docs){
                socketPack.print(err,"err");
                socketPack.print(docs,"写入成功");
            });

            socketPack.base_get_offline_msg();//获取离线消息
        });
    },

    /**
     * 登录成功后,同步消息
     */
    base_get_offline_msg:function(){
        if(this._checkIsNotConnect()){
            appFunc.hiAlert('当前未连接到服务器.' );
            return;
        }
        if(!store.getValue("token")){
            appFunc.hiAlert('当前未登录,请登录.' );
            socketPack.base_login();
            return;
        }
        var params  =   {
            last_article_id     :   '',//最后资讯ID
            last_vote_id        :   '',//最后投票ID
            last_activity_id    :   '',//最后活动ID
            last_talk_id        :   '',//最后说说ID
            last_comment_id     :   '',//最后评论ID
            last_member_id      :   '',//最后会员ID
            last_chat_id        :   '',//最后聊天ID
            last_chat_group_id  :   '',//群组ID
            last_update_time    :   '',//最后更改个人信息时间
            token               :   store.getValue("token"),
            fromUid             :   store.getValue("uid"),
        };

        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_OFFLINE_MSG,params,function(status,res){
            if(status==Content.SEND_REPLY){
                socketPack.base_login();
            }else if(status==Content.SEND_SUCCESS){
                this.print(res,"获取离线信息成功");
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
    base_register:function(params){

        if(!this._checkIsPass()){
            return;
        }

        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_REGISTER,params,function(status,info){
            if(status==Content.SEND_ERROR){
                appFunc.hiAlert(info);
            }else if(status==Content.SEND_SUCCESS){
                appFunc.hiAlert(info);
                this.print(info,"注册成功");
            }
        });
    },

    /**
     * 获取密码
     * params = {tel:''}
     */
    base_get_pass:function(params){
        if(!this._checkIsPass()){
            return;
        }

        //发送给服务器
        this.socket.emit(Content.EVENT_BASE_GET_PASS,params,function(status,info){
            if(status==Content.SEND_ERROR){
                appFunc.hiAlert(info);
            }else if(status==Content.SEND_SUCCESS){
                appFunc.hiAlert(info);
                this.print(info,"获取成功");
            }
        });
    },

    /**
     * 修改密码
     *
     */
    base_edit_password:function(params){

    }



};

module.exports = socketPack;