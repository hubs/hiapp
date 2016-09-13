require('./user_info.less');
var appFunc     = require('../utils/appFunc'),
    template    = require('./user_info.tpl.html'),
    socket      = require('../socket/socket'),
    db          = require("../db/db"),
    table       = require("../db/table"),
    store       = require("../utils/localStore"),
    Content     = require("../app/content")
    ;

var pack = {
    init: function(){
        appFunc.hideToolbar();

        db.dbFindOne(table.T_MEMBER,{id:store.getStorageIntVal("uid")},function(err,doc){
           　if(err){
               appFunc.hiAlert(err);
               return;
           　}
            console.log(doc);
            doc.filename = Content.IMAGE_URL+doc.filename;
            var output = appFunc.renderTpl(template, {obj:doc});
            if(store.getStorageValue("tel")=="undefined"){
               store.setSyncStorageValue("tel",doc.tel);
            }
            $$('#user-info-content').html(output);
            pack.bindEvents();
        });

    },
    //更新
    updateUser: function(){
        hiApp.showPreloader(i18n.index.sending);
        var _username   =   $$("#input_username").val();
        socket.sys_edit_member({
            username    : _username,
            email       : $$("#email").val(),
            hobby       : $$("#hobby").val(),
            duties      : $$("#duties").val(),
            company     : $$("#company").val(),
            sex         : $$("#sex").val(),
            remark      : $$("#remark").val()
        },function(info){
            hiApp.hidePreloader();
            appFunc.hiAlert(info);
            store.setSyncStorageValue("update_time",appFunc.now_time());
            if(_username!=store.getStorageValue("username")){
                store.setSyncStorageValue("username",_username);
                //更改评论名字
                db.dbUpdate(table.T_COMMENTS,{id:store.getStorageIntVal("uid")},{"add_username":_username});
            }

        });
    },

    //默认选中
    selectText: function(){
        $$(this).focus().val($$(this).val());//将光标移到文字后面
    },
    updateImg:function(event){
        var files   = event.target.files;
        $$.each(files, function(i, file) {
            console.log(file);
            if(!/image.*/.test(file.type)){
                appFunc.hiAlert("只支持图片上传.");
                return true;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                socket.sys_edit_img({
                    msg     :   e.target.result,
                    type    :   1, //1:头像,2:背影
                    msg_ext :   appFunc.fileExt(file.name) //后辍名
                },function(url){
                    store.setSyncStorageValue("filename",url);
                    $$(".user_filename").attr("src",url);
                });
            };
            reader.readAsArrayBuffer(file);
        });
    },
    /**
     * fix Uncaught InvalidStateError: Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string.
     * http://stackoverflow.com/questions/29720794/jquery-select-input-file-and-also-set-it-to-another-input
     */
    updateImgBlur:function(){
        $$('#file-field').val(''); // won't work
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
        },{
            element: '#file-field',
            event: 'change',
            handler: this.updateImg
        },{
            element: '#file-field',
            event: 'blur',
            handler: this.updateImgBlur
        }];


        appFunc.bindEvents(bindings);
    }
};
module.exports = pack;