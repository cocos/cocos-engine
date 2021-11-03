import { ccclass, serializable, type } from 'cc.decorator';
import { Asset } from '../../assets/asset';
import { removeIf } from '../../utils/array';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationMask`)
export class AnimationMask extends Asset {
    @serializable
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
