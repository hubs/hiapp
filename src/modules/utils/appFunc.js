require('framework7');

module.exports = {

    isPhonegap: function() {
        return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
    },

    renderTpl: function(markup,renderData){
        var compiledTemplate = Template7.compile(markup);
        return compiledTemplate(renderData);
    },

    isEmail: function(str){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
    },

    getPageNameInUrl: function(url){
        url = url || '';
        var arr = url.split('.');
        return arr[0];
    },

    isEmpty: function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },

    hideToolbar: function() {
        hiApp.hideToolbar('.toolbar');
    },

    showToolbar: function() {
        hiApp.showToolbar('.toolbar');
    },

    timeFormat: function(ms){

        ms = ms * 1000;

        var d_second,d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' '+ f(s.getHours()) + ':'+ f(s.getMinutes()));
        }

        function f(n){
            if(n < 10)
                return '0' + n;
            else
                return n;
        }
    },

    getCharLength: function(str){
        var iLength = 0;
        for(var i = 0;i<str.length;i++)
        {
            if(str.charCodeAt(i) >255)
            {
                iLength += 2;
            }
            else
            {
                iLength += 1;
            }
        }
        return iLength;
    },

    matchUrl: function(string){
        var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

        string = string.replace(reg,function(a){
            if(a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1){
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
            }
            else
            {
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
            }
        });
        return string;
    },

    bindEvents: function(bindings) {
        for (var i in bindings) {
            if(bindings[i].selector) {
                $$(bindings[i].element)
                    .on(bindings[i].event,bindings[i].selector , bindings[i].handler);
            }else{
                $$(bindings[i].element)
                    .on(bindings[i].event, bindings[i].handler);
            }
        }
    },

    format_ymd: function(ms){
        ms = ms * 1000;
        var d_second,d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()));
        }

        function f(n){
            if(n < 10)
                return '0' + n;
            else
                return n;
        }
    },
    //多久前评论
    format_how_long : function(create_time){
        var now     =   Date.parse(new Date())/1000;
        var limit   =   now-create_time;
        var content =   "";
        if(limit<60){
            content="刚刚";
        }else if(limit>=60 && limit<3600){
            content=Math.floor(limit/60)+"分钟前";
        }else if(limit>=3600 && limit<86400){
            content=Math.floor(limit/3600)+"小时前";
        }else if(limit>=86400 && limit<2592000){
            content=Math.floor(limit/86400)+"天前";
        }else if(limit>=2592000 && limit<31104000){
            content=Math.floor(limit/2592000)+"个月前";
        }else if(limit>31104000){
            content=Math.floor(limit/31104000)+"年前";
        }else{
            content="很久前";
        }
        return content;
    }


};