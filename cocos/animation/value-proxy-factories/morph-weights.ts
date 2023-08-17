/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, serializable } from 'cc.decorator';
import { MeshRenderer } from '../../3d/framework/mesh-renderer';
import { IValueProxyFactory } from '../value-proxy';

/**
 * @en
 * Value proxy factory for setting morph weights of specified sub-mesh on model component target.
 * @zh
 * 用于设置模型组件目标上指定子网格的指定形状的形变权重的曲线值代理工厂。
 */
@ccclass('cc.animation.MorphWeightValueProxy')
export class MorphWeightValueProxy implements IValueProxyFactory {
    /**
      * @en Sub mesh index.
      * @zh 子网格索引。
      */
    @serializable
    public subMeshIndex = 0;

    /**
      * @en Shape Index.
      * @zh 形状索引。
      */
    @serializable
    public shapeIndex = 0;

    public forTarget (target: MeshRenderer): { set: (value: number) => void; } {
        return {
            set: (value: number): void => {
                target.setWeight(value, this.subMeshIndex, this.shapeIndex);
            },
        };
    }
}

/**
 * @en
 * Value proxy factory for setting morph weights of specified sub-mesh on model component target.
 * @zh
 * 用于设置模型组件目标上指定子网格形变权重的曲线值代理工厂。
 */
@ccclass('cc.animation.MorphWeightsValueProxy')
export class MorphWeightsValueProxy implements IValueProxyFactory {
    /**
     * @en Sub-mesh index.
     * @zh 子网格索引。
     */
    @serializable
    public subMeshIndex = 0;

    public forTarget (target: MeshRenderer): { set: (value: number[]) => void; } {
        return {
            set: (value: number[]): void => {
                target.setWeights(value, this.subMeshIndex);
            },
        };
    }
}

/**
 * @en
 * Value proxy factory for setting morph weights of each sub-mesh on model component target.
 * @zh
 * 用于设置模型组件目标上所有子网格形变权重的曲线值代理工厂。
 */
@ccclass('cc.animation.MorphWeightsAllValueProxy')
export class MorphWeightsAllValueProxy implements IValueProxyFactory {
    public forTarget (target: MeshRenderer): { set: (value: number[]) => void; } {
        return {
            set: (value: number[]): void => {
                const nSubMeshes = target.mesh?.struct.primitives.length ?? 0;
                for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
                    target.setWeights(value, iSubMesh);
                }
            },
        };
    }
}
