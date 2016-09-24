require('./input.less');

var appFunc     = require('../utils/appFunc'),
    template    = require('./input.tpl.html'),
    camera      = require('../components/camera'),
    geo         = require('../components/geolocation'),
    socket      = require("../socket/socket"),
    store       = require("../utils/localStore"),
    face        = require("../faces/face"),
    atTemplate  = require("./contacts_checkbox.tpl.html"),
    atService   = require('../contacts/service'),
    contacts    = require("../contacts_group/contacts_group"),
    home        = require("../home/home")

    ;
var fn_method;
var pack = {
    openSendPopup: function(fn){

        var output = appFunc.renderTpl(template, {
            send_placeholder: i18n.index.send_placeholder
        });
        hiApp.popup(output);

        var bindings = [{
            element: '#sendWeiboBtn',
            event: 'click',
            handler: pack.postMessage
        },{
            element: 'div.message-tools .get-position',
            event: 'click',
           handler: geo.catchGeoInfo
        },{
            element: '#geoInfo',
            event: 'click',
            handler: geo.cleanGeo
        },{
            element: 'div.message-tools .image-upload',
            event: 'click',
            handler: camera.getPicture
        },{
            element: '.message-tools .icon-emotion',
            event: 'click',
            handler: face.renderFace
        },{
            element:'.message-tools .icon-at',
            event:'click',
            handler:pack.openAtPopup
        }];

        fn_method   =   fn;

        appFunc.bindEvents(bindings);
    },


    //发表新的说说
    postMessage: function(){
        var text = $$('#contentText').val();

        if(appFunc.getCharLength(text) < 4){
            hiApp.alert(i18n.index.err_text_too_short);
            return;
        }

        var params =   {
            username          :  store.getStorageValue("username"),
            content           :  text
        };


        var _imgs  =  [];
        if($$("#uploadPicPreview >img").length>0){
            $$("#uploadPicPreview >img").each(function(index,item){
                _imgs.push(item.src);
            });
        }
        if(_imgs){
           params.imgs  =   JSON.stringify(_imgs);
        }

        hiApp.showPreloader(i18n.index.sending);

        //imgs              :  "" //这里以后应该需要单图片上传后获取URL返回的地址，然后再提交到服务器
        socket.talk(params,function(data){
            hiApp.hidePreloader();
            hiApp.closeModal('.send-popup');
            (typeof(fn_method) === 'function') ? fn_method(data) : '';
        });
    },




    //-------------------暂时放弃@别人的方法，因为后台还没写
    //@别人
    openAtPopup: function(){
        if(pack.beforeLoadContacts()) {
            atService.loadContacts(function(c){
                var _spell  =   '';
                $$.each(c,function(index,val){
                    var _val_spell  =   val.spell;
                    if(_spell!=_val_spell){
                        _spell      =   _val_spell;
                    }else{
                        val.spell='';
                    }
                });

                var renderData = {
                    contacts: c,
                    contact_group:"提醒谁看"
                };
                var output = appFunc.renderTpl(atTemplate, renderData);
                hiApp.popup(output);

                hiApp.searchbar('.searchbarAt .searchbar',{
                    searchList: '.contacts-list',
                    searchIn: '.item-title'
                });

                var bindings = [{
                    element: '.list-group',
                    selector: 'li.contact-item',
                    event:'change',
                    handler:contacts.checkBoxSelect
                },{
                    element: '.btn-load-member-to-group',
                    event:'click',
                    handler:pack.onSelectAt
                },{
                    element:'.back-link',
                    event:'click',
                    handler:pack.onCloseModel
                }];

                appFunc.bindEvents(bindings);

                hiApp.hideIndicator();

                appFunc.lazyImg();
            });


        }
    },
    onSelectAt:function(){
        var _len = $$("input[type=checkbox]:checked").length;
        if(_len<1){
            hiApp.alert("请选择提醒的人.");
            return false;
        }
        if(_len>9){
            appFunc.hiAlert("最多可提醒9人");
            return false;
        }
        var _re =   [];
        $$("input[type=checkbox]:checked").each(function(index,val){
            _re.push({uid:val.value,image:val.getAttribute("data-img")});
        });

        if(!_re){
            hiApp.alert("请提醒的人不能空.");
            return false;
        }


    },
    onCloseModel:function(){
        console.log("close!");
        $$(".popupAt").hide();
    },
    beforeLoadContacts: function(){
        if($$('.popupAt').length > 0) {
            $$(".popupAt").show();
            return false;
        }else {
            hiApp.showIndicator();
            return true;
        }
    },
    //-------------------暂时放弃@别人的方法，因为后台还没写
};

module.exports = pack;