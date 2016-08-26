require('./login.less');

var appFunc         = require('../utils/appFunc'),
    template        = require('./login.tpl.html'),
    socket          = require("../socket/socket"),
    registerTemp    = require("./register.tpl.html"),
    forgetTemp      = require("./forget.tpl.html")

    ;

var loginPack = {
    init: function(){
        loginPack.bindEvents();
        this.renderIndex();
    },
    renderIndex: function(){
        var output = appFunc.renderTpl(template);
        $$('#loginView .page[data-page="login"]').html(output);
        hiApp.hideIndicator();
    },

    //登录操作
    login:function(){
      var _tel = $$("#username").val();
      var _password = $$("#password").val();
      if(!_tel){
          appFunc.hiAlert("手机号不能空.");
          return;
      }
      if(!appFunc.isMobile(_tel)){
          appFunc.hiAlert("手机号格式不正确.");
          return;
      }

      if(!_password){
          appFunc.hiAlert("登录密码不能空.");
          return false;
      }
      $$(this).text("正在登录...");
      socket.base_login({username:_tel,password:_password},function(){
          $$(this).text("登录");
      });
    },

    //注册操作
    register:function(){
        var output = appFunc.renderTpl(registerTemp);
        $$('#loginView .page[data-page="login"]').html(output);
    },

    //忘记密码
    forget:function(){
        var output = appFunc.renderTpl(forgetTemp);
        $$('#loginView .page[data-page="login"]').html(output);
    },

    registerSubmit:function(){
        var _tel      = $$("#tel").val();
        var _username = $$("#username").val();
        var _password = $$("#password").val();
        if(!_tel){
            appFunc.hiAlert("手机号不能空.");
            return;
        }
        if(!appFunc.isMobile(_tel)){
            appFunc.hiAlert("手机号格式不正确.");
            return;
        }
        if(!_username){
            appFunc.hiAlert("用户名不能空.");
            return;
        }
        if(!_password){
            appFunc.hiAlert("登录密码不能空.");
            return false;
        }
        $$(this).text("正在提交...");
        socket.base_register({
            username : _username,
            tel      : _tel,
            password : _password
        },function(data){
            $$(this).text("注册");
            loginPack.renderIndex();
        });
    },
    forgetSubmit:function(){
        var _tel      = $$("#tel").val();
        if(!_tel){
            appFunc.hiAlert("手机号不能空.");
            return;
        }
        if(!appFunc.isMobile(_tel)){
            appFunc.hiAlert("手机号格式不正确.");
            return;
        }
        $$(this).text("正在提交...");
        socket.base_get_pass({
            tel      : _tel
        },function(data){
            $$(this).text("提交");
            loginPack.renderIndex();
        });

    },
    bindEvents: function(){
        var bindings = [{
            element: '#loginView',
            selector: '.btn-login',
            event: 'click',
            handler: loginPack.login
        },{
            element: '#loginView',
            selector: '.btn-register',
            event: 'click',
            handler: loginPack.register
        },{
            element: '#loginView',
            selector: '.btn-forget',
            event: 'click',
            handler: loginPack.forget
        },{
            element: '#loginView',
            selector: '.back',
            event: 'click',
            handler: loginPack.renderIndex
        },{
            element: '#loginView',
            selector: '.register-submit',
            event: 'click',
            handler: loginPack.registerSubmit
        },{
            element: '#loginView',
            selector: '.forget-submit',
            event: 'click',
            handler: loginPack.forgetSubmit
        }];
        appFunc.bindEvents(bindings);
    }
};

module.exports = loginPack;