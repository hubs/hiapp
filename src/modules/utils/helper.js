var appFunc = require('../utils/appFunc');

Template7.registerHelper('format_ymd', function (create_time){
    return appFunc.format_ymd(create_time);
});
Template7.registerHelper('format_how_long', function (create_time){
    return appFunc.format_how_long(create_time);
});
Template7.registerHelper('matchUrl', function (content){
    return appFunc.matchUrl(content);
});

Template7.registerHelper('img_tag', function (imgs){
    if(!imgs) {
        return '';
    }
    var _imgs   =   JSON.parse(imgs);
    var _width  =   "100";
    var _len    =   _imgs.length;
    if(_len==1){
        _width  =   "100";
    }else if(_len==2){
        _width  =   '48';
    }else {
        _width  =   "30";
    }
    var ret = '<div class="item-image">';
    $$.each(_imgs, function (index, value) {
        ret+='<img src="'+value+'" width="'+_width+'%" class="">';
    });
    ret+='</div>';
    return ret;
});

Template7.registerHelper('format_chat_time', function (create_time,options){
    return appFunc.format_chat_time(create_time,options.hash.show_time);
});