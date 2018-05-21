// Custom Modules

// Modules
var events = require('events');
var util = require('util');

var person = function(name){
    this.name = name;
}

// People can now emit events
util.inherits(person, events.EventEmitter);

var james = new person('james');
var mary = new person('mary');
var ryan = new person('ryan');
var people = [james, mary, ryan];

people.forEach(function(person){
    person.on('speak', function(mssg){
        console.log(person.name + ' said:  ' + mssg);
    });
});

james.emit('speak', 'blah');
