# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.9.0] 2018-03-09
### Added
- src/timers.js, collection of utilities to track times in ticks
- test/setup.test.js, initial setup due to prototypal inheritance
- test/timers.test.js, testing for the timers module
- Gruntfile.js, added Mocha for testing

### Changed
- src/all, generally added 'use strict' at function level

## [3.8.0] 2018-03-08
### Added
- src/proto/prototype.creep.js, fatigue() method now evaluate true if fatigue >= threshold
- src/proto/prototype.spawn.js, Spawns can now spawn Heroes
- src/roles/role.harvester.js, Harvesters can now request roads if fatigue >= 6
- src/roles/role.hero.js, Heroes added to the pool of available units

## [3.7.0] 2018-03-08
### Added
- src/roles/role.hauler.js, added Haulers to the pool of available Creeps

### Changed
- src/proto/prototype.creep.js, refactored pickupDroplets() method
                                refactored isLocked() method
- src/proto/prototype.spawn.js, Spawns can now spawn Haulers
- src/roles/role.builder.js, Builders can now pickup dropped Energy units
- src/roles/role.harvester.js, Harvesters can now pickup dropped Energy units
- src/roles/role.miner.js, bug fix
- src/roles/role.upgrader.js, Upgraders can now pickup dropped Energy units

### Edited
- README.md, Added Haulers and Heroes description.

## [3.6.0] 2018-03-08
### Added
- src/prototype.creep.js, added pickupDroplets() method, all Creeps can now pickup dropped resources
                          added isLocked() method, used by Miners to lock on to an Energy Source
- src/prototype.spawn.js, Spawns can now spawn Miners
- src/roles/role.miner.js, added Miners to the pool of available/functional Creeps
- src/config.js, added rules for Haulers and Miners

### Edited
- README.md, added Miners to list of Units

## [3.4.1] 2018-03-07
### Added
- src/proto/prototype.creep.js, remember() and forget() methods for Creeps' memory management

## [3.4.0] 2018-03-07
### Added
- src/proto/prototype.tower.js, first iteration on Towers' logic

### Changed
- src/proto/prototype.spawn.js, colorized feedback in console
- src/config.js, added repair_threshold(), wall_repair_threshold() and rampart_repair_threshold() methods
- src/main.js, Room objects are now handled by reporter.js
- src/reporter.js, refactoring and improvements
- package.js, added a bit more info about the project
- README.js, better docs about using Grunt within the current project

## [3.3.0] 2018-03-07
### Changed
- src/proto/prototype.creep.js, Creeps can now store and use target Structure and Source in Memory
- src/proto/prototype.spawn.js, roles pulled from config.js
- src/roles/role.builder.js, Builders can also recharge Spawns and Extensions if needed
- src/roles/role.harvester.js, Harvesters can now help with the building of Structures/Roads
- src/reporter.js, stylistic improvements
- README.md, additional content about Tier 1 Creeps

## [3.2.0] 2018-03-06
### Added
- src/reporter.js, basic reporting, to be expanded

### Changed
- src/proto/prototype.creep.js, added changeWorkroom() method
                                refactored findStructure() method, includes now Containers
- src/proto/prototype.spawn.js, improved spawnCustomCreep() method
- src/roles/role.builder.js, bug fix
- src/roles/role.harvester.js, implemented changeWorkroom() for Harvesters
                               Harvesters use extra energy for building Structures
- src/main.js, implements Reporter every 50 ticks

## [3.1.0] 2018-03-06
### Added
- src/proto/prototype.creep.js, basic functionalities
- src/proto/prototype.spawn.js, basic functionalities
- src/proto/prototype.tower.js (empty)
- src/roles/role.builder.js, basic functionalities
- src/roles/role.harvester.js, basic functionalities
- src/roles/role.upgrader.js, basic functionalities
- src/config.js, basic functionalities

### Changed
- src/main.js, runs logic for Spawns and Creeps

## [3.0.0] 2018-03-05
### Initial commit
- src/main.js (empty)
- .gitignore
- CHANGELOG.md
- package.json
- README.md
- TODO.md
