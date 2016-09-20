var store       = require("../utils/localStore"),
    db          = require("../db/db"),
    table       = require("../db/table"),
    appFunc     = require("../utils/appFunc")

    ;
var pack = {

    dbUpdateUsername:function(new_username,uid){
        store.setSyncStorageValue("username",new_username);
        //更改评论名字
        var _uid = uid||store.getStorageIntVal("uid");
        db.dbUpdate(table.T_COMMENTS,{id:_uid},{add_username:new_username});
        db.dbUpdate(table.T_TALK,{add_uid:_uid},{add_username:new_username});
        appFunc.setUsernameByUid(_uid,new_username);
    },

    dbUpdateFilename:function(new_filename){
        store.setSyncStorageValue("filename",new_filename);
        appFunc.setFilenameByUid(store.getStorageIntVal("uid"),new_filename);
    },
};
module.exports = pack;