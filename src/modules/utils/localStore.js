
var localStore = {

    setValue:function(key,value){
        localStorage.setItem(key,value);
    },


    getValue:function(key){
        return localStorage.getItem(key);
    }
};

module.exports = localStore;