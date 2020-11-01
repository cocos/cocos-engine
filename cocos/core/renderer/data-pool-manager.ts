/**
 * @packageDocumentation
 * @hidden
 */

import { AnimationClip } from '../animation/animation-clip';
import { Skeleton } from '../assets';
import { Device } from '../gfx';
import { JointAnimationInfo, JointTexturePool } from './models/skeletal-animation-utils';

export class DataPoolManager {
    public jointTexturePool: JointTexturePool;
    public jointAnimationInfo: JointAnimationInfo;

    constructor (device: Device) {
        this.jointTexturePool = new JointTexturePool(device);
        this.jointAnimationInfo = new JointAnimationInfo(device);
    }

    public releaseSkeleton (skeleton: Skeleton) {
        this.jointTexturePool.releaseSkeleton(skeleton);
    }

    public releaseAnimationClip (clip: AnimationClip) {
        this.jointTexturePool.releaseAnimationClip(clip);
    }

    public clear () {
        this.jointTexturePool.clear();
        this.jointAnimationInfo.clear();
    }
}
