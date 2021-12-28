import { ccclass, serializable, editable, type } from 'cc.decorator';
import type { Node } from '../../scene-graph/node';
import { Asset } from '../../assets/asset';
import { removeIf } from '../../utils/array';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationMask`)
export class AnimationMask extends Asset {
    @serializable
    @editable
    private _jointMasks: JointMask[] = [];

    get joints (): Iterable<JointMaskInfo> {
        return this._jointMasks;
    }

    /**
     * It's undefined behaviour to add same joint path for twice or more.
     * @param path
     * @param enabled
     */
    public addJoint (path: string, enabled: boolean) {
        const info = new JointMask();
        info.path = path;
        info.enabled = enabled;
        this._jointMasks.push(info);
    }

    public removeJoint (removal: string) {
        removeIf(this._jointMasks, ({ path }) => path === removal);
    }

    public clear () {
        this._jointMasks.length = 0;
    }

    public filterDisabledNodes (root: Node) {
        return this._jointMasks.filter(
            ({ enabled }) => !enabled,
        ).map(
            ({ path }) => root.getChildByPath(path)!,
        ).filter((node) => !!node);
    }
}

export declare namespace AnimationMask {
    export type JointMaskInfo = JointMaskInfo_;
}

interface JointMaskInfo {
    readonly path: string;

    enabled: boolean;
}

type JointMaskInfo_ = JointMaskInfo;

@ccclass('cc.JointMask')
class JointMask {
    @serializable
    public path = '';

    @serializable
    public enabled = true;
}
