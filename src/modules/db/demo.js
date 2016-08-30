var db  =   require("./db");
const TABLE_DEMO    =   "chat";
db.init();

db.dbCount(TABLE_DEMO,'',function(err,res){
    console.log("dbCount ");
    console.log(res);
});
db.dbFind(TABLE_DEMO,{},function(err,res){
    console.log("dbFind ");
    console.log(res);
});

/*
db.dbCount(TABLE_DEMO,{key:"hello 2"},function(err,count){
    console.log("dbCount ");
    console.log(db.returnComm(err,count));
});
db.dbFind(TABLE_DEMO,{key:"hello"},function(err,doc){
    console.log("dbFind ");
    console.log(db.returnComm(err,doc));
});

db.dbUpdate(TABLE_DEMO,{key:"hello"},{key:"hello 3"},function(err,res){
    console.log("dbUpdate ");
    console.log(db.returnComm(err,res));
});

db.dbFind(TABLE_DEMO,{value:"would"},function(err,res){
    console.log("dbFind ");
    console.log(db.returnComm(err,res));
});

db.dbDel(TABLE_DEMO,{key:"two"},function(err,res){
    console.log("dbDel ");
    console.log(db.returnComm(err,res));
});

db.dbInsert(TABLE_DEMO,{key:"three"},function(err,res){
    console.log("dbInsert ");
    console.log(db.returnComm(err,res));
});

db.dbCount(TABLE_DEMO,'',function(err,res){
    console.log("dbCount ");
    console.log(db.returnComm(err,res));
});
*/
