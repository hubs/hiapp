var Datastore = require('nedb')
    , db = new Datastore({ filename: 'aaaa.db' });
db.loadDatabase(function (err) {    // Callback is optional
    // Now commands will be executed
});
/*
var doc = { hello: 'world2222'
    , n: 5
    , today: new Date()
    , nedbIsAwesome: true
    , notthere: null
    , notToBeSaved: undefined  // Will not be saved
    , fruits: [ 'apple', 'orange', 'pear' ]
    , infos: { name: 'nedb' }
};

db.insert(doc, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined

   // console.log(err);
 //   console.log(newDoc);
});
*/



db.find({}, function (err, docs) {
    console.log("find ");
    console.log(docs);
});
