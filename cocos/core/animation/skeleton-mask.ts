import { ccclass, serializable, type } from 'cc.decorator';
import { Asset } from '../assets/asset';

@ccclass('cc.SkeletonMask')
export class SkeletonMask extends Asset {
    @serializable
    private _jointMasks: JointMask[] = [];

    get joints (): Iterable<JointMaskInfo> {
        return this._jointMasks;
    }

    set joints (value: Iterable<JointMaskInfo>) {
        this._jointMasks = Array.from(value, ({ path, enabled }) => {
            const jointMask = new JointMask();
            jointMask.path = path;
            jointMask.enabled = enabled;
            return jointMask;
        });
    }
}

export declare namespace SkeletonMask {
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
    public path!: string;

    @serializable
    public enabled!: boolean;
}
