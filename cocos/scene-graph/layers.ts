
/**
 * Entity layer system
 */
export class Layers {

  // built-in layers, reserved up to (1 << 7)
  public static Default = (1 << 0);
  public static IgnoreRaycast = (1 << 1);
  public static Gizmos = (1 << 2);
  public static Editor = (1 << 3);
  // masks
  public static All = Layers.makeExclusiveMask([Layers.Gizmos, Layers.Editor]);
  public static RaycastMask = Layers.makeExclusiveMask([Layers.Gizmos, Layers.Editor, Layers.IgnoreRaycast]);

  /**
   * Add a new layer
   * @param {string} name name of the new layer
   * @return {number} new layer's index
   */
  public static addLayer (name: string): number | undefined {
    if (Layers._nextAvailable > 31) {
      console.warn('maximum layers reached.');
      return;
    }
    Layers[name] = (1 << Layers._nextAvailable++);
    return Layers[name];
  }

  /**
   * Make a layer mask accepting nothing but the listed layers
   * @param {number[]} includes layers accepted by the mask
   * @return {number} the specified layer mask
   */
  public static makeInclusiveMask (includes: number[]): number {
    let mask = 0;
    for (const inc of includes) {
      mask |= inc;
    }
    return mask;
  }

  /**
   * Make a layer mask accepting everything but the listed layers
   * @param {number[]} excludes layers rejected by the mask
   * @return {number} the specified layer mask
   */
  public static makeExclusiveMask (excludes: number[]): number {
    return ~Layers.makeInclusiveMask(excludes);
  }

  /**
   * Check a layer is accepted by the mask or not
   * @param {number} layer the layer number to be tested
   * @param {number} mask the testing layer mask
   * @return {boolean} true if accepted
   */
  public static check (layer: number, mask: number): boolean {
    return (layer & mask) === layer;
  }

  private static _nextAvailable = 8;
}

cc.Layers = Layers;
