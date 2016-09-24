var db      =   require("../db/db");
var table   =   require("../db/table");
var appFunc =   require("../utils/appFunc");
module.exports = {
    getComments: function(params,callback) {
        db.dbFind(table.T_COMMENTS,{type:appFunc.parseInt(params.type),mark_id:appFunc.parseInt(params.mark_id)},function(err,docs){
            return callback(db.returnComm(err,docs));
        },'',0,'',500);
    }
};