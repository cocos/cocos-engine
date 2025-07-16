/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import type { AnimationClip } from '../../animation/animation-clip';
import type { Skeleton } from '../assets';
import { Device } from '../../gfx';
import { JointAnimationInfo, JointTexturePool } from './skeletal-animation-utils';
import { cclegacy } from '../../core';

export class DataPoolManager {
    public jointTexturePool: JointTexturePool;
    public jointAnimationInfo: JointAnimationInfo;

    constructor (device: Device) {
        this.jointTexturePool = new JointTexturePool(device);
        this.jointAnimationInfo = new JointAnimationInfo(device);
    }

    public releaseSkeleton (skeleton: Skeleton): void {
        this.jointTexturePool.releaseSkeleton(skeleton);
    }

    public releaseAnimationClip (clip: AnimationClip): void {
        this.jointTexturePool.releaseAnimationClip(clip);
    }

    public clear (): void {
        this.jointTexturePool.clear();
        this.jointAnimationInfo.clear();
    }
}

cclegacy.internal.DataPoolManager = DataPoolManager;
