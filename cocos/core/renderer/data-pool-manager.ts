// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { AnimationClip } from '../animation/animation-clip';
import { Mesh, Skeleton } from '../assets';
import { GFXDevice } from '../gfx/device';
import { BoneSpaceBoundsInfo, JointsAnimationInfo, JointsTexturePool } from './models/skeletal-animation-utils';

export class DataPoolManager {
    public jointsTexturePool: JointsTexturePool;
    public jointsAnimationInfo: JointsAnimationInfo;
    public boneSpaceBoundsInfo: BoneSpaceBoundsInfo;

    constructor (device: GFXDevice) {
        this.jointsTexturePool = new JointsTexturePool(device);
        this.jointsAnimationInfo = new JointsAnimationInfo(device);
        this.boneSpaceBoundsInfo = new BoneSpaceBoundsInfo();
    }

    public releaseMesh (mesh: Mesh) {
        this.boneSpaceBoundsInfo.releaseMesh(mesh);
    }

    public releaseSkeleton (skeleton: Skeleton) {
        this.jointsTexturePool.releaseSkeleton(skeleton);
        this.boneSpaceBoundsInfo.releaseSkeleton(skeleton);
    }

    public releaseAnimationClip (clip: AnimationClip) {
        this.jointsTexturePool.releaseAnimationClip(clip);
    }

    public clear () {
        this.jointsTexturePool.clear();
        this.jointsAnimationInfo.clear();
        this.boneSpaceBoundsInfo.clear();
    }
}
