
/**
 * 场景节点层管理器，用于射线检测、物理碰撞和用户自定义脚本逻辑。
 * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
 */
export class Layers {

  // built-in layers, reserved up to (1 << 7)

  /**
   * @zh 默认层，所有节点的初始值
   */
  public static Default = (1 << 0);
  /**
   * @zh 忽略射线检测
   */
  public static IgnoreRaycast = (1 << 1);
  public static Gizmos = (1 << 2);
  public static Editor = (1 << 3);
  public static UI = (1 << 4);

  // masks

  /**
   * @zh 接受所有用户创建的节点
   */
  public static All = Layers.makeExclusiveMask([Layers.Gizmos, Layers.Editor]);
  /**
   * @zh 接受所有支持射线检测的节点
   */
  public static RaycastMask = Layers.makeExclusiveMask([Layers.Gizmos, Layers.Editor, Layers.IgnoreRaycast]);

  /**
   * @en
   * Add a new layer
   * @zh
   * 添加一个新层
   * @param name 层名字
   * @return 新层的检测值
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
   * @en
   * Make a layer mask accepting nothing but the listed layers
   * @zh
   * 创建一个包含式层检测器，只接受列表中的层
   * @param includes 可接受的层数组
   * @return 指定功能的层检测器
   */
  public static makeInclusiveMask (includes: number[]): number {
    let mask = 0;
    for (const inc of includes) {
      mask |= inc;
    }
    return mask;
  }

  /**
   * @en
   * Make a layer mask accepting everything but the listed layers
   * @zh
   * 创建一个排除式层检测器，只拒绝列表中的层
   * @param  excludes 将拒绝的层数组
   * @return 指定功能的层检测器
   */
  public static makeExclusiveMask (excludes: number[]): number {
    return ~Layers.makeInclusiveMask(excludes);
  }

  /**
   * @en
   * Check a layer is accepted by the mask or not
   * @zh
   * 检查一个层是否被检测器接受
   * @param layer 待检测的层
   * @param mask 层检测器
   * @return 是否通过检测
   */
  public static check (layer: number, mask: number): boolean {
    return (layer & mask) === layer;
  }

  private static _nextAvailable = 8;
}

cc.Layers = Layers;
