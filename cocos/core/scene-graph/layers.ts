/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category scene-graph
 */

import { BitMask, Enum } from '../value-types';

const LayersEnum = Enum({
  IgnoreRaycast : (1 << 20),
  Gizmos : (1 << 21),
  Editor : (1 << 22),
  UI : (1 << 23),
  SceneGizmo : (1 << 24),
  UI2D : (1 << 25),

  PROFILER : (1 << 28),
  Always : (1 << 29),
  Default : (1 << 30),
});

const BitMaskList = BitMask({
  IgnoreRaycast : (1 << 20),
  Gizmos : (1 << 21),
  Editor : (1 << 22),
  UI : (1 << 23),
  SceneGizmo : (1 << 24),
  UI2D : (1 << 25),

  PROFILER : (1 << 28),
  Always : (1 << 29),
  Default : (1 << 30),
});

/**
 * 场景节点层管理器，用于射线检测、物理碰撞和用户自定义脚本逻辑。
 * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
 */
export class Layers {

  // built-in layers, users can use 0~20 bits, 21~31 are system preserve bits.

  public static LayersEnum = LayersEnum;
  public static BitMaskList = BitMaskList;

  /**
   * @zh 默认层，所有节点的初始值
   */
  public static Default = 1 << 30;
  public static Always = 1 << 29;
  public static IgnoreRaycast = (1 << 20);
  public static Gizmos = (1 << 21);
  public static Editor = (1 << 22);
  // 3D UI
  public static UI = (1 << 23);
  // 2D UI
  public static UI2D = (1 << 25);
  public static SceneGizmo = (1 << 24);

  // masks

  /**
   * @zh 接受所有用户创建的节点
   */
  public static All = Layers.makeExclusiveMask([Layers.LayersEnum.Gizmos, Layers.LayersEnum.SceneGizmo, Layers.LayersEnum.Editor]);
  /**
   * @zh 接受所有支持射线检测的节点
   */
  public static RaycastMask = Layers.makeExclusiveMask([Layers.LayersEnum.Gizmos, Layers.LayersEnum.SceneGizmo,
    Layers.LayersEnum.Editor, Layers.LayersEnum.IgnoreRaycast]);

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

  public static addLayer ( name: string, bitNum: number) {
    if ( bitNum > 20 || bitNum < 0) {
      console.warn('maximum layers reached.');
      return;
    }
    LayersEnum[name] = 1 << bitNum;
    LayersEnum[bitNum] = name;
    BitMaskList[name] = 1 << bitNum;
    BitMaskList[bitNum] = name;
  }

  public static deleteLayer (bitNum: number) {
    if ( bitNum > 20 || bitNum < 0) {
      console.warn('do not change buildin layers.');
      return;
    }
    delete LayersEnum[LayersEnum[bitNum]];
    delete LayersEnum[bitNum];
    delete BitMaskList[BitMaskList[bitNum]];
    delete BitMaskList[bitNum];
  }

  // private static _nextAvailable = 8;
}

cc.Layers = Layers;
