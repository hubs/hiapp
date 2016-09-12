
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
    },

    setStorageValue:function(key,value){
        localStore.setValue(localStore._getStoragePre()+key,value);
    },

    getStorageValue:function(key){
        return localStore.getValue(localStore._getStoragePre()+key);
    },
    getStorageIntVal:function(key){
        return localStore.getIntValue(localStore._getStoragePre()+key);
    },
    _getStoragePre : function(){
        return localStore.getValue("storage")+"_";
    }

};

module.exports = localStore;