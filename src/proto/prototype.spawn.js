const config = require("config");
const roles  = config.roles;
const span   = require("reporter").span;

const SILVER      = '#C0C0C0';
const GRAY        = '#808080';
const SAYSHELLO   = '#FADD99';
const HAPPYORANGE = '#EB6D33';
const LIPERMODALU = '#0E848E';
const GREENPEPPER = '#97963A';
const COMEHOME    = '#F24269';

const BUILDER     = "builder";
const HARVESTER   = "harvester";
const UPGRADER    = "upgrader";
const HAULER      = "hauler";
const HERO        = "hero";
const MINER       = "miner";
const CLAIMER     = "claimer";
const DEFENDER    = "defender";
const GUARD       = "guard";

const TIER1_ENERGY_CAP = config.tier1_energy_cap();
const TIER2_ENERGY_CAP = config.tier2_energy_cap();

const VERBOSE = true;
const DEBUG   = false;

StructureSpawn.prototype.logic = function() {

  const energyCapacityAvailable = this.room.energyCapacityAvailable;
  const energyAvailable         = this.room.energyAvailable;

  if (this.spawning || energyAvailable < 200) return;

  // Delete from memory Creeps that do not longer exist
  this.deleteExpiredCreeps();

  // Keep count of Creeps currently in the room
  const creepsInRoom = this.creepsInRoom();

  // Tier 1
  const HARVESTERS_CAP = config.harvesters_cap(this.room, creepsInRoom);
  const BUILDERS_CAP   = config.builders_cap(this.room);
  const UPGRADERS_CAP  = config.upgraders_cap(this.room);

  // Tier 2
  const TIER2_ENERGY_THRESHOLD = config.tier2_energy_threshold(this.room);
  const HAULER_CAP     = config.haulers_cap(this.room);
  const MINER_CAP      = config.miners_cap(this.room);

  // Tier 3
  // const TIER3_ENERGY_THRESHOLD = config.tier3_energy_threshold(room);
  // const GUARD_CAP   = config.guard_cap(room);
  // const CLAIMER_CAP = 0;

  /**
    Spawn Tier1 Creeps
    */
  if (creepsInRoom[HARVESTER] < HARVESTERS_CAP) {
    this.spawnCustomCreep(HARVESTER, this.room.name, this.room.name);

  } else if (creepsInRoom[UPGRADER] < UPGRADERS_CAP) {
    this.spawnCustomCreep(UPGRADER, this.room.name, this.room.name);

  } else if (creepsInRoom[BUILDER] < BUILDERS_CAP) {
    this.spawnCustomCreep(BUILDER, this.room.name, this.room.name);

  /**
    Creeps Tier 2 allowed only if enough energyCapacityAvailable
    */
  } else if (this.room.energyAvailable < TIER2_ENERGY_THRESHOLD) {
    return;

  // TODO distibure minsers equally amoung available Energy Sources in the room
  } else if (creepsInRoom[MINER] < MINER_CAP && this.room.energyAvailable >= 700) {
    this.spawnCustomCreep(MINER, this.room.name, this.room.name);

  } else if (creepsInRoom[HAULER] < HAULER_CAP) {
    this.spawnCustomCreep(HAULER, this.room.name, this.room.name);

  } else if (this.room.energyAvailable == this.room.energyCapacityAvailable) {
    this.spawnCustomCreep(HERO, this.room.name, _.sample(this.getExits()));
  }
}

/**
  Spawns a new Creep
  @param role String
  @param homeroom String
  @param workroom String
  @param target_id Object ID, optional, ID of the initial target for this new unit
  @returns status (see Game's Constants)
  */
StructureSpawn.prototype.spawnCustomCreep = function(role, homeroom, workroom, target_id) {

  let energyUsed = 0;
  let use;
  const skills = [];

  /**
    Routine for adding parts for spawning a new creep
    Modifies Array skills adding parts to it
    Returns energy used on the specific part
    Uses Array skills
    @param part BODYPART WORK, MOVE, ATTACK...
    @param cost integer cost of the BODYPART
    @param budget integer max energy available for the part
    @param skills Array [WORK, MOVE, ATTACK...]
    */
  function addParts(part, cost, budget, skills) {
    let energyUsed = 0;
    while(budget >= cost) {
      skills.push(part);
      budget -= cost;
      energyUsed += cost;
    }
    return energyUsed;
  }

  // Tier 1

  if (role == BUILDER || role == HARVESTER || role == UPGRADER) {
    // 50% WORK
    // 25% CARRY
    // 25% MOVE
    use = _.min([TIER1_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(WORK, 100, Math.floor(use * 0.50), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.25), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.25), skills);
  }

  // Tier 2

  if (role == HAULER) {
    // 50% CARRY
    // 50% MOVE
    use = _.min([TIER2_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.50), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.50), skills);
  }

  if (role == HERO) {
    // 25% WORK
    // 40% CARRY
    // 35% MOVE
    use = _.min([TIER2_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(WORK, 100, Math.floor(use * 0.25), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.40), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.35), skills);
  }

  if (role == MINER) { // cost 700
    // 5 WORK -> exhaust a 3000 Energy Source right before regeneration
    // 2 CARRY
    // 2 MOVE
    use = 500 + 100 + 100;
    energyUsed += addParts(WORK, 100, Math.floor(500), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(100), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(100), skills);
    // this.memory.miner_index = this.memory.miner_index ? this.memory.miner_index : 1;
  }

  // Spawn new creep
  if (DEBUG) console.log("Using", use, "to spawn", role);
  let name = role + energyUsed + "-" + Game.time + "-" + homeroom;
  const result = Game.spawns[this.name].spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  let text;
  const spawn = span(HAPPYORANGE, this.name + " " + this.room.name);
  if (result == OK) {
    text = span(GRAY, "spawning ") + name + " " + span(GRAY, listSkills(skills)) + " " + span(GRAY, homeroom + ", " + workroom + ", " + target_id);
  } else {
    text = span(GRAY, "failed to spawn ") + role + ", error " + result + span(GRAY, ", cost " + calcCreepCost(skills));
  }
  if (VERBOSE) console.log(spawn, text);
  return result;
}

/**
  Effects: deletes from Memory Creeps that do not longer exist
  */
StructureSpawn.prototype.deleteExpiredCreeps = function() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      if (VERBOSE) console.log(span(GRAY, name + " deleted from memory."));
      delete Memory.creeps[name];
    }
  }
}

/**
  Returns the count of Creeps in the current room, grouped by roles
  @returns Object, count of each existing role in the current room
  */
StructureSpawn.prototype.creepsInRoom = function() {
  const creepsInRoom = this.room.find(FIND_MY_CREEPS);
  const count = {}
  for (let role of roles) {
    count[role] = _.sum(creepsInRoom, c => c.memory.role == role);
  }
  if (DEBUG) for (let role in count) console.log(role, count[role]);
  return count;
}

/**
  Returns an array with the name of the adjacent rooms
  @returns Array of String, exits to rooms that do not belong to the player
  */
StructureSpawn.prototype.getExits = function() {
  const adjacentRooms = Game.map.describeExits(this.room.name);
  const forbiddenRooms = Memory.spawns;
  let rooms = [];
  for (let key in adjacentRooms) {
    rooms.push(adjacentRooms[key]);
  }
  forbiddenRooms.push('W6N4'); // DEFCON 4 TODO Learn from environment and add/remove automatically
  rooms = rooms.filter(r => forbiddenRooms.indexOf(r) < 0);
  return rooms; // ['W3N5', 'W2N4', ...]
}

/**
  Converts an Array of Body Parts into a string like [3 WORK, 2 CARRY, ...]
  @param skills Array
  @returns String, list of Body Parts
  */
function listSkills(skills) {
  const countParts = {}
  let output = "[";
  for (let skill of skills) {
    countParts[skill] = countParts[skill] ? countParts[skill] + 1 : 1;
  }
  for (let part in countParts) {
    output += countParts[part] + " " + part.toUpperCase() + ", ";
  }
  return output.slice(0,-2) + "]";
}

/**
  Returns the cost as Number in Energy of all parts in a Creep combined
  @param parts Array of Body Parts [WORK, MOVE, CARRY, ...]
  @returns Number, total cost of all Body Parts combined
  */
function calcCreepCost(parts) {
  let totalCost = 0;
  const bodyPartCosts = {
    move:    50,
    work:   100,
    carry:   50,
    attack:  80,
    ranged_attack: 150,
    heal:   250,
    claim:  600,
    tough:   10
  }
  parts.forEach(part => totalCost += bodyPartCosts[part]);
  return totalCost;
}
