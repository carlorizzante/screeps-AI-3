// Structures to recharge
const rechargeSpawns     = true;
const rechargeExtensions = true;
const rechargeTowers     = false;
const rechargeContainers = true;
const rechargeStorage    = true;
const resetWorkroom      = true;

// Withdraw or harvest Energy from
const useStorage         = false;
const useContainers      = false;
const useSources         = true;

module.exports = {
  run: creep => {
    "use strict";

    const room = creep.room.name;
    const homeroom = creep.remember('homeroom');
    const workroom = creep.remember('workroom');

    creep.requestRoad(6);

    /**
      If charged and in Homeroom
      */
    if (creep.isCharged() && room == homeroom) {
      let recharge = creep.rechargeStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeContainers, rechargeStorage, resetWorkroom);
      // if (!recharge) require("role.upgrader").run(creep); // fallback as Upgrader
      if (!recharge) require("role.builder").run(creep); // fallback as Upgrader

    /**
      If out of charge and in Workroom
      */
    } else if (!creep.isCharged() && room == workroom) {
      if (creep.pickupDroplets(10)) return;
      const source = creep.getEnergy(useStorage, useContainers, useSources);

      // Reset Workroom is no Active Source found
      if (!source) creep.changeWorkroom();

    /**
      If charged but not yet in Homeroom
      */
    } else if (creep.isCharged() && room != homeroom) {
      let repair, build, recharge;
      repair = creep.repairStructure(2);
      if (!repair) build = creep.buildStructure();
      if (!repair && !build) {
        const exit = creep.room.findExitTo(homeroom);
        creep.moveTo(creep.pos.findClosestByPath(exit)); // TODO: optimize path
      }

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
