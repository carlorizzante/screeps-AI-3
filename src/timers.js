const span = require('./reporter').span;
const AQUAMARINE = '#3498DB';

module.exports = {

  /**
    A simple time-check based on a Creep's life or on the Game time
    @param int ticks, period of time to wait for before returning true
    @return Boolean
    */
  everyNTicks: function(ticks) {
    let time;
    if (this.ticksToLive) {
      time = this.ticksToLive;
    } else {
      time = Game.time;
    }
    return time % ticks == 0;
  },

  /**
    A simple timer, returns true after n ticks, false before that
    @param int ticks, period of time to wait for
    @param Boolean repeat optional, if true timer will be reset and restarted once done
    @return Boolean, true if timer's off, false otherwise
    */
  timer: function(ticks, repeat) {
    if (typeof ticks != 'number' || ticks <= 0) throw Error("ticks has to be an number > 0.");
    let timer = this.remember('timer');
    if (timer === undefined) {
      this.remember('timer', ticks);
      if (VERBOSE) console.log(span(AQUAMARINE, 'Timer off in ' + ticks + ' ticks.'));
    } else if (timer <= 0) {
      if (repeat) {
        this.remember('timer', ticks);
      }
      return true;
    } else {
      this.remember('timer', timer - 1);
    }
    return false;
  }
}
