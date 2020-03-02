// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { AnimationClip } from '../animation/animation-clip';
import { Skeleton } from '../assets';
import { GFXDevice } from '../gfx/device';
import { JointsAnimationInfo, JointsTexturePool } from './models/skeletal-animation-utils';

export class DataPoolManager {
    public jointsTexturePool: JointsTexturePool;
    public jointsAnimationInfo: JointsAnimationInfo;

    constructor (device: GFXDevice) {
        this.jointsTexturePool = new JointsTexturePool(device);
        this.jointsAnimationInfo = new JointsAnimationInfo(device);
    }

    public releaseSkeleton (skeleton: Skeleton) {
        this.jointsTexturePool.releaseSkeleton(skeleton);
    }

    public releaseAnimationClip (clip: AnimationClip) {
        this.jointsTexturePool.releaseAnimationClip(clip);
    }

    public clear () {
        this.jointsTexturePool.clear();
        this.jointsAnimationInfo.clear();
    }
}
