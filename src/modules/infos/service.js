var db      =   require("../db/db");
var table   =   require("../db/table");
module.exports = {
    getDatas: function(callback){
        db.dbFind(table.T_ARTICLE,{},function(err,docs){
            return callback(db.returnComm(err,docs));
        },'',0,'',200);
    }
};