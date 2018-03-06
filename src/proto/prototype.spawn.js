const config = require("config");

// List of active Creeps' roles
const roles = [

  // Tier 1 from 300 Energy
  "builder",
  "harvester",
  "upgrader",

  // Tier 2 from 800 Energy
  // "hauler",
  // "hero",
  // "miner",

  // Tier 3
  // "claimer",
  // "defender",
  // "guard"
];

/**
  Creeps Tier 1
  */
const BUILDER   = "builder";
const HARVESTER = "harvester";
const UPGRADER  = "upgrader";
const TIER1_ENERGY_CAP = config.tier1_energy_cap();

/**
  Creeps Tier 2
  */
const HAULER = "hauler";
const HERO   = "hero";
const MINER  = "miner";
const TIER2_ENERGY_CAP = config.tier2_energy_cap();

/**
  Creeps Tier 3
//   */
const CLAIMER  = "claimer";
const DEFENDER = "defender";
const GUARD    = "guard";

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
  // const TIER2_ENERGY_THRESHOLD = config.tier2_energy_threshold(room);
  // const HAULER_CAP     = config.haulers_cap(room);
  // const MINER_CAP      = config.miners_cap(room);

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
    let use = _.min([TIER1_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(WORK, 100, Math.floor(use * 0.50), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.25), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.25), skills);
  }

  // Tier 2

  if (role == HAULER) {
    // 50% CARRY
    // 50% MOVE
    let use = _.min([TIER2_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.50), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.50), skills);
  }

  if (role == HERO) {
    // 20% WORK
    // 40% CARRY
    // 40% MOVE
    let use = _.min([TIER2_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(WORK, 100, Math.floor(use * 0.20), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.40), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.40), skills);
  }

  if (role == MINER) { // cost 700
    // 5 WORK -> exhaust a 3000 Energy Source right before regeneration
    // 2 CARRY
    // 2 MOVE
    let use = 500 + 100 + 100;
    energyUsed += addParts(WORK, 100, Math.floor(500), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(100), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(100), skills);
    // this.memory.miner_index = this.memory.miner_index ? this.memory.miner_index : 1;
  }

  // Spawn new creep
  let name = role + energyUsed + "-" + Game.time + "-" + homeroom;
  const result = Game.spawns[this.name].spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK) {
    if (VERBOSE) console.log(this.name, "is spawning", name, listSkills(skills), homeroom, workroom, target_id);
  } else if (VERBOSE) {
    console.log(this.name, "spawning", role, "failed:", result, "cost:", calcCreepCost(skills));
  }
  return result;
}

/**
  Effects: deletes from Memory Creeps that do not longer exist
  */
StructureSpawn.prototype.deleteExpiredCreeps = function() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      if (VERBOSE) console.log("Creep", name, "deleted from memory.");
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
  return count
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
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
  }
  parts.forEach(part => totalCost += bodyPartCosts[part]);
  return totalCost;
}