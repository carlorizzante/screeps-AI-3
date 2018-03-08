const expect = require('expect');
const everyNTicks = require('../src/timers').everyNTicks;
const timer = require('../src/timers').timer;

describe('Timers', () => {

  beforeEach(() => {
    global.Creep.memory = {}
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

    it('should return true if Creep.memory.time not divible by n', () => {
      Creep.ticksToLive = (5 * 4) + 1;
      expect(everyNTicks.call(Creep, 5)).toEqual(false);
    });

    it('should return true if Creep.memory.time divible by n', () => {
      Creep.ticksToLive = (8 * 7);
      expect(everyNTicks.call(Creep, 8)).toEqual(true);
    });
  });

  describe('timer', () => {
    it('should start with n ticks', () => {
      const t = 10;
      timer.call(Creep, t);
      expect(Creep.memory.timer).toBe(t);
    });

    it('should count down tick by tick', () => {
      const t = 90;
      timer.call(Creep, t);
      for (let i = 0; i < 15; i++) timer.call(Creep, 10);
      expect(Creep.memory.timer).toBe(t - 15);
    });

    it('should return false if not done', () => {
      const t = 144;
      timer.call(Creep, t);
      expect(timer.call(Creep, t)).toBe(false);
    });

    it('should return true when done', () => {
      const t = 17;
      timer.call(Creep, t);
      for (let i = 0; i < t; i++) timer.call(Creep, t);
      expect(timer.call(Creep, t)).toBe(true);
    });

    it('should restart the timer once donewhen repeat true', () => {
      const t = 17;
      const diff = 5;
      const repeat = true
      timer.call(Creep, t, repeat);
      for (let i = 0; i < t + diff; i++) timer.call(Creep, t, repeat);
      expect(timer.call(Creep, t, repeat)).toBe(false);
      expect(Creep.memory.timer).toBe(t - diff);
    });

    it('should not restart the timer once done when repeat false', () => {
      const t = 17;
      const diff = 5;
      timer.call(Creep, t);
      for (let i = 0; i < t + diff; i++) timer.call(Creep, t);
      expect(timer.call(Creep, t)).toBe(true);
      expect(Creep.memory.timer).toBe(0)
    });
  });
});
