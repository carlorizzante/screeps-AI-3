const roles = {

  // Tier 1
  builder: require("role.builder"),
  harvester: require("role.harvester"),
  upgrader: require("role.upgrader"),

  // Tier 2
  // hauler: require("role.hauler"),
  // hero: require("role.hero"),
  miner: require("role.miner"),

  // Tier 3
  // claimer: require("role.claimer"),
  // defender: require("role.defender"),
  // guard: require("role.guard")
};

const COMICS  = true;
const VERBOSE = true;
const DEBUG   = false;

const GRAY    = '#808080';
const span = require("reporter").span;

Creep.prototype.logic = function() {
  // if (!this.memory.homeroom) this.memory.homeroom = this.room.name;
  // if (!this.memory.workroom) this.memory.workroom = this.room.name;
  const homeroom = this.remember('homeroom');
  if (this.room.name == homeroom && this.recycleAt(30)) return;  // Recycle at 30 ticks in Homeroom
  if (this.room.name != homeroom && this.recycleAt(100)) return; // Recycle at 100 ticks otherwise

  this.pickupDroplets(10);
  roles[this.memory.role].run(this);
}

/**
  Given a key, returns from Creep's memory the corresponding value if exists,
  otherwise, if key does not exist, stores key/value
  @param key String
  @param value Json
  @return json value
  */
Creep.prototype.remember = function(key, val) {
  if (typeof key != 'string') throw Error("key has to be a string.");
  if (val && !this.validateValue(val)) throw Error("val has to be a json valid entry.");
  if (val === undefined || val === null) return this.memory[key];
  this.memory[key] = val;
  return val;
}

/**
  Given a key, delete the key and its associated value from the Creep's memory
  @param key String
  @return void
  */
Creep.prototype.forget = function(key) {
  delete this.memory[key];
}

Creep.prototype.validateValue = function(data) {
  return typeof data === 'string'
      || typeof data === 'number'
      || typeof data === 'boolean'
      || typeof data === 'object';
}

/**
  Returns true if the Creep is fully charged, false otherwise
  Modifies this.memory.charged = Boolean
  @returns Boolean, Creep's charged state, true is ready for duty, false needs to recharge
  */
Creep.prototype.isCharged = function() {
  if (this.carry.energy <= 0) {
    this.remember('charged', false);
    this.forget('structure_id');
  } else if (this.carry.energy == this.carryCapacity) {
    this.remember('charged', true);
    this.forget('storage_id');
    this.forget('source_id');
  }
  return this.remember('charged'); // return state
}

/**
  Returns true if conditions are met, false otherwise
  Used by Miners to lock up onto Energy Sources and the adjacent Container
  @param ifNearbyEnergySource Boolean default: true
  @param ifNearbyContainer Boolean
  @returns Boolean, true is locked, false othewise
  TODO refactor to enable different type of Source/Minerals
  */
Creep.prototype.isLocked = function(ifNearbyEnergySource, ifNearbyContainer) {

  ifNearbyEnergySource = ifNearbyEnergySource ? ifNearbyEnergySource : false;

  let energySourceFound;
  let containerFound;
  let locked = true;

  // Stay locked is conditions have previously successfully met
  if (this.remember('locked')) {
    return true;
  }

  if (ifNearbyEnergySource) {
    energySourceFound = this.pos.findInRange(FIND_SOURCES, 1);
  }

  if (ifNearbyContainer) {
    containerFound = this.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: s => s.structureType == STRUCTURE_CONTAINER
    });
  }

  if (ifNearbyEnergySource) locked = locked && energySourceFound.length;
  if (ifNearbyContainer)    locked = locked && containerFound.length;

  if (locked) {
    this.remember('locked', true);
    if (ifNearbyEnergySource) this.memory.locked_on_energy_source_id = energySourceFound[0].id;
    if (ifNearbyContainer) this.memory.locked_on_container_id = containerFound[0].id;
  }
  return locked;
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
  if (this.remember('storage_id')) {
    storage = Game.getObjectById(this.remember('storage_id'));

    // If storage empty, reset and start over
    if (storage.store[RESOURCE_ENERGY] <= threshold) {
      this.forget('storage_id');
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
  if (!storage && useSource && this.remember('source_id')) {
    source = Game.getObjectById(this.remember('source_id'));

    // If Source exhausted, reset and start over
    if (source.energy <= 0) {
      this.forget('source_id');
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
  if (storage) this.remember('storage_id', storage.id);
  if (source)  this.remember('source_id', source.id);

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

  if (this.remember('structure_id')) return Game.getObjectById(this.remember('structure_id'));

  let structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: s => (includeSpawns && s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
      || (includeExtensions && s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity)
      || (includeTowers && s.structureType ==         STRUCTURE_TOWER && s.energy < s.energyCapacity * 0.7)
      || (includeStorage && s.structureType ==      STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)
  });
  if (includeContainers && !structure) structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s => (includeContainers && s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)
  });

  if (structure) this.remember('structure_id', structure.id);
  if (!structure) this.forget('structure_id');
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
    if (result == ERR_FULL || result == ERR_NO_PATH) this.forget('structure_id');
  }
  return structure;
}

/**
  Effects: Creep finds and repairs structures nearby in need or maintenance
  @param range Int range within look for structure to repair
  @returns Int, length of structures found
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
  @returns ConstructionSite
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
  @param roomname String, the name of the room to use as Workroom
  @returns String, new Workroom
  */
Creep.prototype.changeWorkroom = function(roomname) {

  if (roomname) {
    return this.remember('workroom', roomname);
  }

  let rooms = [];
  const neighbourhood = Game.map.describeExits(this.room.name);
  const myRooms = Memory.spawns;

  for (let key in neighbourhood) rooms.push(neighbourhood[key]);

  // Remove already owned rooms from neighbourhod
  rooms = rooms.filter(r => myRooms.indexOf(r) < 0);
  const newWorkroom = _.sample(rooms);

  if (COMICS) this.say(newWorkroom);
  return this.remember('workroom', newWorkroom);
}

/**
  Effects: Creep moves towards Spawn in Homeroom, and eventually gets recycled
  @param threshold Int, ticks left to live under which initiate the recycling procedure
  @returns Boolean, true if Creep is due for recycling, false otherwise
  TODO clean up and refactor
  */
Creep.prototype.recycleAt = function(threshold) {
  if (!threshold) throw Error('Missing param threshold');
  if (this.ticksToLive <= threshold) {
    if (COMICS) this.say("#@$");

    if (this.room.name != this.remember('homeroom')) {
      const exit = this.room.findExitTo(this.remember('homeroom'));
      this.moveTo(this.pos.findClosestByPath(exit));
      return
    }

    const spawn = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_SPAWN
    });

    if (!spawn) return false; // No Spawn in sight yet

    if (this.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || spawn.recycleCreep(this) == ERR_NOT_IN_RANGE) {
      this.moveTo(spawn);
    } else {
      if (VERBOSE) console.log(span(GRAY, this.name + " has been recycled"));
    }
    return true;
  }
  return false;
}

/**
  Effects: Enables Creep to look out for dropped Energy in range and to pick it up
  @param range int
  TODO refactor and optimize
  TODO distinguish between resource type
  TODO verify that Creep has CARRY body part and can handle Energy
  */
Creep.prototype.pickupDroplets = function(range) {
  if (!range) throw Error("Missing param range.");
  if (Game.time % range != 0) return; // Look up every "range" ticks
  const droplets = this.pos.findInRange(FIND_DROPPED_RESOURCES, range);
  if (droplets.length) {
    const pickup = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: r => r.resourceType == RESOURCE_ENERGY
    });
    // Pickup only worthing droplets
    if (pickup.amount >= 50 && this.pickup(pickup) == ERR_NOT_IN_RANGE) this.moveTo(pickup);
    return; // Prioritize current operation
  }
}
