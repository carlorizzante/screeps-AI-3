Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "harvester-" + Game.time, {
  memory: { role: "harvester" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "upgrader-" + Game.time, {
  memory: { role: "upgrader" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "builder600-" + Game.time, {
  memory: { role: "builder" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "builder600-" + Game.time, {
  memory: { role: "longBuilder", home: "W8N3", target: "W8N3" }
});

Game.spawns["Spawn1"].spawnCreep([
  TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
  MOVE, MOVE, MOVE, MOVE,
  ATTACK, ATTACK,
  RANGED_ATTACK, RANGED_ATTACK,
  HEAL
], "defender1200-" + Game.time, {
  memory: { role: "defender", home: "W8N3", target: "W8N3" }
});

Game.spawns["Spawn1"].spawnCreep([CLAIM, CLAIM, MOVE, MOVE], "claimer1400-" + Game.time, {
  memory: { role: "claimer", homeroom: '', workroom: '' }
});

// in prototype.spawn.js

// Verify that property todo exists in Memory
if (!Memory.todo) Memory.todo = {}

// Listen for incoming requests
for (let request in Memory.requests) {

  // for in returns property names
  r = Memory.requests[request];

  // No need to rework on an already taken request
  if (r.status != "incoming") continue;

  // Set current request as pending
  r.status = "pending";

  // Collect all similar requests into an unique task, by ID
  let entry_id = r.type + " in room " + r.location;

  // Do not override already registered tasks in todo
  if (Memory.todo[entry_id]) continue;

  // Add entry in todo for later execution
  Memory.todo[entry_id] = {
    priority: r.priority,
    type: r.type,
    location: r.location,
    status: r.status,
    count: 0 // To Do, evaluate urgency and relevance
  }
}

// Execute tasks
// TO DO: sort tasks by priority
for (let task in Memory.todo) {

  // console.log("Evaluating task:", task);

  let t = Memory.todo[task];

  // Ignore already fulfilled tasks
  if (t.status == "fulfilled") continue;

  switch (t.type) {
    case "military support":
      // console.log("Responding to Mililtary Support Request");
      this.spawnCreepTier3(DEFENDER, this.room.name, t.location);
      t.status = "fulfilled";
      break;

    default:
      // nothing here
  }
}

// in prototype.creep.js

// If absent, create property in Memory
if (!Memory.requests) Memory.requests = {};

// Do not override already sent requests
if (!Memory.requests[this.name]) {

  // Create request
  const request = {
    priority: 10,
    type: "military support",
    location: this.room.name,
    status: "incoming",
    time: Game.time
  }

  // Send request to core
  Memory.requests[this.name] = request;
}
