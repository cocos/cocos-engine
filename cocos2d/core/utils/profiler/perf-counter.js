const Counter = require('./counter');

let PerfCounter = cc.Class({
  name: 'cc.PerfCounter',
  extends: Counter,
  
  ctor (id, opts, now) {
    // DISABLE
    // this._idstart = `${id}_start`;
    // this._idend = `${id}_end`;

    this._time = now;
  },

  start(now) {
    this._time = now;

    // DISABLE: long time running will cause performance drop down
    // window.performance.mark(this._idstart);
  },

  end(now) {
    this._value = now - this._time;

    // DISABLE: long time running will cause performance drop down
    // window.performance.mark(this._idend);
    // window.performance.measure(this._id, this._idstart, this._idend);

    this._average(this._value);
  },

  tick() {
    this.end();
    this.start();
  },

  frame(now) {
    let t = now;
    let e = t - this._time;
    this._total++;
    let avg = this._opts.average || 1000;

    if (e > avg) {
      this._value = this._total * 1000 / e;
      this._total = 0;
      this._time = t;
      this._average(this._value);
    }
  }
});

module.exports = PerfCounter;
