module.exports = function(rooms) {

  // TODO ASCII ART FOR Ry7
  console.log(); // Give some space
  // console.log('<span style="color:rgba(52, 152, 219,1.0)">Ry7</span>');
  console.log("Running", Object.keys(rooms).length, "Room(s).");

  for (let key in rooms) {
    const room = rooms[key];

    const controller = getController(room);
    let controllerStatus = "No controller";
    let RCL, username;
    if (controller) {
      if (controller.owner) username = '<span style="color:rgba(52, 152, 219,1.0)">' + controller.owner.username + '</span>';
      controllerStatus = "Controller level " + controller.level + ", Owner " + username;
      RCL = "RCL " + controller.level;
    }

    console.log('<span style="color:rgba(142, 68, 173,1.0);">' + key + ' ' + RCL + '</span> ');
    console.log('<span style="color:rgba(142, 68, 173,1.0);">##################################################</span>');

    let inStorage = 0;
    if (room.storage) inStorage = room.storage.energy;
    console.log(room.energyAvailable, "of", room.energyCapacityAvailable, "available,", inStorage, "in storage.");
    // console.log('<span style="color:rgba(39, 174, 96,1.0);">Structures</span>');
    console.log(controllerStatus);
    console.log(findExtensions(room).length + ' Extensions(s),', findContainers(room).length, "Container(s).");
    console.log(findTowers(room).length + ' Tower(s) in the room.');
    // console.log(room.extractors.length + ' Extractor(s) ' + room.extractorContainers.length + ' with a Container');
  }
  console.log(); // Give some space
}

function getController(room) {
  return room.controller;
}

function findExtensions(room) {
  return room.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_EXTENSION
  });
}

function findContainers(room) {
  return room.find(FIND_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_CONTAINER
  });
}

function findTowers(room) {
  return room.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_TOWER
  });
}
