module.exports = {
  run: creep => {
    creep.requestRoad(4);

    const isLocked  = creep.isLocked();
    const isCharged = creep.isCharged();
    let result;

    // Override recycling defaults with a longer time frame - Miners are slow
    if (creep.recycleAt(75)) return; // TODO enqueue a new Miner

    /**
      Miners get nearby an extraction point and focus on mining,
      Resources being mined get dropped into a nearby container.
      */
    if (isLocked && !isCharged) {
      const energySource = Game.getObjectById(creep.remember('source_id'));
      result = creep.harvest(energySource);

    } else if (isLocked && isCharged) {
      const container = Game.getObjectById(creep.remember('container_id'));
      result = creep.transfer(container, RESOURCE_ENERGY);
    }

    // If source or container still not in range, reset and restart
    if (result === ERR_NOT_IN_RANGE) creep.forget('locked');

    /**
      Miners need to get close to an extraction point in order to lock on it
      !! Make sure to have a container at range as well
      TODO Optimize choice of Energy Source so that Miners won't overlap
      */
    if (!isLocked) {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
}
