var db      =   require("../db/db");
var table   =   require("../db/table");
module.exports = {
    getDatas: function(where,callback){
        db.dbFind(table.T_ARTICLE,where,function(err,docs){
            return callback(db.returnComm(err,docs));
        });
    }
};