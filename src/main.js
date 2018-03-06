require("prototype.creep");
require("prototype.spawn");
require("prototype.tower");

module.exports.loop = function() {
  "use strict";

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
    // tower.logic();
  }
}
