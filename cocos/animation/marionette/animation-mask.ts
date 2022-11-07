import { ccclass, serializable, editable } from 'cc.decorator';
import type { Node } from '../../scene-graph/node';
import { Asset } from '../../asset/assets/asset';
import { js } from '../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationMask`)
export class AnimationMask extends Asset {
    @serializable
    private _jointMasks: JointMask[] = [];

    @editable
    get joints (): Iterable<JointMaskInfo> {
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
    public addJoint (path: string, enabled: boolean) {
        this.removeJoint(path);
        const info = new JointMask();
        info.path = path;
        info.enabled = enabled;
        this._jointMasks.push(info);
    }

    public removeJoint (removal: string) {
        js.array.removeIf(this._jointMasks, ({ path }) => path === removal);
    }

    public clear () {
        this._jointMasks.length = 0;
    }

    public filterDisabledNodes (root: Node) {
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
}

type JointMaskInfo_ = JointMaskInfo;

export declare namespace AnimationMask {
    export type JointMaskInfo = JointMaskInfo_;
}

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
