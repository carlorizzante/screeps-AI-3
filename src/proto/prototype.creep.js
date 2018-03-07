const roles = {

  // Tier 1
  builder: require("role.builder"),
  harvester: require("role.harvester"),
  upgrader: require("role.upgrader"),

  // Tier 2
  // hauler: require("role.hauler"),
  // hero: require("role.hero"),
  // miner: require("role.miner"),

  // Tier 3
  // claimer: require("role.claimer"),
  // defender: require("role.defender"),
  // guard: require("role.guard")
};

const COMICS  = true;
const VERBOSE = true;
const DEBUG   = false;

Creep.prototype.logic = function() {
  if (!this.memory.homeroom) this.memory.homeroom = this.room.name;
  if (!this.memory.workroom) this.memory.workroom = this.room.name;
  roles[this.memory.role].run(this);
}

/**
  Returns true if the Creep is fully charged, false otherwise
  Modifies this.memory.charged = Boolean
  @returns Boolean, this.memory.charged state
  */
Creep.prototype.isCharged = function() {
  if (this.carry.energy <= 0) {
    this.memory.charged = false;
  } else if (this.carry.energy == this.carryCapacity) {
    this.memory.charged = true;
    delete this.memory.source_id;
  }
  return this.memory.charged; // Return state
}

/**
  Returns true if a source of Energy is found, false otherwise
  @param useStorage Boolean
  @param useContainers Boolean
  @param useSource Boolean
  @returns Boolean, true for found, false otherwise
  */
Creep.prototype.getEnergy = function(useStorage, useContainers, useSource) {

  // Elect only Storage or Containers if there is enough energy to take
  const threshold = this.carryCapacity / 2;

  let source;  // Energy Sources require harvest()
  let storage; // Containers and Storage require withdraw()

  // First check that Creep has already a target Storage or Container
  if (this.memory.storage_id) {
    storage = Game.getObjectById(this.memory.storage_id);

    // If storage empty, reset and start over
    if (storage.store[RESOURCE_ENERGY] <= threshold) {
      delete this.memory.storage_id;
      storage = null;
    }
  }

  // Else, prioritize Storage...
  if (!storage && useStorage && this.room.storage && this.room.storage.store.energy >= threshold) {
    storage = this.room.storage;
  }

  // ...or Containers
  if (!storage && useContainers) {
    storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
    });
  }

  // Otherwise check that Creep has already a target Source
  if (!storage && useSource && this.memory.source_id) {
    source = Game.getObjectById(this.memory.source_id);

    // If Source exhausted, reset and start over
    if (source.energy <= 0) {
      delete this.memory.source_id;
      source = null;
    }
  }

  // If no target Source look for a nearby one
  if (!source && useSource) {
    source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
      filter: s => s.energy >= 0 // Only if Source has somehow enough to harvest
    });
  }

  // If a Storage or Source found, save it and use it at the next tick
  if (storage) this.memory.storage_id = storage.id;
  if (source)  this.memory.source_id = source.id;

  // Prioritize Storage and Containers over Sources
  if (storage && this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    this.moveTo(storage);

  // Then use Sources
  } else if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
    this.moveTo(source);
  }

  // Return Boolean, found / not found
  return ((useContainers || useStorage) && storage) || (useSource && source);
}

/**
  Returns a suitable structure to recharge to be used as target
  @param includeSpawns Boolean
  @param includeExtensions Boolean
  @param includeTowers Boolean
  @param includeStorage Boolean
  @param includeContainers Boolean
  @returns Object Structure or null if no Structure found
  */
Creep.prototype.findStructure = function(includeSpawns, includeExtensions, includeTowers, includeStorage, includeContainers) {

  if (this.memory.structure_id) return Game.getObjectById(this.memory.structure_id);

  let structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: s => (includeSpawns && s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
      || (includeExtensions && s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity)
      || (includeTowers && s.structureType ==         STRUCTURE_TOWER && s.energy < s.energyCapacity * 0.7)
      || (includeStorage && s.structureType ==      STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)
  });
  if (includeContainers && !structure) structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s => (includeContainers && s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)
  });

  if (structure) this.memory.structure_id = structure.id;
  if (!structure) delete this.memory.structure_id;
  return structure;
}

/**
  Effects: Creep looks for and recharges a suitable structure in need of Energy
  @param includeSpawns Boolean
  @param includeExtensions Boolean
  @param includeTowers Boolean
  @param includeStorage Boolean
  @param includeContainers Boolean
  @returns Boolean, true if successful, false otherwise
  */
Creep.prototype.rechargeStructure = function(includeSpawns, includeExtensions, includeTowers, includeStorage, includeContainers) {
  structure = this.findStructure(includeSpawns, includeExtensions, includeTowers, includeStorage, includeContainers);
  if (structure) {
    let result = this.transfer(structure, RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) result = this.moveTo(structure);
    if (result == ERR_FULL || result == ERR_NO_PATH) delete this.memory.structure_id;
  }
  return structure;
}

/**
  Effects: Creep finds and repairs structures nearby in need or maintenance
  @param range Number range within look for structure to repair
  @returns Number, length of structures found
  */
Creep.prototype.repairStructure = function(range) {
  const repairThrehold = 0.5; // TODO: bind this to config.js
  const structures = this.pos.findInRange(FIND_STRUCTURES, range, {
    filter: s => s.hits < (s.hitsMax * repairThrehold)
    && s.structureType != STRUCTURE_RAMPART
    && s.structureType != STRUCTURE_WALL
  });

  if (structures.length) {
    if (this.repair(structures[0]) == ERR_NOT_IN_RANGE) {
      this.moveTo(structures[0]);
    }
  }
  return structures.length;
}

/**
  Effects: Creep looks for a construction site and move to build it
  @returns CONSTRUCTION_SITE
  TODO: store target_id
  */
Creep.prototype.buildStructure = function() {
  const constructionSite = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
  if (constructionSite) {
    if (this.build(constructionSite) == ERR_NOT_IN_RANGE) {
      this.moveTo(constructionSite);
    }
  }
  return constructionSite;
}

/**
  Allows Creeps to move to a nearby rooms if no Energy source is available
  Modifies creep.memory.workroom
  @param roomname String the name of the room to use as Workroom
  @returns Boolean, true if successful, false otherwise
  */
Creep.prototype.changeWorkroom = function(roomname) {

  if (roomname) {
    this.memory.workroom = roomname;
    return this.memory.workroom == roomname;
  }

  let rooms = [];
  const neighbourhood = Game.map.describeExits(this.room.name);
  const myRooms = Memory.spawns;

  for (let key in neighbourhood) rooms.push(neighbourhood[key]);

  // Remove already owned rooms from neighbourhod
  rooms = rooms.filter(r => myRooms.indexOf(r) < 0);
  const newWorkroom = _.sample(rooms);

  if (COMICS) this.say(newWorkroom);
  
  this.memory.workroom = newWorkroom;
  return this.memory == newWorkroom;
}
