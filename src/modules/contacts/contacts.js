require('./contacts.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./contacts.tpl.html');

var contacts = {
    init: function(){
        contacts.bindEvents();
        console.log("init");
    },
    loadContacts: function(){
        console.log("loadContacts");
        if(contacts.beforeLoadContacts()) {
            hiApp.searchbar('#contactView .searchbar',{
                searchList: '.contacts-list',
                searchIn: '.item-title'
            });

            service.loadContacts(function(c){
                setTimeout(function(){
                    var _spell  =   '';
                    $$.each(c,function(index,val){
                        var _val_spell  =   val.spell;
                        if(_spell!=_val_spell){
                            _spell  =   _val_spell;
                        }else{
                            val.spell='';
                        }
                    });
                    var renderData = {
                        contacts: c
                    };
                    var output = appFunc.renderTpl(template, renderData);
                    $$('#contactView .contacts-list ul').html(output);

                    hiApp.hideIndicator();

                    appFunc.lazyImg();

                },500);
            });
        }
    },
    beforeLoadContacts: function(){
        if($$('#contactView .contacts-list .list-group .contact-item').length > 0) {
            return false;
        }else {
            hiApp.showIndicator();
            return true;
        }
    },
    bindEvents: function(){
        var bindings = [{
            element: '#contactView',
            event: 'show',
            handler: contacts.loadContacts
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = contacts;
