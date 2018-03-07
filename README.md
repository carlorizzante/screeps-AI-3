# Screeps!
Release 3.4.1 - Codename Limiting Factor

AI for Screeps, version 3, completed of Grunt file and tasks for stand alone / private server play.

## Grunt
Grunt can copy all files directly into the "default" folder of the game. In order to do so, you need to update one line in the Gruntfile.js file.

First find where the "default" folder is on your system. In game, on the panel Script, you should find on the bottom of it a link "Open local folder".

Click on it and copy the location of the "default" folder.

Paste it into Gruntfile.js as "dest" property, line 9.

Launch the Watch task to validate your Javascript, and the Update task to update all files into the "default" folder of the game. That's all.

## Features

## Flaws

## Units

### Builders
Builders repair and build structures, alternatively can recharge structures like Extensions and Towers, and finally, if none of the above is necessary, they switch into Upgrader mode.

### Harvesters
Harvesters quite sophisticated behaviour, 1. harvest energy from Energy Sources, recharge Spawns, Extensions, Storage and Containers, help with constructions if no recharging job is needed, and finally can even switch into Upgrader mode if none of the above is required.

### Upgraders
Upgraders take care exclusively of upgrading the Room Controller.

## Towers

## Future improvements
