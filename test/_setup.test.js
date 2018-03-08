const expect = require('expect');

testing = true;            // global
VERBOSE = false;           // global

global.Game = Object.create({});
global.Creep = Object.create({});

global.Creep.prototype = {};

require('../src/proto/prototype.creep.js');
global.Creep = Creep.prototype;

describe('Mocha and Expect', () => {
  it('should properly run tests.', () => {
    expect(1+3).toEqual(4);
  });
});
