var xhr = require('../utils/xhr');

var db      =   require("../db/db");
var table   =   require("../db/table");

module.exports = {
    getTimeline: function(where,callback){
        db.dbFind(table.T_TALK,where,function(err,docs){
            return callback(db.returnComm(err,docs));
        });
    },
    //newestId:最新的ID
    refreshTimeline: function(newestId,callback){
        db.dbFind(table.T_TALK,{id: { $gt: newestId }},function(err,docs){
            return callback(db.returnComm(err,docs));
        });
    },

    infiniteTimeline: function(lastId,callback){
        xhr.simpleCall({
            func:'more_timeline'
        },function(res){
            callback(res.data);
        });
    }
};