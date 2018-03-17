const expect = require('expect');
const everyNTicks = require('../src/timers').everyNTicks;
const timer = require('../src/timers').timer;

describe('Timers', () => {

  let  creep = new Creep();

  beforeEach(() => {
    creep.memory = {}
  });

  describe('everyNTicks', () => {

    it('should return false if Game.time not divible by n', () => {
      Game.time = (3 * 4) + 1;
      expect(everyNTicks(3)).toEqual(false);
    });

    it('should return true if Game.time divible by n', () => {
      Game.time = (17 * 2);
      expect(everyNTicks(17)).toEqual(true);
    });

    it('should return true if creep.memory.time not divible by n', () => {
      creep.ticksToLive = (5 * 4) + 1;
      expect(everyNTicks.call(creep, 5)).toEqual(false);
    });

    it('should return true if creep.memory.time divible by n', () => {
      creep.ticksToLive = (8 * 7);
      expect(everyNTicks.call(creep, 8)).toEqual(true);
    });
  });

  describe('timer', () => {
    it('should start with n ticks', () => {
      const t = 10;
      timer.call(creep, t);
      expect(creep.memory.timer).toBe(t);
    });

    it('should count down tick by tick', () => {
      const t = 90;
      timer.call(creep, t);
      for (let i = 0; i < 15; i++) timer.call(creep, 10);
      expect(creep.memory.timer).toBe(t - 15);
    });

    it('should return false if not done', () => {
      const t = 144;
      timer.call(creep, t);
      expect(timer.call(creep, t)).toBe(false);
    });

    it('should return true when done', () => {
      const t = 17;
      timer.call(creep, t);
      for (let i = 0; i < t; i++) timer.call(creep, t);
      expect(timer.call(creep, t)).toBe(true);
    });

    it('should restart the timer once donewhen repeat true', () => {
      const t = 17;
      const diff = 5;
      const repeat = true
      timer.call(creep, t, repeat);
      for (let i = 0; i < t + diff; i++) timer.call(creep, t, repeat);
      expect(timer.call(creep, t, repeat)).toBe(false);
      expect(creep.memory.timer).toBe(t - diff);
    });

    it('should not restart the timer once done when repeat false', () => {
      const t = 17;
      const diff = 5;
      timer.call(creep, t);
      for (let i = 0; i < t + diff; i++) timer.call(creep, t);
      expect(timer.call(creep, t)).toBe(true);
      expect(creep.memory.timer).toBe(0)
    });
  });
});
