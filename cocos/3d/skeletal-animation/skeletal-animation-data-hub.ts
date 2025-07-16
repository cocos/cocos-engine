/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { DataPoolManager } from './data-pool-manager';
import type { AnimationClip } from '../../animation/animation-clip';
import { cclegacy } from '../../core';
import { BAKE_SKELETON_CURVE_SYMBOL } from '../../animation/internal-symbols';

type BakeData = ReturnType<AnimationClip[typeof BAKE_SKELETON_CURVE_SYMBOL]>;

/**
 * @en
 * The data conversion tool for skeleton animation
 * @zh
 * 骨骼动画数据转换中心。
 * @internal
 */
export class SkelAnimDataHub {
    public static getOrExtract (clip: AnimationClip): BakeData {
        let data = SkelAnimDataHub.pool.get(clip);
        if (!data || data.samples !== clip.sample) {
            // release outdated render data
            if (data) { (cclegacy.director.root.dataPoolManager as DataPoolManager).releaseAnimationClip(clip); }
            const frames = Math.ceil(clip.sample * clip.duration) + 1;
            const step = clip.sample;
            data = clip[BAKE_SKELETON_CURVE_SYMBOL](0, step, frames);
            SkelAnimDataHub.pool.set(clip, data);
        }
        return data;
    }

    public static destroy (clip: AnimationClip): void {
        SkelAnimDataHub.pool.delete(clip);
    }

    private static pool = new Map<AnimationClip, BakeData>();
}
