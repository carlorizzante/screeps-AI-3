# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.4.1] UNRELEASED
### Added
- src/proto/prototype.creep.js, remember() and forget() methods for Creeps' memory management

## [3.4.0] - 2018-03-07
### Added
- src/proto/prototype.tower.js, first iteration on Towers' logic

### Changed
- src/proto/prototype.spawn.js, colorized feedback in console
- src/config.js, added repair_threshold(), wall_repair_threshold() and rampart_repair_threshold() methods
- src/main.js, Room objects are now handled by reporter.js
- src/reporter.js, refactoring and improvements
- package.js, added a bit more info about the project
- README.js, better docs about using Grunt within the current project

## [3.3.0] - 2018-03-07
### Changed
- src/proto/prototype.creep.js, Creeps can now store and use target Structure and Source in Memory
- src/proto/prototype.spawn.js, roles pulled from config.js
- src/roles/role.builder.js, Builders can also recharge Spawns and Extensions if needed
- src/roles/role.harvester.js, Harvesters can now help with the building of Structures/Roads
- src/reporter.js, stylistic improvements
- README.md, additional content about Tier 1 Creeps

## [3.2.0] - 2018-03-06
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

## [3.1.0] - 2018-03-06
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

## [3.0.0] - 2018-03-05
### Initial commit
- src/main.js (empty)
- .gitignore
- CHANGELOG.md
- package.json
- README.md
- TODO.md
