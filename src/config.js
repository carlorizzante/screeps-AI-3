const BUILDER   = "builder";
const HARVESTER = "harvester";
const UPGRADER  = "upgrader";
const HAULER    = "hauler";
const HERO      = "hero";
const MINER     = "miner";
const CLAIMER   = "claimer";
const DEFENDER  = "defender";
const GUARD     = "guard";

module.exports = {
  roles: [
    "builder",
    "harvester",
    "upgrader",
    "hauler",
    "hero",
    "miner",
    "claimer",
    "defender",
    "guard"
  ],

  /**
    Max energy available for Creeps Tier 1.
    capped to 800
    */
  tier1_energy_cap: function() {
    return 800;
  },

  /**
    Max energy available for Creeps Tier 2.
    capped to 1500
    */
  tier2_energy_cap: function() {
    return 1500;
  },

  /**
    Creeps Tier 2 allowed only at 1000 energy max capacity for current room.
    */
  tier2_energy_threshold: function() {
    return 800;
  },

  /**
    Creeps Tier 3 allowed only at 1500 energy max capacity for current room.
    */
  tier3_energy_threshold: function() {
    return 1500;
  },

  /**
    Harvesters are spawn in presence of active energy sources.
    Range [0, 8]
    @param room ROOM
    @param creepsCount Object, key/value count of creeps in the current room
    */
  harvesters_cap: function(room, creepsCount) {
    const haulers = creepsCount[HAULER] ? creepsCount[HAULER] : 0;
    const miners = creepsCount[MINER] ? creepsCount[MINER] : 0;
    const tier2 =  haulers + miners;
    const sources = room.find(FIND_SOURCES_ACTIVE);
    return 4 * sources.length - tier2;
  },

  /**
    Builders are spawn only if required.
    Range [0, 4]
    */
  builders_cap: function(room) {
    // const maxEnergy = room.energyCapacityAvailable;
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.min([constructionSites.length, 4]);
  },

  /**
    Upgraders are reduced in number if builders are required
    Range [2, 4]
    */
  upgraders_cap: function(room) {
    return _.max([2, 4 - this.builders_cap(room)]);
  }
}
