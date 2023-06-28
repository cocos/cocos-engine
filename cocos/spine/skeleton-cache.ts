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

import { TrackEntryListeners } from './track-entry-listeners';
import { vfmtPosUvColor4B, vfmtPosUvTwoColor4B, getAttributeStride } from '../2d/renderer/vertex-format';
import { SPINE_WASM } from './lib/instantiated';
import spine from './lib/spine-core.js';
import { SkeletonData } from './skeleton-data';
import { warn } from '../core/platform/debug';

const MaxCacheTime = 30;
const FrameTime = 1 / 60;
const spineTag = SPINE_WASM;
const _useTint = true;
const _byteStrideOneColor = getAttributeStride(vfmtPosUvColor4B);
const _byteStrideTwoColor = getAttributeStride(vfmtPosUvTwoColor4B);

class FrameBoneInfo {
    a = 0;
    b = 0;
    c = 0;
    d = 0;
    worldX = 0;
    worldY = 0;
}

class SpineModel {
    public vCount = 0;
    public iCount = 0;
    public vData: Uint8Array = null!;
    public iData: Uint16Array = null!;
    public meshes: SpineDrawItem[] = [];
}

class SpineDrawItem {
    public iCount = 0;
    public blendMode = 0;
}

export interface AnimationFrame {
    model: SpineModel;
    boneInfos: FrameBoneInfo[];
}

export class AnimationCache {
    protected _instance: spine.SkeletonInstance = null!;
    protected _state: spine.AnimationState = null!;
    protected _skeletonData: spine.SkeletonData = null!;
    protected _skeleton: spine.Skeleton = null!;
    protected _frames: AnimationFrame[] = [];
    protected _curIndex = -1;
    protected _isCompleted = false;
    protected _maxFrameIdex = 0;

    constructor (data: spine.SkeletonData) {
        this._instance = new spine.SkeletonInstance();
        this._skeletonData = data;
        this._skeleton = this._instance.initSkeleton(data);
        this._instance.setUseTint(_useTint);
    }

    get skeleton (): spine.Skeleton {
        return this._skeleton;
    }

    public setSkin (skinName: string): void {
        this._instance.setSkin(skinName);
    }

    public setAnimation (animationName: string): void {
        const animations = this._skeletonData.animations;
        let animation: spine.Animation | null = null;
        animations.forEach((element): void => {
            if (element.name === animationName) {
                animation = element;
            }
        });
        //const animation = this._skeletonData.findAnimation(animationName);
        if (!animation) {
            warn(`find no animation named ${animationName} !!!`);
            return;
        }
        this._maxFrameIdex = Math.floor((animation as any).duration / FrameTime);
        this._instance.setAnimation(0, animationName, false);
    }

    public updateToFrame (frameIdx: number): void {
        if (this._isCompleted) return;
        while (this._curIndex < frameIdx) {
            this._instance.updateAnimation(FrameTime);
            this._curIndex++;
            const model = this._instance.updateRenderData();
            this.updateRenderData(this._curIndex, model);
            if (this._curIndex >= this._maxFrameIdex) {
                this._isCompleted = true;
            }
        }
    }

    public getFrame (frameIdx: number): AnimationFrame {
        const index = frameIdx % this._maxFrameIdex;
        return this._frames[index];
    }

    public invalidAnimationFrames (): void {
        this._curIndex = -1;
        this._isCompleted = false;
        this._frames.length = 0;
    }

    private updateRenderData (index: number, model: any): void {
        const vc = model.vCount;
        const ic = model.iCount;
        const floatStride = (_useTint ?  _byteStrideTwoColor : _byteStrideOneColor) / Float32Array.BYTES_PER_ELEMENT;
        const vUint8Buf = new Uint8Array(Float32Array.BYTES_PER_ELEMENT * floatStride * vc);
        const iUint16Buf = new Uint16Array(ic);

        const vPtr = model.vPtr;
        const vLength = vc * Float32Array.BYTES_PER_ELEMENT * floatStride;
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const vData = spine.wasmUtil.wasm.HEAPU8.subarray(vPtr, vPtr + vLength);

        vUint8Buf.set(vData);

        const iPtr = model.iPtr;
        const iLength = Uint16Array.BYTES_PER_ELEMENT * ic;
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const iData = spine.wasmUtil.wasm.HEAPU8.subarray(iPtr, iPtr + iLength);
        const iUint8Buf = new Uint8Array(iUint16Buf.buffer);
        iUint8Buf.set(iData);

        const modelData = new SpineModel();
        modelData.vCount = vc;
        modelData.iCount = ic;
        modelData.vData = vUint8Buf;
        modelData.iData = iUint16Buf;

        const meshes = model.getMeshes();
        const count = meshes.size();
        for (let i = 0; i < count; i++) {
            const mesh = meshes.get(i);
            const meshData = new SpineDrawItem();
            meshData.iCount = mesh.iCount;
            meshData.blendMode = mesh.blendMode;
            modelData.meshes.push(meshData);
        }

        const bones = this._skeleton.bones;
        const boneInfosArray: FrameBoneInfo[] = [];
        bones.forEach((bone): void => {
            const boneInfo = new FrameBoneInfo();
            boneInfo.a = bone.a;
            boneInfo.b = bone.b;
            boneInfo.c = bone.c;
            boneInfo.d = bone.d;
            boneInfo.worldX = bone.worldX;
            boneInfo.worldY = bone.worldY;
            boneInfosArray.push(boneInfo);
        });

        this._frames[index] = {
            model: modelData,
            boneInfos: boneInfosArray,
        };
    }

    public destory (): void {
        spine.wasmUtil.destroySpineInstance(this._instance);
    }
}

class SkeletonCache {
    public static sharedCache = new SkeletonCache();
    protected _animationPool: { [key: string]: AnimationCache };
    constructor () {
        this._animationPool = {};
    }

    public getAnimationCache (uuid: string, animationName: string): AnimationCache {
        const poolKey = `${uuid}#${animationName}`;
        const animCache = this._animationPool[poolKey];
        return animCache;
    }

    public initAnimationCache (data: SkeletonData, animationName: string): AnimationCache {
        const uuid = data.uuid;
        const poolKey = `${uuid}#${animationName}`;
        const spData = data.getRuntimeData();
        const animCache = new AnimationCache(spData!);
        this._animationPool[poolKey] = animCache;
        animCache.setAnimation(animationName);
        return animCache;
    }

    public destroyCachedAnimations (uuid?: string): void {
        if (uuid) {
            const animationPool = this._animationPool;
            for (const key in animationPool) {
                if (key.includes(uuid)) {
                    animationPool[key].destory();
                    delete animationPool[key];
                }
            }
        } else {
            const animationPool = this._animationPool;
            for (const key in animationPool) {
                animationPool[key].destory();
                delete animationPool[key];
            }
        }
    }
}

export default SkeletonCache;
