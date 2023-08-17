/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { _decorator } from '../core';
import { Component } from '../scene-graph/component';
import { Prefab } from '../scene-graph/prefab';

const { ccclass, serializable, type, visible } = _decorator;

/**
 * @en
 * Since the new Prefab system is not yet complete, the prefab that has a large difference with prefab asset cannot be automatically migrated.
 * This component is used to save the relationship between the node with the referenced prefab asset in the old Prefab system.
 * When the new Prefab system is complete, it will be automatically migrated to the new Prefab system.
 *
 * @zh
 * PrefabLink
 * 由于新的 Prefab 系统还不完善，所以旧的 Prefab 系统中和 Prefab 资源差异过大的 Prefab 无法实现自动迁移。
 * 此组件用于保存在旧 Prefab 系统中这个节点关联的 Prefab 资源，等新的 Prefab 系统完善，会自动迁移到新的 Prefab 系统上。
 */
@ccclass('cc.PrefabLink')
export class PrefabLink extends Component {
    @type(Prefab)
    @serializable
    @visible(true)
    public prefab: Prefab | null = null;
}
