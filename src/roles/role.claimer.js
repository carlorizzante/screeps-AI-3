/**
  Perform actions related to claming a foreign claimController
  */
Creep.prototype.goClaimController = function() {
  if (this.room.controller) {
    if (this.claimController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
}

module.exports = {
  run: creep => {

    if (creep.room.name == creep.memory.workroom) {
      creep.goClaimController();

    } else {
      const exit = creep.room.findExitTo(creep.memory.workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));
    }
  }
}
