require('../contacts/contacts.less');

var appFunc     = require('../utils/appFunc'),
    service     = require('../contacts/service'),
    template    = require('./contacts_checkbox.tpl.html');

var _group_id   =   0;
module.exports = {
    init: function(query){
        console.log("contacts_group init");
        _group_id   =   query.group_id;
        this.bindEvents();
        this.loadContacts();

    },
    loadContacts: function(){
        console.log("contacts_group loadContacts");
        if(this.beforeLoadContacts()) {
            hiApp.searchbar('.contacts-group-cls .searchbar',{
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
                    $$('.contacts-group-cls .contacts-list ul').html(output);
                    hiApp.hideIndicator();

                    appFunc.lazyImg();

                },500);
            });
        }
    },
    beforeLoadContacts: function(){
        if($$('.contacts-group-cls .contacts-list .list-group .contact-item').length > 0) {
            return false;
        }else {
            hiApp.showIndicator();
            return true;
        }
    },

    checkBoxSelect:function(){
      var _len = $$("input[type=checkbox]:checked").length;
       console.log("len = "+_len);
      if(_len<1){
        $$(".btn-load-member-to-group").html("确定").attr("disabled","disabled");
      }else{
        $$(".btn-load-member-to-group").removeAttr("disabled").html("确定("+_len+")");
      }
    },

    createGroup:function(){
      console.log("group_id = "+_group_id);
      var _len = $$("input[type=checkbox]:checked").length;
      if(_len<1){
          hiApp.alert("请选择群员.");
          return false;
      }
      $$("input[type=checkbox]:checked").each(function(index,val){
          var _uid  =   $$(this).val();
      });


    },

    bindEvents: function(){
        var bindings = [{
            element: '#contactView',
            event: 'show',
            handler: this.loadContacts
        },{
            element: '.list-group',
            selector: 'li.contact-item',
            event:'change',
            handler:this.checkBoxSelect
        },{
            element: '.btn-load-member-to-group',
            event:'click',
            handler:this.createGroup
        }];

        appFunc.bindEvents(bindings);
    }
};
