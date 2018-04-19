class Model {
  constructor() {
    this._poolID = -1;
    this._node = null;
    this._inputAssemblers = [];
    this._effects = [];
    this._defines = [];
    this._dynamicIA = false;
    this._viewID = -1;

    // TODO: we calculate aabb based on vertices
    // this._aabb
  }

  get inputAssemblerCount() {
    return this._inputAssemblers.length;
  }

  get dynamicIA() {
    return this._dynamicIA;
  }

  get drawItemCount() {
    return this._dynamicIA ? 1 : this._inputAssemblers.length;
  }

  setNode(node) {
    this._node = node;
  }

  setDynamicIA(enabled) {
    this._dynamicIA = enabled;
  }

  addInputAssembler(ia) {
    if (this._inputAssemblers.indexOf(ia) !== -1) {
      return;
    }
    this._inputAssemblers.push(ia);
  }

  clearInputAssemblers() {
    this._inputAssemblers.length = 0;
  }

  addEffect(effect) {
    if (this._effects.indexOf(effect) !== -1) {
      return;
    }
    this._effects.push(effect);

    //
    // let defs = Object.create(null);
    // effect.extractDefines(defs);
    // this._defines.push(defs);
  }

  clearEffects() {
    this._effects.length = 0;
    this._defines.length = 0;
  }

  extractDrawItem(out, index) {
    if (this._dynamicIA) {
      out.model = this;
      out.node = this._node;
      out.ia = null;
      out.effect = this._effects[0];
      out.defines = out.effect.extractDefines(this._defines[0]);

      return;
    }

    if (index >= this._inputAssemblers.length ) {
      out.model = null;
      out.node = null;
      out.ia = null;
      out.effect = null;
      out.defines = null;

      return;
    }

    out.model = this;
    out.node = this._node;
    out.ia = this._inputAssemblers[index];

    let effect, defines;
    if (index < this._effects.length) {
      effect = this._effects[index];
      defines = this._defines[index];
    } else {
      effect = this._effects[this._effects.length-1];
      defines = this._defines[this._effects.length-1];
    }
    out.effect = effect;
    out.defines = effect.extractDefines(defines);
  }
}

module.exports = Model;
