
// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Device = function Device(canvasEL) {
  var ctx;

  try {
    ctx = canvasEL.getContext('2d');
  } catch (err) {
    console.error(err);
    return;
  }

  // statics
  this._canvas = canvasEL;
  this._ctx = ctx;
  this._caps = {}; // capability
  this._stats = {
    drawcalls: 0,
  };

  // runtime
  this._vx = this._vy = this._vw = this._vh = 0;
  this._sx = this._sy = this._sw = this._sh = 0;
};

Device.prototype._restoreTexture = function _restoreTexture (unit) {
};

// ===============================
// Immediate Settings
// ===============================

/**
 * @method setViewport
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device.prototype.setViewport = function setViewport (x, y, w, h) {
  if (
    this._vx !== x ||
    this._vy !== y ||
    this._vw !== w ||
    this._vh !== h
  ) {
    this._vx = x;
    this._vy = y;
    this._vw = w;
    this._vh = h;
  }
};

/**
 * @method setScissor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device.prototype.setScissor = function setScissor (x, y, w, h) {
  if (
    this._sx !== x ||
    this._sy !== y ||
    this._sw !== w ||
    this._sh !== h
  ) {
    this._sx = x;
    this._sy = y;
    this._sw = w;
    this._sh = h;
  }
};

Device.prototype.clear = function clear (color) {
  var ctx = this._ctx;
  ctx.clearRect(this._vx, this._vy, this._vw, this._vh);
  if (color && (color[0] !== 0 || color[1] !== 0 || color[2] !== 0)) {
    ctx.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] +')';
    ctx.globalAlpha = color[3];
    ctx.fillRect(this._vx, this._vy, this._vw, this._vh);
  }
};

Device.prototype.resetDrawCalls = function () {
  this._stats.drawcalls = 0;
}

Device.prototype.getDrawCalls = function () {
  return this._stats.drawcalls;
}

module.exports = Device;
