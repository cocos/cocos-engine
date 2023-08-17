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

import { AttributeName } from '../../gfx';
import { Mesh } from './mesh';

/**
 * @en Morph target contains all displacements data of each vertex attribute like position and normal.
 * @zh 形变目标数据包含网格顶点属性在形变下的变化值，可能包含位移、法线等属性
 */
export interface MorphTarget {
    /**
     * Displacement of each target attribute.
     */
    displacements: Mesh.IBufferView[];
}

/**
 * @en Sub mesh morph data describes all morph targets for one sub mesh,
 * including attributes in each morph target, morph targets data and weights corresponding each targets.
 * @zh 子网格形变数据描述一个子网格下所有的形变目标数据，包含顶点形变属性，形变目标数据和对应每个形变目标的权重。
 */
export interface SubMeshMorph {
    /**
     * Attributes to morph.
     */
    attributes: AttributeName[];

    /**
     * Targets.
     */
    targets: MorphTarget[];

    /**
     * Initial weights of each target.
     */
    weights?: number[];
}

/**
 * @en Mesh morph data structure to describe the sub meshes data of all sub meshes,
 * it also contains all sub mesh morphs, global weights configuration and target names.
 * Normally the global weights configuration should be identical to the sub mesh morph weights,
 * but if not, the global weights in morph is less prioritized.
 * @zh 网格的形变数据结构，包含所有子网格形变数据，全局的权重配置和所有形变目标名称。
 * 一般来说，全局权重配置和子网格形变数据中保持一致，但如果有差异，以子网格形变数据中的权重配置为准。
 */
export interface Morph {
    /**
     * Morph data of each sub-mesh.
     */
    subMeshMorphs: (SubMeshMorph | null)[];

    /**
     * Common initial weights of each sub-mesh.
     */
    weights?: number[];

    /**
     * Name of each target of each sub-mesh morph.
     * This field is only meaningful if every sub-mesh has the same number of targets.
     */
    targetNames?: string[];
}
