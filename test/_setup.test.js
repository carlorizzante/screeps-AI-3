const expect = require('expect');

testing = true;            // global
VERBOSE = false;           // global

global.Game = Object.create({});

global.Creep = function() {
  this.memory = {};
  this.pos = {};
  this.room = {};
  this.carry = {};
}

Creep.prototype.pos = {};

require('../src/proto/prototype.creep.js');

describe('Mocha and Expect', () => {
  it('should properly run tests.', () => {
    expect(1 + 3).toEqual(4);
  });
});
