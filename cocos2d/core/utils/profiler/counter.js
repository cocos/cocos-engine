class Counter {
    constructor(id, opts, now) {
      this._id = id;
      this._opts = opts || {};
  
      this._value = 0;
      this._total = 0;
      this._averageValue = 0;
      this._accumValue = 0;
      this._accumSamples = 0;
      this._accumStart = now;
    }
  
    _average(v, now) {
      if (this._opts.average) {
        this._accumValue += v;
        ++this._accumSamples;
  
        let t = now;
        if (t - this._accumStart >= this._opts.average) {
          this._averageValue = this._accumValue / this._accumSamples;
          this._accumValue = 0;
          this._accumStart = t;
          this._accumSamples = 0;
        }
      }
    }
  
    get value() { return this._value; }
    set value(v) {
      this._value = v;
    }
  
    sample(now) {
      this._average(this._value, now);
    }
  
    human() {
      let v = this._opts.average ? this._averageValue : this._value;
      return Math.round(v * 100) / 100;
    }
  
    alarm() {
      return (
        (this._opts.below && this._value < this._opts.below) ||
        (this._opts.over && this._value > this._opts.over)
      );
    }
  }

  module.exports = Counter;
