const config = require("config");

const REPAIR_THESHOLD  = config.repair_threshold();
const WALL_THESHOLD    = config.wall_repair_threshold();
const RAMPART_THESHOLD = config.rampart_repair_threshold();
const RANGE = 20;

const VERBOSE = false;
const DEBUG = false;

StructureTower.prototype.logic = function() {

  let target;

  /**
    Defensive Routine
    */
  target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target) {
    return this.attack(target);
  }

  /**
    Healing Routine
    */
  target = this.pos.findInRange(FIND_MY_CREEPS, RANGE, {
    filter: creep => creep.hits < creep.hitsMax
  });
  if (target.length) {
    return this.heal(target[0]);
  }

  /**
    Maintenance Routine
    */
  target = this.pos.findInRange(FIND_MY_STRUCTURES, RANGE, {
    filter: s => s.hits < s.hitsMax
    && s.structureType != STRUCTURE_WALL
    && s.structureType != STRUCTURE_RAMPART
  });
  if (target.length) {
    return this.repair(target[0]);
  }

  /**
    General Maintenance, for example roads
    */
  target = this.pos.findInRange(FIND_STRUCTURES, RANGE, {
    filter: s => s.hits < (s.hitsMax * REPAIR_THESHOLD)
      && s.structureType != STRUCTURE_WALL
      && s.structureType != STRUCTURE_RAMPART
  });
  if (target.length) {
    return this.repair(target[0]);
  }

  /**
    Walls amd Ramparts Maintenance Routine
    */
  target = this.pos.findInRange(FIND_STRUCTURES, RANGE, {
    filter: s => (s.structureType == STRUCTURE_WALL    && s.hits < WALL_THESHOLD)
              || (s.structureType == STRUCTURE_RAMPART && s.hits < RAMPART_THESHOLD)
  });
  if (target.length) {
    return this.repair(target[0]);
  }
}
