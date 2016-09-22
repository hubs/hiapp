var db      =   require("../db/db");
var table   =   require("../db/table");
module.exports = {
    getComments: function(params,callback) {
        db.dbFind(table.T_COMMENTS,{type:parseInt(params.type),mark_id:parseInt(params.mark_id)},function(err,docs){
            return callback(db.returnComm(err,docs));
        },'',0,'',500);
    }
};