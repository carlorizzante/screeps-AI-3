# Screeps!
Release 3.10.0 - Codename Limiting Factor

AI for Screeps, version 3, completed of Grunt file and tasks for stand alone / private server play.

## Note
Project is on hold due to a new rewriting of the entire codebase in order to implement states, room objects, and a more centralized AI.

## Grunt
Grunt can copy all files directly into the "default" folder of the game. In order to do so, you need to update one line in the Gruntfile.js file.

First find where the "default" folder is on your system. In game, on the panel Script, you should find on the bottom of it a link "Open local folder".

Click on it and copy the location of the "default" folder.

Paste it into Gruntfile.js as "dest" property, line 9.

Launch the Watch task to validate your Javascript, and the Update task to update all files into the "default" folder of the game. That's all.

## Features

## Flaws

## Units Tier 1
Creeps in Tier 1 are somehow exchangeable, they are all composed with the same ration of body parts, WORK:CARRY:MOVE, there in principle they can be interchangeable and if required can cover multiple roles.

Some Units in Tier 1 are also able to span multiple rooms.

### Builders
Builders repair and build structures, alternatively can recharge structures like Extensions and Towers, and finally, if none of the above is necessary, they switch into Upgrader mode.

### Harvesters
Harvesters quite sophisticated behaviour, 1. harvest energy from Energy Sources, recharge Spawns, Extensions, Storage and Containers, help with constructions if no recharging job is needed, and finally can even switch into Upgrader mode if none of the above is required.

### Upgraders
Upgraders take care exclusively of upgrading the Room Controller.

## Units Tier 2
Creeps in Tier 2 are more specialized. Haulers and Miners work in synergy. Heroes are the what brings additional resources to the Home room.

### Miners
Miners are all about extraction, optimized to extract 3000 unit of Energy right before the regeneration of the Energy Source. In order to do so, they lock on an Energy Source for the entire duration of their life.

### Haulers
Haulers take care of carrying Energy from Containers nearby Miners, to Spawns, Extensions, and finally Storage. Haulers recharge Towers as well. They do not have any WORK part.

### Heroes
Heroes are primarily engaged in extracting Energy from nearby rooms. They have more CARRY and MOVE parts than WORK ones, still they are self sufficient able to lay down roads automatically in order to speed up their travel time.

## Tier 3
Tactical Units, defensive/reactive warfare.

### Claimer
Claimers do claim Controllers in new room.

## Tier 4
Strategic Units, grand operations.

## Towers

## Future improvements
