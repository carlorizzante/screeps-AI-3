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
    Tiers cap and threshold
    */
  tier1_energy_cap: function() {
    return 800;
  },
  tier2_energy_threshold: function() {
    return 800;
  },
  tier2_energy_cap: function() {
    return 1500;
  },
  tier3_energy_threshold: function() {
    return 1500;
  },

  /**
    Units cap, calculated on necessity
    @param room ROOM
    @param creepsCount Object, key/value count of creeps in the current room
    */
  harvesters_cap: function(room, creepsCount) { // Range [0, 8]
    const haulers = creepsCount[HAULER] ? creepsCount[HAULER] : 0;
    const miners = creepsCount[MINER] ? creepsCount[MINER] : 0;
    const tier2 =  haulers + miners;
    const sources = room.find(FIND_SOURCES_ACTIVE);
    return 4 * sources.length - tier2;
  },
  builders_cap: function(room) { // Range [0, 4]
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.min([constructionSites.length, 4]);
  },
  upgraders_cap: function(room) { // Range [2, 4]
    return _.max([2, 4 - this.builders_cap(room)]);
  },
  haulers_cap: function(room) {
    return this.miners_cap(room) * 2; // [0, Number of Miners * 2]
  },
  miners_cap: function(room) {
    return room.find(FIND_SOURCES).length; // [0, Number of Energy Sources]
  },

  /**
    Repair or maintenance on structures required
    only below a specific limit of sustained damage.
    */
  repair_threshold: function() {
    return 0.5; // 50%
  },

  /**
    Improvement, repair or maintenance on walls and ramparts
    required only up to a specific limit of hit points.
    */
  wall_repair_threshold: function() {
    return 10000; // up 50.000 hit points
  },

  rampart_repair_threshold: function() {
    return 10000; // up 50.000 hit points
  }
}
