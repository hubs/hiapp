var db      =   require("../db/db");
var table   =   require("../db/table");

module.exports = {

    loadContacts: function(where,callback){
        db.dbFindAll(table.T_MEMBER,where,function(err,docs){
            return callback(db.returnComm(err,docs));
        },{"spell":1,'username':1});
    }
};