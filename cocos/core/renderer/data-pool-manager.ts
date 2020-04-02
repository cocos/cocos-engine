// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { AnimationClip } from '../animation/animation-clip';
import { Skeleton } from '../assets';
import { GFXDevice } from '../gfx/device';
import { JointAnimationInfo, JointTexturePool } from './models/skeletal-animation-utils';

export class DataPoolManager {
    public jointTexturePool: JointTexturePool;
    public jointAnimationInfo: JointAnimationInfo;

    constructor (device: GFXDevice) {
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
