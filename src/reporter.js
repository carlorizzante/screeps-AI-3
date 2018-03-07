// Basics
const WHITE   = '#FFFFFF';
const SILVER  = '#C0C0C0';
const GRAY    = '#808080';
const RED     = '#FF0000';
const MAROON  = '#800000';
const YELLOW  = '#FFFF00';
const OLIVE   = '#808000';
const LIME    = '#00FF00';
const GREEN   = '#008000';
const AQUA    = '#00FFFF';
const TEAL    = '#008080';
const BLUE    = '#0000FF';
const FUCHSIA = '#FF00FF';
const PURPLE  = '#800080';

// Alternate
const AQUAMARINE = '#3498DB';
const DARKPURPLE     = '#8E44AD';

// Margarita @link http://www.colourlovers.com/palette/4559326/Margarita
const SAYSHELLO   = '#FADD99';
const HAPPYORANGE = '#EB6D33';
const LIPERMODALU = '#0E848E';
const GREENPEPPER = '#97963A';
const COMEHOME    = '#F24269';

module.exports = {

  /**
    Effects: outputs in console a report of the current state of the rooms owned by the player
    */
  report: function() {

    const rooms = {}
    for (let key in Game.rooms) rooms[key] = Game.rooms[key];

    const creeps = {}
    for (let name in Game.creeps) creeps[name] = Game.creeps[name];

    const span = this.span;
    const spacer = console.log;
    const liner = function() {
      console.log(span(GREENPEPPER, '----------------------------------'));
    }

    // Test colors
    // console.log(span(SAYSHELLO, "Lorem ipsum"));
    // console.log(span(HAPPYORANGE, "Lorem ipsum"));
    // console.log(span(LIPERMODALU, "Lorem ipsum"));
    // console.log(span(GREENPEPPER, "Lorem ipsum"));
    // console.log(span(COMEHOME, "Lorem ipsum"));

    // TODO ASCII ART FOR Ry7 ?

    spacer();

    for (let key in rooms) {
      const room = rooms[key];

      const spawns = findSpawns(room);
      if (!spawns.length) continue;

      const controller = getController(room);
      let controllerStatus = "No controller";
      let RC, username;
      if (controller) {
        if (controller.owner) username = span(LIPERMODALU, controller.owner.username);
        RC = "RCL " + controller.level;
      }

      console.log(span(HAPPYORANGE, key), span(HAPPYORANGE, RC), span(SAYSHELLO, controller.owner.username));

      liner();

      let inStorage ;
      if (room.storage) inStorage = ', ' + room.storage.energy + ' in storage.';
      if (!room.storage) inStorage = span(GRAY, ', no storage.');

      let extensionsText;
      const extensions = findExtensions(room);
      if (extensions.length) extensionsText = extensions.length + ' Extension(s)';
      if (!extensions.length) extensionsText = span(GRAY, 'no Extension(s)');

      let containersText;
      const containers = findContainers(room);
      if (containers.length) containersText = containers.length + ' Container(s).';
      if (!containers.length) containersText = span(GRAY, 'no Container(s).');

      let towersText;
      const towers = findTowers(room);
      if (towers.length) towersText = towers.length + ' Tower(s) in the room.';
      if (!towers.length) towersText = span(GRAY, 'no Tower(s) in the room.');

      console.log(room.energyAvailable + " of " + room.energyCapacityAvailable + ' available' + inStorage);
      console.log(extensionsText + ', ' + containersText);
      console.log(towersText);
      // console.log(room.extractors.length + ' Extractor(s) ' + room.extractorContainers.length + ' with a Container');
    }

    liner();
    console.log(span(GRAY, Object.keys(rooms).length + ' Room(s) in sight.'));
    console.log(span(GRAY, Object.keys(creeps).length + ' Creep(s) alive.'));
    liner();
    spacer();
  },

  /**
    Returns styled HTML span tag
    @param string hex color
    @param string text message to be printed
    */
  span: function(hex, text) {
    return `<span style="color:${hex}">${text}</span>`;
  }
}

/**
  Returns Object Room controller
  @param Room room
  */
function getController(room) {
  return room.controller;
}

/**
  Returns Array of Object Structure Spawn
  @param Room room
  */
function findSpawns(room) {
  return room.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_SPAWN
  });
}

/**
  Returns Array of Object Structure Extension
  @param Room room
  */
function findExtensions(room) {
  return room.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_EXTENSION
  });
}

/**
  Returns Array of Object Structure Container
  @param Room room
  */
function findContainers(room) {
  return room.find(FIND_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_CONTAINER
  });
}

/**
  Returns Array of Object Structure Tower
  @param Room room
  */
function findTowers(room) {
  return room.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_TOWER
  });
}
