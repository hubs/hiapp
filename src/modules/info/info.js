require('./info.less');

var appFunc = require('../utils/appFunc'),
    commentModule = require('../comment/comment'),
    template = require('./info.tpl.html');

var id;
var infoModule = {
    init: function(query){
        id = query.id;
        appFunc.hideToolbar();

        this.bindEvents();

        // render tweet card
        this.getData();

        // init comment module
        commentModule.init();
    },
    getData: function(){


        var item = {
            "add_username"  :   "Bob Brown",
            "content"       :   "Behind every successful man there's a lot u unsuccessful years. http://goo.gl/",
            "title"         :   "Hello 测试",
            "filename"      :   "http://img003.21cnimg.com/photos/album/20151103/m600/76948B09AE457B980D25309CB914859E.jpeg",
            "create_time"   :   "1404709434"
        };

        var output = appFunc.renderTpl(template, item);
        $$('#infoContent').html(output);
    },
    bindEvents: function(){
        var bindings = [{
            element: '#commentContent',
            selector: '.comment-item',
            event: 'click',
            handler: commentModule.createActionSheet
        },{
            element: '#infosView .item-comment-btn',
            event: 'click',
            handler: commentModule.commentPopup
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = infoModule;