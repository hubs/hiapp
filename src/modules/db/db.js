require('sqlite3');
var Sequelize = require('sequelize');

var db = new Sequelize('database', 'username', 'password', {
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
/*
db.authenticate().then(function(err){
    console.log("connection has success");
}).catch(function(err){
   console.log("error = "+err);
});*/
