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
import { legacyCC } from '../global-exports';

// built-in layers, users can use 0~19 bits, 20~31 are system preserve bits.
const layerList = {
  NONE: 0,
  IGNORE_RAYCAST : (1 << 20),
  GIZMOS : (1 << 21),
  EDITOR : (1 << 22),
  UI_3D : (1 << 23),
  SCENE_GIZMO : (1 << 24),
  UI_2D : (1 << 25),

  PROFILER : (1 << 28),
  DEFAULT : (1 << 30),
  ALL : 0xffffffff,
};

/**
 * 场景节点层管理器，用于射线检测、物理碰撞和用户自定义脚本逻辑。
 * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
 */
export class Layers {

  public static Enum = Enum(layerList);
  public static BitMask = BitMask(Object.assign({}, layerList));

  /**
   * @en
   * Make a layer mask accepting nothing but the listed layers
   * @zh
   * 创建一个包含式层检测器，只接受列表中的层
   * @param includes 可接受的层数组
   * @return 指定功能的层检测器
   */
  public static makeMaskInclude (includes: number[]): number {
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
  public static makeMaskExclude (excludes: number[]): number {
    return ~Layers.makeMaskInclude(excludes);
  }

  /**
   * @zh 添加一个新层，用户可编辑 0 - 19 位为用户自定义层
   * @param name 层名字
   * @param bitNum 层序号
   */
  public static addLayer ( name: string, bitNum: number) {
    if ( bitNum === undefined ) {
      console.warn('bitNum can\'t be undefined');
      return;
    }
    if ( bitNum > 19 || bitNum < 0) {
      console.warn('maximum layers reached.');
      return;
    }
    Layers.Enum[name] = 1 << bitNum;
    Layers.Enum[bitNum] = name;
    Layers.BitMask[name] = 1 << bitNum;
    Layers.BitMask[bitNum] = name;
  }

  /**
   * @zh
   * 移除一个层，用户可编辑 0 - 19 位为用户自定义层
   * @param bitNum 层序号
   */
  public static deleteLayer (bitNum: number) {
    if ( bitNum > 19 || bitNum < 0) {
      console.warn('do not change buildin layers.');
      return;
    }
    delete Layers.Enum[Layers.Enum[bitNum]];
    delete Layers.Enum[bitNum];
    delete Layers.BitMask[Layers.BitMask[bitNum]];
    delete Layers.BitMask[bitNum];
  }
}

legacyCC.Layers = Layers;
