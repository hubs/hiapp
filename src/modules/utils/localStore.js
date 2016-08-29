
var localStore = {

    setValue:function(key,value){
        localStorage.setItem(key,value);
    },


    getValue:function(key){
        return localStorage.getItem(key);
    },

    getIntValue:function(key){
        var val = localStore.getValue(key);
        if(val){
            return parseInt(val);
        }
        return val;
    }
};

module.exports = localStore;