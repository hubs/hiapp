require('./contacts.less');

var appFunc     = require('../utils/appFunc'),
    service     = require('./service'),
    template    = require('./contacts.tpl.html'),
    store       = require("../utils/localStore"),
    content     = require("../app/content"),
    cache       = require('memory-cache')
    ;
var _cache_contacts =   'cache_loadContacts';
var contacts = {
    init: function(){
        contacts.bindEvents();
        console.log("init");
    },
    loadContacts: function(){
        console.log("loadContacts");
        hiApp.showIndicator();
        if(contacts.beforeLoadContacts()) {
            hiApp.searchbar('#contactView .searchbar',{
                searchList: '.contacts-list',
                searchIn: '.item-title'
            });

            service.loadContacts({ $not: { id: store.getStorageIntVal("uid")}},function(res){
                if(res.status){
                    var _spell  =   '';
                    var _datas  =   res.msg;
                    $$.each(_datas,function(index,val){
                        var _val_spell   =   val.spell;
                        if(_spell       !=   _val_spell){
                            _spell       =   _val_spell;
                        }else{
                            val.spell='';
                        }
                    });
                    var renderData = {
                        contacts: _datas
                    };
                    var output = appFunc.renderTpl(template, renderData);
                    $$('#contactView .contacts-list ul').html(output);

                    cache.put(_cache_contacts, 'disappear',300000 );//缓存5分钟 300000
                }else{
                    hiApp.hiAlert(res.msg);
                }
            });

        }
        appFunc.lazyImg();
        hiApp.hideIndicator();
        appFunc.removeBadge(content.BADGE_MEMBER);
    },
    beforeLoadContacts: function(){
        if($$('#contactView .contacts-list .list-group .contact-item').length > 0&&cache.get(_cache_contacts)) {
            return false;
        }else {
            return true;
        }
    },

    addMemberToGroup:function(){
        console.log("addMemberToGroup");
        contactF7View.router.loadPage('page/contacts_group.html?group_id=0');
        hiApp.closeModal()
    },
    bindEvents: function(){
        var bindings = [{
            element: '#contactView',
            event: 'show',
            handler: contacts.loadContacts
        },{
            element: ".contact-group-add",
            event: 'click',
            handler: this.addMemberToGroup
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = contacts;
