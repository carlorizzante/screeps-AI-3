const expect = require('expect');

testing = true;            // global
VERBOSE = false;           // global

// storage = { id: 'st_id' };
// source = { id: 'so_id' };

describe('creep', () => {

  let creep = new Creep();
  let spy = [];

  const Spawn = { id: 'spawn_id' };
  const Extension = { id: 'extension_id' };
  const Tower = { id: 'tower_id' };
  const Container = { id: 'cointainer_id', store: {} };
  const Storage = { id: 'storage_id', store: {} };
  const Source = { id: 'source_id' };
  creep.room = { storage: Storage };

  Game.getObjectById = function(id) {
    spy.push(id);
    const data = {};
    data[Spawn.id] = Spawn;
    data[Extension.id] = Extension;
    data[Tower.id] = Tower;
    data[Storage.id] = Storage;
    data[Container.id] = Container;
    data[Source.id] = Source;
    return data[id];
  };

  const reset = () => {
    spy = []; // reset spy
    creep = new Creep(); // reset creep
    creep.carryCapacity = 200;
  }

  beforeEach(() => {
    reset();
    Creep.prototype.withdraw = () => { spy.push(OK); return OK; }
    Creep.prototype.harvest = () => { spy.push(OK); return OK; }
    Creep.prototype.moveTo = () => spy.push(MOVE);
  });

  describe('remember', () => {
    it('should setup a new property', () => {
      creep.remember('something', 'is blue');
      expect(creep.memory.something).toBe('is blue');
    });

    it('should remember a stored property', () => {
      creep.remember('something', 'is blue');
      expect(creep.remember('something')).toBe('is blue');
    });

    it('should change a stored property', () => {
      creep.remember('something', 'is blue');
      expect(creep.memory.something).toBe('is blue');
      creep.remember('something', 'else');
      expect(creep.memory.something).toBe('else');
    });

    it('should store null as proper value', () => {
      creep.remember('isNull', null);
      expect(creep.memory.isNull).toBe(null);
    });

    it('should store all strings as proper keys', () => {
      creep.remember('this is a string', 123);
      expect(creep.memory['this is a string']).toBe(123);
    });
  });

  describe('forget', () => {
    it('should forget a property', () => {
      creep.remember('something', 'there');
      expect(creep.memory.something).toBe('there');
      creep.forget('something');
      expect(creep.memory.something).toBe(undefined);
    });

    it('should forget a property, even if this did not previously exist', () => {
      creep.forget('whatever');
      expect(creep.memory.whatever).toBe(undefined);
    });
  });

  describe('validateValue', () => {
    it('should validate strings', () => {
      expect(creep.validateValue('some string')).toBe(true);
    });

    it('should validate numbers', () => {
      expect(creep.validateValue(123)).toBe(true);
    });

    it('should validate booleans', () => {
      expect(creep.validateValue(true)).toBe(true);
      expect(creep.validateValue(false)).toBe(true);
    });

    it('should validate arrays and objects', () => {
      expect(creep.validateValue([1,2,3])).toBe(true);
      expect(creep.validateValue({ a: 'a' })).toBe(true);
    });

    it('should not validate functions', () => {
      const fn = function() {}
      expect(creep.validateValue(fn)).toBe(false);
    });

    it('should not validate undefined', () => {
      expect(creep.validateValue(undefined)).toBe(false);
    });
  });

  describe('isCharged', () => {
    it('should set value to true if creep fully charged', () => {
      expect(creep.memory.charged).toBe(undefined);
      creep.carry.energy = 200;
      expect(creep.isCharged()).toBe(true);
      expect(creep.memory.charged).toBe(true);
    });

    it('should set value to false if creep completely out of charge', () => {
      expect(creep.memory.charged).toBe(undefined);
      creep.carry.energy = 200;
      expect(creep.isCharged()).toBe(true);
      expect(creep.memory.charged).toBe(true);
      creep.carry.energy = 0;
      expect(creep.isCharged()).toBe(false);
      expect(creep.memory.charged).toBe(false);
    });

    it('should not change state in any other circumstance', () => {
      creep.carry.energy = 120;
      creep.memory.charged = true;
      expect(creep.isCharged()).toBe(true);
      expect(creep.memory.charged).toBe(true);
      creep.carry.energy = 78;
      creep.memory.charged = false;
      expect(creep.isCharged()).toBe(false);
      expect(creep.memory.charged).toBe(false);
    });
  });

  describe('isLocked', () => {
    const none = [];
    const energy_sources = [
      { id: 'source_id_123' },
      { id: 'source_id_456' }
    ];
    const containers = [
      { id: 'container_id_235' },
      { id: 'container_id_986' }
    ];

    it('should return true if status already locked', () => {
      creep.memory.locked = true;
      creep.memory.source_id = true;
      creep.memory.container_id = true;
      expect(creep.isLocked()).toBe(true);
      expect(spy).toEqual(none);
    });

    it('should return undefined if no conditions met', () => {
      creep.pos = {
        findInRange: function(find) {
          spy.push(find)
          return none;
        }
      }
      expect(creep.isLocked()).toBe(undefined);
      expect(spy).toEqual([FIND_SOURCES, FIND_STRUCTURES]);
      expect(creep.memory.locked).toBe(undefined);
      expect(creep.memory.source_id).toBe(undefined);
      expect(creep.memory.container_id).toBe(undefined);
    });

    it('should return undefined if no Energy source in range', () => {
      creep.pos = {
        findInRange: function(find) {
          spy.push(find)
          if (find == FIND_SOURCES) return none;
          if (find == FIND_STRUCTURES) return containers;
        }
      }
      expect(creep.isLocked()).toBe(undefined);
      expect(spy).toEqual([FIND_SOURCES, FIND_STRUCTURES]);
      expect(creep.memory.locked).toBe(undefined);
      expect(creep.memory.source_id).toBe(undefined);
      expect(creep.memory.container_id).toBe(undefined);
    });

    it('should return undefined if no Container in range', () => {
      creep.pos = {
        findInRange: function(find) {
          spy.push(find);
          if (find == FIND_SOURCES) return energy_sources;
          if (find == FIND_STRUCTURES) return none;
        }
      }
      expect(creep.isLocked()).toBe(undefined);
      expect(spy).toEqual([FIND_SOURCES, FIND_STRUCTURES]);
      expect(creep.memory.locked).toBe(undefined);
      expect(creep.memory.source_id).toBe(undefined);
      expect(creep.memory.container_id).toBe(undefined);
    });

    it('should return true if condition finally met', () => {
      creep.pos = {
        findInRange: function(find) {
          spy.push(find);
          if (find == FIND_SOURCES) return energy_sources;
          if (find == FIND_STRUCTURES) return containers;
        }
      }
      expect(creep.isLocked()).toBe(true);
      expect(creep.memory.locked).toBe(true);
      expect(creep.memory.source_id).toBe(energy_sources[0].id);
      expect(creep.memory.container_id).toBe(containers[0].id);
      expect(spy).toEqual([FIND_SOURCES, FIND_STRUCTURES]);
    });
  });

  describe('getEnergy', () => {

    it('should remember and prioritize a memorized Storage', () => {
      Storage.store[RESOURCE_ENERGY] = 1000;

      creep.remember('storage_id', Storage.id);
      expect(creep.getEnergy(true)).toEqual(Storage);
      expect(spy).toEqual([Storage.id, OK]);
      reset();

      creep.remember('storage_id', Storage.id);
      expect(creep.getEnergy(true, true)).toEqual(Storage);
      expect(spy).toEqual([Storage.id, OK]);
      reset();

      creep.remember('storage_id', Storage.id);
      expect(creep.getEnergy(true, false, true)).toEqual(Storage);
      expect(spy).toEqual([Storage.id, OK]);
      reset();

      creep.remember('storage_id', Storage.id);
      expect(creep.getEnergy(true, true, true)).toEqual(Storage);
      expect(spy).toEqual([Storage.id, OK]);
    });

    it('should remember and prioritize a memorized Container', () => {
      Container.store[RESOURCE_ENERGY] = 1000;

      creep.remember('storage_id', Container.id);
      expect(creep.getEnergy(true, true)).toEqual(Container);
      expect(spy).toEqual([Container.id, OK]);
      reset();

      creep.remember('storage_id', Container.id);
      expect(creep.getEnergy(false, true)).toEqual(Container);
      expect(spy).toEqual([Container.id, OK]);
      reset();

      creep.remember('storage_id', Container.id);
      expect(creep.getEnergy(false, true, true)).toEqual(Container);
      expect(spy).toEqual([Container.id, OK]);
      reset();

      creep.remember('storage_id', Container.id);
      expect(creep.getEnergy(true, true, true)).toEqual(Container);
      expect(spy).toEqual([Container.id, OK]);
    });

    it('should remember a memorized Energy Source, if no Storage or Containers available', () => {
      creep.pos.findClosestByPath = function(arg) { spy.push(arg); return null; }
      creep.room = { storage: null }; // Storage not available
      Source.energy = 1000;           // Energy Source available

      creep.remember('source_id', Source.id);
      expect(creep.getEnergy(false, false, true)).toEqual(Source);
      expect(spy).toEqual([Source.id, OK]);
      reset();

      creep.remember('source_id', Source.id);
      creep.pos.findClosestByPath = function(arg) { spy.push(arg); return null; }
      expect(creep.getEnergy(false, true, true)).toEqual(Source);
      expect(spy).toEqual([FIND_STRUCTURES, Source.id, OK]);
      reset();

      creep.remember('source_id', Source.id);
      expect(creep.getEnergy(true, false, true)).toEqual(Source);
      expect(spy).toEqual([Source.id, OK]);
      reset();

      creep.remember('source_id', Source.id);
      creep.pos.findClosestByPath = function(arg) { spy.push(arg); return null; }
      expect(creep.getEnergy(true, true, true)).toEqual(Source);
      expect(spy).toEqual([FIND_STRUCTURES, Source.id, OK]);
    });

    it('should remember and prioritize a memorized Energy Source, but prioritize Storage if available', () => {
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return null; }
      Source.energy = 1500;
      Storage.store = { energy: 1000 };
      creep.room.storage = Storage;

      creep.remember('source_id', Source.id);
      expect(creep.getEnergy(true, false, true)).toEqual(Storage);
      expect(spy).toEqual([OK]);
      reset();

      creep.remember('source_id', Source.id);
      creep.room.storage = Storage;
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return null; }
      expect(creep.getEnergy(true, true, true)).toEqual(Storage);
      expect(spy).toEqual([OK]);
    });

    it('should remember a memorized Energy Source, but prioritize a nearby Container if available', () => {
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      Source.energy = 1000;
      Storage.store = { energy: 0 };

      creep.remember('source_id', Source.id);
      expect(creep.getEnergy(false, true, true)).toEqual(Container);
      expect(spy).toEqual([FIND_STRUCTURES, OK]);
      reset();

      creep.remember('source_id', Source.id);
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      expect(creep.getEnergy(true, true, true)).toEqual(Container);
      expect(spy).toEqual([FIND_STRUCTURES, OK]);
    });

    it('should prioritize and store Storage if available', () => {
      Storage.store = { energy: 1000 };
      creep.room.storage = Storage;

      expect(creep.getEnergy(true, false, false)).toBe(creep.room.storage);
      expect(creep.memory.storage_id).toBe(Storage.id);
      expect(spy).toEqual([OK]);
      reset();

      creep.room.storage = Storage;
      expect(creep.getEnergy(true, true, false)).toBe(creep.room.storage);
      expect(creep.memory.storage_id).toBe(Storage.id);
      expect(spy).toEqual([OK]);
      reset();

      creep.room.storage = Storage;
      expect(creep.getEnergy(true, true, true)).toBe(creep.room.storage);
      expect(creep.memory.storage_id).toBe(Storage.id);
      expect(spy).toEqual([OK]);
    });

    it('should prioritize and store nearby Containers if available', () => {
      Storage.store.energy = null;
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }

      expect(creep.getEnergy(false, true, true)).toBe(Container);
      expect(creep.memory.storage_id).toBe(Container.id);
      expect(spy).toEqual([FIND_STRUCTURES, OK]);
      reset();

      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      expect(creep.getEnergy(true, true, true)).toBe(Container);
      expect(creep.memory.storage_id).toBe(Container.id);
      expect(spy).toEqual([FIND_STRUCTURES, OK]);
      reset();

      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      expect(creep.getEnergy(true, true, false)).toBe(Container);
      expect(creep.memory.storage_id).toBe(Container.id);
      expect(spy).toEqual([FIND_STRUCTURES, OK]);
    });

    it('should find and store nearby active Energy Source', () => {
      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }

      Storage.store.energy = 1000;
      Container.store.energy = 1000;

      expect(creep.getEnergy(false, false, true)).toBe(Source);
      expect(creep.memory.source_id).toBe(Source.id);
      expect(spy).toEqual([FIND_SOURCES_ACTIVE, OK]);
      reset();

      Storage.store.energy = null;
      Container.store.energy = null;

      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }
      expect(creep.getEnergy(false, true, true)).toBe(Source);
      expect(creep.memory.source_id).toBe(Source.id);
      expect(spy).toEqual([FIND_STRUCTURES, FIND_SOURCES_ACTIVE, OK]);
      reset();

      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }
      expect(creep.getEnergy(true, true, true)).toBe(Source);
      expect(creep.memory.source_id).toBe(Source.id);
      expect(spy).toEqual([FIND_STRUCTURES, FIND_SOURCES_ACTIVE, OK]); reset();

      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }
      expect(creep.getEnergy(true, false, true)).toBe(Source);
      expect(creep.memory.source_id).toBe(Source.id);
      expect(spy).toEqual([FIND_SOURCES_ACTIVE, OK]);
    });

    it('should move toward Storage if not in range', () => {
      creep.withdraw = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      Storage.store = { energy: 1000 };
      creep.room.storage = Storage;

      expect(creep.getEnergy(true, false, false)).toBe(Storage);
      expect(spy).toEqual([ERR_NOT_IN_RANGE, MOVE]);
      reset();

      creep.room.storage = Storage;
      creep.withdraw = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      expect(creep.getEnergy(true, true, false)).toBe(Storage);
      expect(spy).toEqual([ERR_NOT_IN_RANGE, MOVE]);
      reset();

      creep.room.storage = Storage;
      creep.withdraw = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      expect(creep.getEnergy(true, true, true)).toBe(Storage);
      expect(spy).toEqual([ERR_NOT_IN_RANGE, MOVE]);
    });

    it('should move toward Container if not in range', () => {
      creep.withdraw = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      creep.moveTo = () => spy.push(MOVE);
      Storage.store = { energy: 1000 };

      expect(creep.getEnergy(false, true, false)).toBe(Container);
      expect(spy).toEqual([FIND_STRUCTURES, ERR_NOT_IN_RANGE, MOVE]);
      reset();

      creep.withdraw = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      expect(creep.getEnergy(false, true, true)).toBe(Container);
      expect(spy).toEqual([FIND_STRUCTURES, ERR_NOT_IN_RANGE, MOVE]);
      reset();

      Storage.store.energy = 0;
      creep.room.storage = Storage;
      creep.withdraw = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      creep.pos.findClosestByPath = (arg) => { spy.push(arg); return Container; }
      expect(creep.getEnergy(false, true, true)).toBe(Container);
      expect(spy).toEqual([FIND_STRUCTURES, ERR_NOT_IN_RANGE, MOVE]);
    });

    it('should move toward Energy Source if not in range', () => {
      creep.harvest = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }
      Storage.store = { energy: 1000 };
      Container.store.energy = 1000;

      expect(creep.getEnergy(false, false, true)).toBe(Source);
      expect(spy).toEqual([FIND_SOURCES_ACTIVE, ERR_NOT_IN_RANGE, MOVE]);
      reset();

      Container.store.energy = 0;
      creep.harvest = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }
      expect(creep.getEnergy(false, true, true)).toBe(Source);
      expect(spy).toEqual([FIND_STRUCTURES, FIND_SOURCES_ACTIVE, ERR_NOT_IN_RANGE, MOVE]);
      reset();

      Storage.store.energy = 0;
      Container.store.energy = 0;
      creep.harvest = () => { spy.push(ERR_NOT_IN_RANGE); return ERR_NOT_IN_RANGE; }
      creep.pos.findClosestByPath = (arg) => {
        spy.push(arg);
        if (arg == FIND_STRUCTURES) return null;
        if (arg == FIND_SOURCES_ACTIVE) return Source;
      }
      expect(creep.getEnergy(false, true, true)).toBe(Source);
      expect(spy).toEqual([FIND_STRUCTURES, FIND_SOURCES_ACTIVE, ERR_NOT_IN_RANGE, MOVE]);
    });
  });

  describe('findStructure', () => {

    it('should remember a stored structure, and structure id', () => {
    });

    it('should prioritize Spawns, Extensions, and Towers, over Container and Storage', () => {
    });
  });
});
