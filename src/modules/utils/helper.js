var appFunc = require('../utils/appFunc');

Template7.registerHelper('format_ymd', function (create_time){
    return appFunc.format_ymd(create_time);
});
Template7.registerHelper('format_how_long', function (create_time){
    return appFunc.format_how_long(create_time);
});

