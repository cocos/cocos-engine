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

import { legacyCC } from '../global-exports';

/**
 * @en Node's coordinate space
 * @zh 节点的坐标空间
 */
export enum NodeSpace {
    LOCAL,
    WORLD,
}

/**
 * @en Bit masks for node's transformation
 * @zh 节点的空间变换位标记
 */
export enum TransformBit {
    /**
     * @en No change
     * @zh 无改变
     */
    NONE = 0,
    /**
     * @en Translation changed
     * @zh 节点位置改变
     */
    POSITION = (1 << 0),
    /**
     * @en Rotation changed
     * @zh 节点旋转
     */
    ROTATION = (1 << 1),
    /**
     * @en Scale changed
     * @zh 节点缩放
     */
    SCALE = (1 << 2),
    /**
     * @en Rotation or scale changed
     * @zh 节点旋转及缩放
     */
    RS = TransformBit.ROTATION | TransformBit.SCALE,
    /**
     * @en Translation, rotation or scale changed
     * @zh 节点平移，旋转及缩放
     */
    TRS = TransformBit.POSITION | TransformBit.ROTATION | TransformBit.SCALE,
    /**
     * @en Invert mask of [[TRS]]
     * @zh [[TRS]] 的反向掩码
     */
    TRS_MASK = ~TransformBit.TRS,
}

legacyCC.internal.TransformBit = TransformBit;
