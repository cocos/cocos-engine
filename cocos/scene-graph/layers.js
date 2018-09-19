
/**
 * Entity layer system
 */
export default class Layers {
  /**
   * Add a new layer
   * @param {string} name name of the new layer
   * @return {number} new layer's index
   */
  static addLayer(name) {
    if (Layers._nextAvailable > 31) 
      return new Error('maximum layers reached.');
    Layers[name] = (1 << Layers._nextAvailable++);
    return Layers[name];
  }

  /**
   * Make a layer mask accepting nothing but the listed layers
   * @param {number[]} includes layers accepted by the mask
   * @return {number} the specified layer mask
   */
  static makeInclusiveMask(includes) {
    let mask = 0;
    for (let i = 0; i < includes.length; i++)
      mask |= includes[i];
    return mask;
  }

  /**
   * Make a layer mask accepting everything but the listed layers
   * @param {number[]} excludes layers rejected by the mask
   * @return {number} the specified layer mask
   */
  static makeExclusiveMask(excludes) {
    return ~Layers.makeInclusiveMask(excludes);
  }

  /**
   * Check a layer is accepted by the mask or not
   * @param {number} layer the layer number to be tested
   * @param {number} mask the testing layer mask
   * @return {boolean} true if accepted
   */
  static check(layer, mask) {
    return (layer & mask) == layer;
  }
}

Layers._nextAvailable = 8;

// built-in layers, reserved up to (1 << 7)
Layers.Default = (1 << 0);
Layers.IgnoreRaycast = (1 << 1);

// masks
Layers.All = ~0;
Layers.RaycastMask = Layers.makeExclusiveMask([Layers.IgnoreRaycast]);
