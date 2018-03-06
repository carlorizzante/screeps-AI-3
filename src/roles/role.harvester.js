// Structures to recharge
const rechargeSpawns     = true;
const rechargeExtensions = true;
const rechargeTowers     = true
const rechargeStorage    = true;
const rechargeContainers = true;

// Sources of Energy to harvest or withdraw from
const useStorage         = false;
const useContainers      = false;
const useSources         = true;

module.exports = {
  run: creep => {

    const room = creep.room.name;
    const homeroom = creep.memory.homeroom;
    const workroom = creep.memory.workroom;

    /**
      If charged and in Homeroom
      */
    if (creep.isCharged() && room == homeroom) {
      structure = creep.rechargeStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeStorage, rechargeContainers);
      if (!structure) creep.buildStructure();

    /**
      If out of charge and in Workroom
      */
    } else if (!creep.isCharged() && room == workroom) {
      const source = creep.getEnergy(useStorage, useContainers, useSources);

      // Reset Workroom is no Active Source found
      if (!source) creep.changeWorkroom();

    /**
      If charged but not yet in Homeroom
      */
    } else if (creep.isCharged() && room != homeroom) {
      const exit = creep.room.findExitTo(homeroom);
      creep.moveTo(creep.pos.findClosestByPath(exit)); // TODO: optimize path

    /**
      If out of charge and not in Workroom
      */
    } else if (!creep.isCharged() && room != workroom) {
      const exit = creep.room.findExitTo(workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));
    }
  }
}
