/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
import { assertIsTrue, Mat4, Quat, Vec3 } from '../core';

export class EmitterDataSet {
    public isWorldSpace = false;
    public spawnFraction = 0;
    public lastPosition = new Vec3();
    public currentPosition = new Vec3();
    public currentDelay = 0;
    // emitter range
    public loopAge = 0;
    public prevLoopAge = 0;
    public normalizedLoopAge = 0;
    public normalizedPrevLoopAge = 0;
    public emitterDeltaTime = 0;
    public emitterFrameOffset = 0;
    public loopCount = 0;
    public spawnContinuousCount = 0;
    public burstCount = 0;
    /**
     * The velocity of the emitter in world space.
     */
    public emitterVelocity = new Vec3();
    /**
     * The velocity of the emitter in emitting space. When emitting space equals to world space, it's equals to emitterVelocity.
     */
    public emitterVelocityInEmittingSpace = new Vec3();
    // end emitter range

    // simulation range
    public deltaTime = 0;
    public localToWorld = new Mat4();
    public worldToLocal = new Mat4();
    public rotationIfNeedTransform = new Quat();
    public localScale = new Vec3(1, 1, 1);
    public worldScale = new Vec3(1, 1, 1);
    public worldRotation = new Quat();
    public localRotation = new Quat();

    setDeltaTime (deltaTime: number) {
        this.deltaTime = deltaTime;
    }
}
