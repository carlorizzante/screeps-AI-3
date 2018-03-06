const upgrader = require("role.upgrader");

// Sources of Energy to harvest or withdraw from
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
      let repair, build;
      repair = creep.repairStructure(6);
      if (!repair) build = creep.buildStructure();
      if (!build) upgrader.run(creep);

    /**
      If out of charge and in Workroom
      */
    } else if (!creep.isCharged() && room == workroom) {
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
      const exit = creep.room.findExitTo(workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));
    }
  }
}
