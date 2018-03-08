require("prototype.creep");
require("prototype.spawn");
require("prototype.tower");

VERBOSE = true; // global

const reporter = require("reporter");

module.exports.loop = function() {
  "use strict";

  if (Game.time % 100 == 0) {
    reporter.report();
  }

  /**
    Run Spawns
    */
  for (let name in Game.spawns) {
    Game.spawns[name].logic();
  }

  /**
    Run Creeps
    */
  for (let name in Game.creeps) {
    Game.creeps[name].logic();
  }

  /**
    Run Towers
    */
  const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (let tower of towers) {
    tower.logic();
  }
}
