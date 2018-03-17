const useStorage         = true;
const useContainers      = true;
const useSources         = true;

const rechargeSpawns     = false;
const rechargeExtensions = true;
const rechargeTowers     = true
const rechargeContainers = false
const rechargeStorage    = false

module.exports = {
  run: creep => {
    "use strict";

    const room = creep.room.name;
    const homeroom = creep.memory.homeroom;
    const workroom = creep.memory.workroom;

    /**
      If charged and in Homeroom
      */
    if (creep.isCharged() && room == homeroom) {
      let repair, build, recharge;
      repair = creep.repairStructure(6);
      if (!repair) build = creep.buildStructure();
      if (!repair && !build) recharge = creep.rechargeStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeContainers, rechargeStorage);
      if (!repair && !build && !recharge) require("role.upgrader").run(creep); // fallback as Upgrader

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
