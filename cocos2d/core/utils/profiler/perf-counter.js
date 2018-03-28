const Counter = require('./counter');

class PerfCounter extends Counter {
  constructor(id, opts) {
    super(id, opts);

    // DISABLE
    // this._idstart = `${id}_start`;
    // this._idend = `${id}_end`;

    this._time = window.performance.now();
  }

  start() {
    this._time = window.performance.now();

    // DISABLE: long time running will cause performance drop down
    // window.performance.mark(this._idstart);
  }

  end() {
    this._value = window.performance.now() - this._time;

    // DISABLE: long time running will cause performance drop down
    // window.performance.mark(this._idend);
    // window.performance.measure(this._id, this._idstart, this._idend);

    this._average(this._value);
  }

  tick() {
    this.end();
    this.start();
  }

  frame() {
    let t = window.performance.now();
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
}

module.exports = PerfCounter;
