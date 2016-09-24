
var db      =   require("../db/db");
var table   =   require("../db/table");
var appFunc =   require("../utils/appFunc");

module.exports = {
    getTimeline: function(where,callback){
        db.dbFind(table.T_TALK,where,function(err,docs){
            return callback(db.returnComm(err,docs));
        });
    },
    //newestId:最新的ID
    refreshTimeline: function(newestId,callback){
        db.dbFind(table.T_TALK,{id: { $gt: appFunc.parseInt(newestId) }},function(err,docs){
            return callback(db.returnComm(err,docs));
        });
    }
};