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
import { DEBUG } from 'internal:constants';
import { assertIsTrue, Color, Vec3 } from '../core';
import { VFXEventType } from './define';
import { ColorArrayParameter, FloatArrayParameter, Uint32ArrayParameter, Vec3ArrayParameter } from './parameters';

export class VFXEventInfo {
    public type = VFXEventType.UNKNOWN;
    public particleId = 0;
    public currentTime = 0;
    public prevTime = 0;
    public position = new Vec3();
    public velocity = new Vec3();
    public rotation = new Vec3();
    public scale = new Vec3();
    public color = new Color();
    public randomSeed = 0;
}

export class VFXEvents {
    get count () {
        return this._count;
    }

    get capacity () {
        return this._particleId.capacity;
    }

    private _count = 0;
    private _particleId = new Uint32ArrayParameter();
    private _currentTime = new FloatArrayParameter();
    private _prevTime = new FloatArrayParameter();
    private _position = new Vec3ArrayParameter();
    private _velocity = new Vec3ArrayParameter();
    private _rotation = new Vec3ArrayParameter();
    private _size = new Vec3ArrayParameter();
    private _color = new ColorArrayParameter();
    private _startLifeTime = new FloatArrayParameter();
    private _randomSeed = new Uint32ArrayParameter();
    private _normalizedAliveTime = new FloatArrayParameter();
    private _type = new Uint32ArrayParameter();

    clear () {
        this._count = 0;
    }

    dispatch (eventInfo: VFXEventInfo) {
        if (this._count === this.capacity) {
            const capacity = this.capacity * 2;
            this._particleId.reserve(capacity);
            this._currentTime.reserve(capacity);
            this._prevTime.reserve(capacity);
            this._position.reserve(capacity);
            this._velocity.reserve(capacity);
            this._rotation.reserve(capacity);
            this._size.reserve(capacity);
            this._color.reserve(capacity);
            this._startLifeTime.reserve(capacity);
            this._randomSeed.reserve(capacity);
            this._normalizedAliveTime.reserve(capacity);
            this._type.reserve(capacity);
        }
        const handle = this._count++;
        this._particleId.setUint32At(eventInfo.particleId, handle);
        this._currentTime.setFloatAt(eventInfo.currentTime, handle);
        this._prevTime.setFloatAt(eventInfo.prevTime, handle);
        this._position.setVec3At(eventInfo.position, handle);
        this._velocity.setVec3At(eventInfo.velocity, handle);
        this._rotation.setVec3At(eventInfo.rotation, handle);
        this._size.setVec3At(eventInfo.scale, handle);
        this._color.setColorAt(eventInfo.color, handle);
        this._randomSeed.setUint32At(eventInfo.randomSeed, handle);
        this._type.setUint32At(eventInfo.type, handle);
    }

    getEventInfoAt (out: VFXEventInfo, handle: number) {
        if (DEBUG) {
            assertIsTrue(handle < this._count && handle >= 0, 'handle out of range');
        }
        out.particleId = this._particleId.getUint32At(handle);
        out.currentTime = this._currentTime.getFloatAt(handle);
        out.prevTime = this._prevTime.getFloatAt(handle);
        out.randomSeed = this._randomSeed.getUint32At(handle);
        out.type = this._type.getUint32At(handle);
        this._position.getVec3At(out.position, handle);
        this._velocity.getVec3At(out.velocity, handle);
        this._rotation.getVec3At(out.rotation, handle);
        this._size.getVec3At(out.scale, handle);
        this._color.getColorAt(out.color, handle);
        return out;
    }
}
