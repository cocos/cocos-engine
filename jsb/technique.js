let config = renderer.config;

let _genID = 0;

class Technique {
  /**
   * @param {Array} stages
   * @param {Array} parameters
   * @param {Array} passes
   * @param {Number} layer
   */
  constructor(stages, parameters, passes, layer = 0) {
    this._id = _genID++;
    this._stageIDs = config.stageIDs(stages);
    this.stageIDs = this._stageIDs;
    this._parameters = parameters; // {name, type, size, val}
    this._passes = passes;
    this.passes = this._passes;
    this._layer = layer;
    this._stages = stages;
    // TODO: this._version = 'webgl' or 'webgl2' // ????

    this._nativeObj = new renderer.TechniqueNative(stages, parameters, passes, layer);

  }

  setStages(stages) {
    this._stageIDs = config.stageIDs(stages);
    this._stages = stages;

    this._nativeObj.setStages(stages);
  }

  // get passes() {
  //   return this._passes;
  // }

  // get stageIDs() {
  //   return this._stageIDs;
  // }
}

module.exports = Technique;