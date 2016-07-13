var appFunc = require('../utils/appFunc');

Template7.registerHelper('hello', function (create_time){
    return appFunc.timeFormatYmd(create_time);
});
