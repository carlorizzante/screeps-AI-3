# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/).

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
