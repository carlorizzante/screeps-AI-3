module.exports = {

  run: creep => {

    if (creep.recycleAt(45)) return;

    /**
      Miners get nearby an extraction point and focus on mining,
      Resources being mined get dropped into a nearby container.
      */
    if (creep.isLocked(true, true) && creep.isCharged()) {

      const container = Game.getObjectById(creep.memory.locked_on_container_id);
      creep.transfer(container, RESOURCE_ENERGY);
    }

    if (creep.isLocked(true, true) && !creep.isCharged()) {
      const energySource = Game.getObjectById(creep.memory.locked_on_energy_source_id);
      creep.harvest(energySource);
    }

    /**
      Miners need to get close to an extraction point in order to lock on it
      !! Make sure to have a container at range as well
      TODO Optimize choice of Energy Source so that Miners won't overlap
      */
    if (!creep.isLocked(true, true)) {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
}
