var loki = require('lokijs');
var db = new loki('sandbox.db');

// Add a collection to the database
var items = db.addCollection('items');

// Add some documents to the collection
items.insert({ name : 'mjolnir', owner: 'thor', maker: 'dwarves' });
items.insert({ name : 'gungnir', owner: 'odin', maker: 'elves' });
items.insert({ name : 'tyrfing', owner: 'Svafrlami', maker: 'dwarves' });
items.insert({ name : 'draupnir', owner: 'odin', maker: 'elves' });

// Find and update an existing document
var tyrfing = items.findOne({'name': 'tyrfing'});
tyrfing.owner = 'arngrim';
items.update(tyrfing);

// These statements send to Text Output
console.log('tyrfing value :');
console.log(tyrfing);
console.log('odins items');
console.log(items.find({ 'owner': 'odin' }));

// This statement sends to Inspector
console.log(db);
