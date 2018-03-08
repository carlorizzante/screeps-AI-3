const useStorage         = true;
const useContainers      = true;
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
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }

    /**
      If out of charge and in Workroom
      */
    } else if (!creep.isCharged() && room == workroom) {
      if (creep.pickupDroplets(20)) return;
      const source = creep.getEnergy(useStorage, useContainers, useSources);

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
      if (creep.pickupDroplets(10)) return;
      const exit = creep.room.findExitTo(workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));
    }
  }
}
