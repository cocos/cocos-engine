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

import { ccclass, serializable, editable, type } from 'cc.decorator';
import type { Node } from '../../scene-graph/node';
import { Asset } from '../../asset/assets/asset';
import { js } from '../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

interface JointMaskInfo {
    readonly path: string;

    enabled: boolean;
}

@ccclass('cc.JointMask')
class JointMask {
    @serializable
    public path = '';

    @serializable
    public enabled = true;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationMask`)
export class AnimationMask extends Asset {
    @serializable
    private _jointMasks: JointMask[] = [];

    @editable
    @type(JointMask)
    get joints (): Iterable<JointMaskInfo> {
        // TODO: editor currently treats this property as (and expects it to be) an array.
        // If later refactoring is needed, changes should also be made to editor.

        return this._jointMasks;
    }

    set joints (value) {
        this.clear();
        for (const joint of value) {
            this.addJoint(joint.path, joint.enabled);
        }
    }

    /**
     * @zh 添加一个关节遮罩项。
     * 已存在的相同路径的关节遮罩项会被替换为新的。
     * @en Add a joint mask item.
     * Already existing joint mask with same path item will be replaced.
     * @param path @zh 关节的路径。 @en The joint's path.
     * @param enabled @zh 是否启用该关节。 @en Whether to enable the joint.
     */
    public addJoint (path: string, enabled: boolean): void {
        this.removeJoint(path);
        const info = new JointMask();
        info.path = path;
        info.enabled = enabled;
        this._jointMasks.push(info);
    }

    public removeJoint (removal: string): void {
        js.array.removeIf(this._jointMasks, ({ path }) => path === removal);
    }

    public clear (): void {
        this._jointMasks.length = 0;
    }

    public filterDisabledNodes (root: Node): Set<Node> {
        const { _jointMasks: jointMasks } = this;
        const nJointMasks = jointMasks.length;
        const disabledNodes = new Set<Node>();
        for (let iJointMask = 0; iJointMask < nJointMasks; ++iJointMask) {
            const { path, enabled } = jointMasks[iJointMask];
            if (enabled) {
                continue;
            }
            const node = root.getChildByPath(path);
            if (node) {
                disabledNodes.add(node);
            }
        }
        return disabledNodes;
    }

    public isExcluded (path: string): boolean {
        return !(this._jointMasks.find(({ path: p }) => p === path)?.enabled ?? true);
    }
}

type JointMaskInfo_ = JointMaskInfo;

export declare namespace AnimationMask {
    export type JointMaskInfo = JointMaskInfo_;
}
