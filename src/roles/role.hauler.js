// Recharge everything but Containers
const rechargeSpawns     = true;
const rechargeExtensions = true;
const rechargeTowers     = true
const rechargeContainers = false;
const rechargeStorage    = true;

// Withdraw Energy exclusively from Containers
const useStorage         = false;
const useContainers      = true;
const useSources         = false;

module.exports = {
  run: creep => {
    "use strict";

    creep.requestRoad(4);

    if (creep.isCharged()) {
      const recharge = creep.rechargeStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeContainers, rechargeStorage);
    } else {
      if (creep.pickupDroplets(20)) return;
      creep.getEnergy(false, true, false);
    }
  }
}
