//require assert dependancy
const assert = require('assert');
const User = require('../src/user');

//Test for what tests are breaking to create a new record.
describe('Create records', () =>{
    it('saves a user', () =>{
        //assution to compare one value to another
        const joe = new User({ name:'Joe' });

        joe.save();
    });
});