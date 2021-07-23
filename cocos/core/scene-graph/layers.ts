/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module scene-graph
 */

import { BitMask, Enum } from '../value-types';
import { legacyCC } from '../global-exports';
import { log2 } from '../math/bits';

// built-in layers, users can use 0~19 bits, 20~31 are system preserve bits.
const layerList = {
    NONE: 0,
    IGNORE_RAYCAST: (1 << 20),
    GIZMOS: (1 << 21),
    EDITOR: (1 << 22),
    UI_3D: (1 << 23),
    SCENE_GIZMO: (1 << 24),
    UI_2D: (1 << 25),

    PROFILER: (1 << 28),
    DEFAULT: (1 << 30),
    ALL: 0xffffffff,
};

/**
 * @zh 节点层管理器，层数据是以掩码数据方式存储在 [[Node.layer]] 中，用于射线检测、物理碰撞和用户自定义脚本逻辑。
 * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
 * @en Node's layer manager, it's stored as bit mask data in [[Node.layer]].
 * Layer information is widely used in raycast, physics and user logic.
 * Every node can be assigned to multiple layers with different bit masks, you can setup layer with inclusive or exclusive operation.
 */
export class Layers {
  /**
   * @en All layers in an Enum
   * @zh 以 Enum 形式存在的所有层列表
   */
  public static Enum = Enum(layerList);

  /**
   * @en All layers in [[BitMask]] type
   * @zh 包含所有层的 [[BitMask]]
   */
  public static BitMask = BitMask({ ...layerList });

  /**
   * @en
   * Make a layer mask accepting nothing but the listed layers
   * @zh
   * 创建一个包含式层检测器，只接受列表中的层
   * @param includes All accepted layers
   * @return A filter which can detect all accepted layers
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
   * @param excludes All excluded layers
   * @return A filter which can detect for excluded layers
   */
  public static makeMaskExclude (excludes: number[]): number {
      return ~Layers.makeMaskInclude(excludes);
  }

  /**
   * @zh 添加一个新层，用户可编辑 0 - 19 位为用户自定义层
   * @en Add a new layer, user can use layers from bit position 0 to 19, other bits are reserved.
   * @param name Layer's name
   * @param bitNum Layer's bit position
   */
  public static addLayer (name: string, bitNum: number) {
      if (bitNum === undefined) {
          console.warn('bitNum can\'t be undefined');
          return;
      }
      if (bitNum > 19 || bitNum < 0) {
          console.warn('maximum layers reached.');
          return;
      }
      Layers.Enum[name] = 1 << bitNum;
      Layers.Enum[bitNum] = name;
      Layers.BitMask[name] = 1 << bitNum;
      Layers.BitMask[bitNum] = name;
  }

  /**
   * @en Remove a layer, user can remove layers from bit position 0 to 19, other bits are reserved.
   * @zh 移除一个层，用户可编辑 0 - 19 位为用户自定义层
   * @param bitNum Layer's bit position
   */
  public static deleteLayer (bitNum: number) {
      if (bitNum > 19 || bitNum < 0) {
          console.warn('do not change buildin layers.');
          return;
      }
      delete Layers.Enum[Layers.Enum[bitNum]];
      delete Layers.Enum[bitNum];
      delete Layers.BitMask[Layers.BitMask[bitNum]];
      delete Layers.BitMask[bitNum];
  }

  /**
   * @en Given a layer name, returns the layer index as defined by either a Builtin or a User Layer in the Tags and Layers manager.
   * @zh 给定层名称，返回由标记和层管理器中的内置层或用户层定义的层索引。
   * @param name layer's name
   */
  public static nameToLayer (name: string): number {
      if (name === undefined) {
          console.warn('name can\'t be undefined');
          return -1;
      }

      return log2(Layers.Enum[name] as number);
  }

  /**
   * @en Given a layer number, returns the name of the layer as defined in either a Builtin or a User Layer in the Tags and Layers manager.
   * @zh 给定层数，返回在标记和层管理器中的内置层或用户层中定义的层名称。
   * @param bitNum layer's value
   */
  public static layerToName (bitNum: number): string {
      if (bitNum > 31 || bitNum < 0) {
          console.warn('Unable to access unknown layer.');
          return '';
      }

      return Layers.Enum[bitNum] as string;
  }
}
export declare namespace Layers {
    export type Enum = EnumAlias<typeof Layers.Enum>;
    export type BitMask = EnumAlias<typeof Layers.BitMask>;
}

legacyCC.Layers = Layers;
