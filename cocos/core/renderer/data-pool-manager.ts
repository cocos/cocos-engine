// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { AnimationClip } from '../animation/animation-clip';
import { Mesh, Skeleton } from '../assets';
import { GFXDevice } from '../gfx/device';
import { AnimatedBoundsInfo, JointsAnimationInfo, JointsTexturePool } from './models/skeletal-animation-utils';

export class DataPoolManager {
    public jointsTexturePool: JointsTexturePool;
    public jointsAnimationInfo: JointsAnimationInfo;
    public animatedBoundsInfo: AnimatedBoundsInfo;

    constructor (device: GFXDevice) {
        this.jointsTexturePool = new JointsTexturePool(device);
        this.jointsAnimationInfo = new JointsAnimationInfo(device);
        this.animatedBoundsInfo = new AnimatedBoundsInfo();
    }

    public releaseMesh (mesh: Mesh) {
        this.animatedBoundsInfo.releaseMesh(mesh);
    }

    public releaseSkeleton (skeleton: Skeleton) {
        this.jointsTexturePool.releaseSkeleton(skeleton);
        this.animatedBoundsInfo.releaseSkeleton(skeleton);
    }

    public releaseAnimationClip (clip: AnimationClip) {
        this.jointsTexturePool.releaseAnimationClip(clip);
        this.animatedBoundsInfo.releaseAnimationClip(clip);
    }

    public clear () {
        this.jointsTexturePool.clear();
        this.jointsAnimationInfo.clear();
        this.animatedBoundsInfo.clear();
    }
}
