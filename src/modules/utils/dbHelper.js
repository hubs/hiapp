var store       = require("../utils/localStore"),
    db          = require("../db/db"),
    table       = require("../db/table")

    ;
var pack = {

    dbUpdateUsername:function(new_username,uid){
        store.setSyncStorageValue("username",new_username);
        //更改评论名字
        var _uid = uid||store.getStorageIntVal("uid");
        db.dbUpdate(table.T_COMMENTS,{id:_uid},{add_username:new_username});
        db.dbUpdate(table.T_TALK,{add_uid:_uid},{add_username:new_username});
    },

    dbUpdateFilename:function(new_filename){
        store.setSyncStorageValue("filename",new_filename);
        store.setValue("filename_"+store.getStorageIntVal("uid"),new_filename);
    },
};
module.exports = pack;