module.exports = {
    getLocal: function(){
        return localStorage.getItem('lang') || 'zh-cn';
    },
    setLocal: function(lang){
        localStorage.setItem('lang', lang);
    }
};