require('./info.less');
var appFunc         = require('../utils/appFunc'),
    commentModule   = require('../comment/comment'),
    template        = require('./info.tpl.html'),
    db              = require("../db/db"),
    table           = require("../db/table")
    ;

var id;
var infoModule  = {
    init: function(query){
        id = parseInt(query.id);
        appFunc.hideToolbar();

        this.bindEvents();

        // render tweet card
        this.getData(id);

        // init comment module
        commentModule.init({id:id,type:1});
    },
    getData: function(_id){
        db.dbFindOne(table.T_ARTICLE,{id:_id},function(err,item){
            var output = appFunc.renderTpl(template, item);
            $$('#infoContent').html(output);
        });

    },
    bindEvents: function(){
        //点击弹出回复
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