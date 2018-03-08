// Recharge everything but Containers
const rechargeSpawns     = true;
const rechargeExtensions = true;
const rechargeTowers     = true
const rechargeStorage    = true;
const rechargeContainers = false;

// Withdraw Energy exclusively from Containers
const useStorage         = false;
const useContainers      = true;
const useSources         = false;

module.exports = {
  run: creep => {
    creep.requestRoad(2);

    if (creep.isCharged()) {
      const recharge = creep.rechargeStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeStorage, rechargeContainers);
    } else {
      if (creep.pickupDroplets(20)) return;
      creep.getEnergy(false, true, false);
    }
  }
}
