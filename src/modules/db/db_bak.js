var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
    db.run("CREATE TABLE lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();

/*
require('sqlite3');
var Sequelize = require('sequelize');

var db = new Sequelize('database', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: '../../database.sqlite'
});
console.log("HELLO");
db.authenticate().then(function(err){
    console.log("connection has success");
}).catch(function(err){
   console.log("error = "+err);
});
*/
