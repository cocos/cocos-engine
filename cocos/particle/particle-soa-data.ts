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

import { assert, Color, Vec3 } from '../core';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;

export class TrailSegment {
    public x = 0;
    public y = 0;
    public z = 0;
    public timeStamp = 0;

    set (x: number, y: number, z: number, timeStamp: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.timeStamp = timeStamp;
    }

    fromArray (array: Float32Array, offset: number) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        this.timeStamp = array[offset + 3];
    }

    toArray (array: Float32Array, offset: number) {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.timeStamp;
    }
}

export enum ParticleOptionalChannels {
    SPEED_MODIFIER = 1,
}

export class ParticleSnapshot {
    public position = new Vec3();
    public finalVelocity = new Vec3();
    public rotation = new Vec3();
    public size = new Vec3();
    public color = new Color();
    public randomSeed = 0;
    public invStartLifeTime = 1;
    public normalizedAliveTime = 0;
    public recordReason = -1;
}

export enum RecordReason {
    BIRTH,
    DEATH,
    CUSTOM,
}

export const MAX_SUB_EMITTER_ACCUMULATOR = 3;

const tempColor = new Color();
export class ParticleSOAData {
    private _count = 0;
    private _capacity = 16;
    private _positionX = new Float32Array(this._capacity);
    private _positionY = new Float32Array(this._capacity);
    private _positionZ = new Float32Array(this._capacity);
    private _velocityX = new Float32Array(this._capacity);
    private _velocityY = new Float32Array(this._capacity);
    private _velocityZ = new Float32Array(this._capacity);
    private _startDirX = new Float32Array(this._capacity);
    private _startDirY = new Float32Array(this._capacity);
    private _startDirZ = new Float32Array(this._capacity);
    private _animatedVelocityX = new Float32Array(this._capacity);
    private _animatedVelocityY = new Float32Array(this._capacity);
    private _animatedVelocityZ = new Float32Array(this._capacity);
    private _speedModifier = new Float32Array(this._capacity);
    private _rotationX = new Float32Array(this._capacity);
    private _rotationY = new Float32Array(this._capacity);
    private _rotationZ = new Float32Array(this._capacity);
    private _axisOfRotationX = new Float32Array(this._capacity);
    private _axisOfRotationY = new Float32Array(this._capacity);
    private _axisOfRotationZ = new Float32Array(this._capacity);
    private _angularVelocityX = new Float32Array(this._capacity);
    private _angularVelocityY = new Float32Array(this._capacity);
    private _angularVelocityZ = new Float32Array(this._capacity);
    private _startSizeX = new Float32Array(this._capacity);
    private _startSizeY = new Float32Array(this._capacity);
    private _startSizeZ = new Float32Array(this._capacity);
    private _sizeX = new Float32Array(this._capacity);
    private _sizeY = new Float32Array(this._capacity);
    private _sizeZ = new Float32Array(this._capacity);
    private _startColor = new Uint32Array(this._capacity);
    private _color = new Uint32Array(this._capacity);
    private _randomSeed = new Uint32Array(this._capacity);
    private _invStartLifeTime = new Float32Array(this._capacity);
    private _normalizedAliveTime = new Float32Array(this._capacity);
    private _frameIndex = new Float32Array(this._capacity);
    private _noiseX = new Float32Array(this._capacity);
    private _noiseY = new Float32Array(this._capacity);
    private _noiseZ = new Float32Array(this._capacity);
    private _subEmitterAccumulators = new Float32Array(this._capacity * MAX_SUB_EMITTER_ACCUMULATOR);
    // trail
    // One trail segment contains 4 float: x, y, z, timestamp
    private _trailSegmentStride = 4;
    private _trailSegmentCapacityPerParticle = 16;
    // It's a ring buffer of trail segment per particle
    private _trailSegments = new Float32Array(this._capacity * this._trailSegmentCapacityPerParticle * this._trailSegmentStride);
    // include first trail segment
    private _startTrailSegmentIndices = new Uint16Array(this._capacity);
    // exclude last trail segment
    private _endTrailSegmentIndices = new Uint16Array(this._capacity);
    private _trailSegmentNumbers = new Uint16Array(this._capacity);
    private _particleSnapshots = [new ParticleSnapshot(), new ParticleSnapshot(), new ParticleSnapshot(), new ParticleSnapshot()];
    private _snapshotUsed = 0;

    get capacity () {
        return this._capacity;
    }

    get count () {
        return this._count;
    }

    get positionX () {
        return this._positionX;
    }

    get positionY () {
        return this._positionY;
    }

    get positionZ () {
        return this._positionZ;
    }

    get randomSeed () {
        return this._randomSeed;
    }

    get invStartLifeTime () {
        return this._invStartLifeTime;
    }

    get normalizedAliveTime () {
        return this._normalizedAliveTime;
    }

    get frameIndex () {
        return this._frameIndex;
    }

    get noiseX () {
        return this._noiseX;
    }

    get noiseY () {
        return this._noiseY;
    }

    get noiseZ () {
        return this._noiseZ;
    }

    get subEmitterAccumulators () {
        return this._subEmitterAccumulators;
    }

    get trailSegmentCapacityPerParticle () {
        return this._trailSegmentCapacityPerParticle;
    }

    get trailSegmentNumbers () {
        return this._trailSegmentNumbers;
    }

    get velocityX () {
        return this._velocityX;
    }

    get velocityY () {
        return this._velocityY;
    }

    get velocityZ () {
        return this._velocityZ;
    }

    get startDirX () {
        return this._startDirX;
    }

    get startDirY () {
        return this._startDirY;
    }

    get startDirZ () {
        return this._startDirZ;
    }

    get animatedVelocityX () {
        return this._animatedVelocityX;
    }

    get animatedVelocityY () {
        return this._animatedVelocityY;
    }

    get animatedVelocityZ () {
        return this._animatedVelocityZ;
    }

    get rotationX () {
        return this._rotationX;
    }

    get rotationY () {
        return this._rotationY;
    }

    get rotationZ () {
        return this._rotationZ;
    }

    get axisOfRotationX () {
        return this._axisOfRotationX;
    }

    get axisOfRotationY () {
        return this._axisOfRotationY;
    }

    get axisOfRotationZ () {
        return this._axisOfRotationZ;
    }

    get angularVelocityX () {
        return this._angularVelocityX;
    }

    get angularVelocityY () {
        return this._angularVelocityY;
    }

    get angularVelocityZ () {
        return this._angularVelocityZ;
    }

    get speedModifier () {
        return this._speedModifier;
    }

    get sizeX () {
        return this._sizeX;
    }

    get sizeY () {
        return this._sizeY;
    }

    get sizeZ () {
        return this._sizeZ;
    }

    get startSizeX () {
        return this._startSizeX;
    }

    get startSizeY () {
        return this._startSizeY;
    }

    get startSizeZ () {
        return this._startSizeZ;
    }

    get startColor () {
        return this._startColor;
    }

    get color () {
        return this._color;
    }

    get particleEventSnapshots (): ReadonlyArray<ParticleSnapshot> {
        return this._particleSnapshots;
    }

    get particleEventSnapshotCount () {
        return this._snapshotUsed;
    }

    getPositionAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._positionX[handle];
        out.y = this._positionY[handle];
        out.z = this._positionZ[handle];
        return out;
    }

    setPositionAt (position: Vec3, handle: ParticleHandle) {
        this._positionX[handle] = position.x;
        this._positionY[handle] = position.y;
        this._positionZ[handle] = position.z;
    }

    addPositionAt (deltaTranslation: Vec3, handle: ParticleHandle) {
        this._positionX[handle] += deltaTranslation.x;
        this._positionY[handle] += deltaTranslation.y;
        this._positionZ[handle] += deltaTranslation.z;
    }

    getVelocityAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._velocityX[handle];
        out.y = this._velocityY[handle];
        out.z = this._velocityZ[handle];
        return out;
    }

    addVelocityAt (deltaVelocity: Vec3, handle: ParticleHandle) {
        this._velocityX[handle] += deltaVelocity.x;
        this._velocityY[handle] += deltaVelocity.y;
        this._velocityZ[handle] += deltaVelocity.z;
    }

    setVelocityAt (val: Vec3, handle: ParticleHandle) {
        this._velocityX[handle] = val.x;
        this._velocityY[handle] = val.y;
        this._velocityZ[handle] = val.z;
    }

    getStartDirAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._startDirX[handle];
        out.y = this._startDirY[handle];
        out.z = this._startDirZ[handle];
        return out;
    }

    setStartDirAt (val: Vec3, handle: ParticleHandle) {
        this._startDirX[handle] = val.x;
        this._startDirY[handle] = val.y;
        this._startDirZ[handle] = val.z;
    }

    getAnimatedVelocityAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._animatedVelocityX[handle];
        out.y = this._animatedVelocityY[handle];
        out.z = this._animatedVelocityZ[handle];
        return out;
    }

    addAnimatedVelocityAt (val: Vec3, handle: ParticleHandle) {
        this._animatedVelocityX[handle] = val.x;
        this._animatedVelocityY[handle] = val.y;
        this._animatedVelocityZ[handle] = val.z;
    }

    getFinalVelocityAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._velocityX[handle] + this._animatedVelocityX[handle];
        out.y = this._velocityY[handle] + this._animatedVelocityY[handle];
        out.z = this._velocityZ[handle] + this._animatedVelocityZ[handle];
    }

    getAngularVelocityAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._angularVelocityX[handle];
        out.y = this._angularVelocityY[handle];
        out.z = this._angularVelocityZ[handle];
    }

    addAngularVelocityAt (val: Vec3, handle: ParticleHandle) {
        this._angularVelocityX[handle] += val.x;
        this._angularVelocityY[handle] += val.y;
        this._angularVelocityZ[handle] += val.z;
    }

    getRotationAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._rotationX[handle];
        out.y = this._rotationY[handle];
        out.z = this._rotationZ[handle];
    }

    addRotationAt (val: Vec3, handle: ParticleHandle) {
        this._rotationX[handle] += val.x;
        this._rotationY[handle] += val.y;
        this._rotationZ[handle] += val.z;
    }

    getStartSizeAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._startSizeX[handle];
        out.y = this._startSizeY[handle];
        out.z = this._startSizeZ[handle];
        return out;
    }

    getSizeAt (out: Vec3, handle: ParticleHandle) {
        out.x = this._sizeX[handle];
        out.y = this._sizeY[handle];
        out.z = this._sizeZ[handle];
    }

    setSizeAt (val: Vec3, handle: ParticleHandle) {
        this._sizeX[handle] = val.x;
        this._sizeY[handle] = val.y;
        this._sizeZ[handle] = val.z;
    }

    getStartColorAt (out: Color, handle: ParticleHandle) {
        Color.fromUint32(out, this._startColor[handle]);
        return out;
    }

    setStartColorAt (color: Color, handle: ParticleHandle) {
        this._startColor[handle] = Color.toUint32(color);
    }

    getColorAt (out: Color, handle: ParticleHandle) {
        Color.fromUint32(out, this._color[handle]);
        return out;
    }

    setColorAt (color: Color, handle: ParticleHandle) {
        this._color[handle] = Color.toUint32(color);
    }

    multipleColorAt (color: Color, handle: ParticleHandle) {
        Color.fromUint32(tempColor, this._color[handle]);
        tempColor.multiply(color);
        this._color[handle] = Color.toUint32(tempColor);
    }

    addTrailSegment (handle: ParticleHandle) {
        if (this._trailSegmentNumbers[handle] >= this._trailSegmentCapacityPerParticle) {
            this.reserveTrailSegment(this._trailSegmentCapacityPerParticle * 2);
        }
        this._endTrailSegmentIndices[handle] = (this._endTrailSegmentIndices[handle] + 1) % this._trailSegmentCapacityPerParticle;
        const num = this._trailSegmentNumbers[handle];
        this._trailSegmentNumbers[handle]++;
        return num;
    }

    reserveTrailSegment (trailSegmentCapacity: number) {
        if (this._trailSegmentCapacityPerParticle === trailSegmentCapacity) {
            return;
        }
        const newTrailSegments = new Float32Array(trailSegmentCapacity * this._trailSegmentStride * this._capacity);
        const tempTrailSegment = new TrailSegment();
        if (this._trailSegmentCapacityPerParticle < trailSegmentCapacity) {
            for (let i = 0; i < this._count; i++) {
                const num = this._trailSegmentNumbers[i];
                for (let j = 0; j < num; j++) {
                    this.getTrailSegmentAt(i, j, tempTrailSegment).toArray(newTrailSegments,
                        (i * trailSegmentCapacity + j) * this._trailSegmentStride);
                }
                this._endTrailSegmentIndices[i] = num;
            }
        } else {
            const newTrailSegments = new Float32Array(trailSegmentCapacity * this._trailSegmentStride * this._capacity);
            const tempTrailSegment = new TrailSegment();
            for (let i = 0; i < this._count; i++) {
                const num = Math.min(this._trailSegmentNumbers[i], trailSegmentCapacity);
                for (let j = 0; j < num; j++) {
                    this.getTrailSegmentAt(i, j, tempTrailSegment).toArray(newTrailSegments,
                        (i * trailSegmentCapacity + j) * this._trailSegmentStride);
                }
                this._trailSegmentNumbers[i] = num;
                this._endTrailSegmentIndices[i] = num;
            }
        }
        this._startTrailSegmentIndices.fill(0);
        this._trailSegments = newTrailSegments;
        this._trailSegmentCapacityPerParticle = trailSegmentCapacity;
    }

    removeTrailSegment (handle: ParticleHandle) {
        this._startTrailSegmentIndices[handle] = (this._startTrailSegmentIndices[handle] + 1) % this._trailSegmentCapacityPerParticle;
        this._trailSegmentNumbers[handle]--;
    }

    setTrailSegmentAt (handle: ParticleHandle, trailIndex: number, trailSegment: TrailSegment) {
        const offset = (handle * this._trailSegmentCapacityPerParticle + this._startTrailSegmentIndices[handle] + trailIndex)
            % this._trailSegmentCapacityPerParticle * this._trailSegmentStride;
        this._trailSegments[offset] = trailSegment.x;
        this._trailSegments[offset + 1] = trailSegment.y;
        this._trailSegments[offset + 2] = trailSegment.z;
        this._trailSegments[offset + 3] = trailSegment.timeStamp;
    }

    getTrailSegmentAt (handle: ParticleHandle, trailIndex: number, out: TrailSegment) {
        const offset = (handle * this._trailSegmentCapacityPerParticle + this._startTrailSegmentIndices[handle] + trailIndex)
            % this._trailSegmentCapacityPerParticle * this._trailSegmentStride;
        out.x = this._trailSegments[offset];
        out.y = this._trailSegments[offset + 1];
        out.z = this._trailSegments[offset + 2];
        out.timeStamp = this._trailSegments[offset + 3];
        return out;
    }

    getTrailSegmentNumberAt (handle: ParticleHandle) {
        return this._trailSegmentNumbers[handle];
    }

    addParticles (count: number) {
        let reservedCount = this._capacity;
        while (this._count + count > reservedCount) {
            reservedCount *= 2;
        }
        this.reserve(reservedCount);
        for (let i = 0; i < count; ++i) {
            this.resetParticle(this._count++);
        }
    }

    removeParticle (handle: ParticleHandle) {
        assert(handle >= 0 && handle < this._count);
        const lastParticle = this._count - 1;
        this._positionX[handle] = this._positionX[lastParticle];
        this._positionY[handle] = this._positionY[lastParticle];
        this._positionZ[handle] = this._positionZ[lastParticle];
        this._velocityX[handle] = this._velocityX[lastParticle];
        this._velocityY[handle] = this._velocityY[lastParticle];
        this._velocityZ[handle] = this._velocityZ[lastParticle];
        this._startDirX[handle] = this._startDirX[lastParticle];
        this._startDirY[handle] = this._startDirY[lastParticle];
        this._startDirZ[handle] = this._startDirZ[lastParticle];
        this._animatedVelocityX[handle] = this._animatedVelocityX[lastParticle];
        this._animatedVelocityY[handle] = this._animatedVelocityY[lastParticle];
        this._animatedVelocityZ[handle] = this._animatedVelocityZ[lastParticle];
        this._speedModifier[handle] = this._speedModifier[lastParticle];
        this._rotationX[handle] = this._rotationX[lastParticle];
        this._rotationY[handle] = this._rotationY[lastParticle];
        this._rotationZ[handle] = this._rotationZ[lastParticle];
        this._axisOfRotationX[handle] = this._axisOfRotationX[lastParticle];
        this._axisOfRotationY[handle] = this._axisOfRotationY[lastParticle];
        this._axisOfRotationZ[handle] = this._axisOfRotationZ[lastParticle];
        this._angularVelocityX[handle] = this._angularVelocityX[lastParticle];
        this._angularVelocityY[handle] = this._angularVelocityY[lastParticle];
        this._angularVelocityZ[handle] = this._angularVelocityZ[lastParticle];
        this._startSizeX[handle] = this._startSizeX[lastParticle];
        this._startSizeY[handle] = this._startSizeY[lastParticle];
        this._startSizeZ[handle] = this._startSizeZ[lastParticle];
        this._sizeX[handle] = this._sizeX[lastParticle];
        this._sizeY[handle] = this._sizeY[lastParticle];
        this._sizeZ[handle] = this._sizeZ[lastParticle];
        this._startColor[handle] = this._startColor[lastParticle];
        this._color[handle] = this._color[lastParticle];
        this._randomSeed[handle] = this._randomSeed[lastParticle];
        this._invStartLifeTime[handle] = this._invStartLifeTime[lastParticle];
        this._normalizedAliveTime[handle] = this._normalizedAliveTime[lastParticle];
        this._frameIndex[handle] = this._frameIndex[lastParticle];
        this._noiseX[handle] = this._noiseX[lastParticle];
        this._noiseY[handle] = this._noiseY[lastParticle];
        this._noiseZ[handle] = this._noiseZ[lastParticle];
        for (let i = 0; i < MAX_SUB_EMITTER_ACCUMULATOR; i++) {
            this._subEmitterAccumulators[handle * MAX_SUB_EMITTER_ACCUMULATOR + i] = this._subEmitterAccumulators[lastParticle * MAX_SUB_EMITTER_ACCUMULATOR + i];
        }
        const num = this._trailSegmentNumbers[lastParticle];
        const tempTrailSegment = new TrailSegment();
        for (let i = 0; i < num; i++) {
            this.setTrailSegmentAt(handle, i, this.getTrailSegmentAt(lastParticle, i, tempTrailSegment));
        }
        this._startTrailSegmentIndices[handle] = this._startTrailSegmentIndices[lastParticle];
        this._endTrailSegmentIndices[handle] = this._endTrailSegmentIndices[lastParticle];
        this._trailSegmentNumbers[handle] = this._trailSegmentNumbers[lastParticle];
        this._count -= 1;
    }

    clearParticleEventSnapshots () {
        this._snapshotUsed = 0;
    }

    recordParticleEventSnapshot (handle: ParticleHandle, reason: RecordReason) {
        if (this._snapshotUsed === this._particleSnapshots.length) {
            for (let i = 0; i < this._snapshotUsed; i++) {
                this._particleSnapshots.push(new ParticleSnapshot());
            }
        }
        const particleSnapshot = this._particleSnapshots[this._snapshotUsed];
        this.getPositionAt(particleSnapshot.position, handle);
        this.getFinalVelocityAt(particleSnapshot.finalVelocity, handle);
        this.getRotationAt(particleSnapshot.rotation, handle);
        this.getSizeAt(particleSnapshot.size, handle);
        this.getColorAt(particleSnapshot.color, handle);
        particleSnapshot.randomSeed = this._randomSeed[handle];
        particleSnapshot.invStartLifeTime = this._invStartLifeTime[handle];
        particleSnapshot.normalizedAliveTime = this._normalizedAliveTime[handle];
        particleSnapshot.recordReason = reason;
        this._snapshotUsed++;
    }

    resetParticle (handle: ParticleHandle) {
        this._positionX[handle] = 0;
        this._positionY[handle] = 0;
        this._positionZ[handle] = 0;
        this._velocityX[handle] = 0;
        this._velocityY[handle] = 0;
        this._velocityZ[handle] = 0;
        this._startDirX[handle] = 0;
        this._startDirY[handle] = 0;
        // init as particleEmitZAxis
        this._startDirZ[handle] = 1;
        this._animatedVelocityX[handle] = 0;
        this._animatedVelocityY[handle] = 0;
        this._animatedVelocityZ[handle] = 0;
        this._speedModifier[handle] = 1;
        this._rotationX[handle] = 0;
        this._rotationY[handle] = 0;
        this._rotationZ[handle] = 0;
        this._axisOfRotationX[handle] = 0;
        this._axisOfRotationY[handle] = 0;
        this._axisOfRotationZ[handle] = 0;
        this._angularVelocityX[handle] = 0;
        this._angularVelocityY[handle] = 0;
        this._angularVelocityZ[handle] = 0;
        this._startSizeX[handle] = 1;
        this._startSizeY[handle] = 1;
        this._startSizeZ[handle] = 1;
        this._sizeX[handle] = 1;
        this._sizeY[handle] = 1;
        this._sizeZ[handle] = 1;
        this._startColor[handle] = Color.toUint32(Color.WHITE);
        this._color[handle] = Color.toUint32(Color.WHITE);
        this._randomSeed[handle] = 0;
        this._invStartLifeTime[handle] = 1;
        this._normalizedAliveTime[handle] = 0;
        this._frameIndex[handle] = 0;
        this._noiseX[handle] = 0;
        this._noiseY[handle] = 0;
        this._noiseZ[handle] = 0;
        for (let i = 0; i < MAX_SUB_EMITTER_ACCUMULATOR; i++) {
            this._subEmitterAccumulators[handle * MAX_SUB_EMITTER_ACCUMULATOR + i] = 0;
        }
        this._startTrailSegmentIndices[handle] = 0;
        this._endTrailSegmentIndices[handle] = 0;
        this._trailSegmentNumbers[handle] = 0;
    }

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldPositionX = this._positionX;
        const oldPositionY = this._positionY;
        const oldPositionZ = this._positionZ;
        const oldVelocityX = this._velocityX;
        const oldVelocityY = this._velocityY;
        const oldVelocityZ = this._velocityZ;
        const oldStartDirX = this._startDirX;
        const oldStartDirY = this._startDirY;
        const oldStartDirZ = this._startDirZ;
        const oldAnimatedVelocityX = this._animatedVelocityX;
        const oldAnimatedVelocityY = this._animatedVelocityY;
        const oldAnimatedVelocityZ = this._animatedVelocityZ;
        const oldRotationX = this._rotationX;
        const oldRotationY = this._rotationY;
        const oldRotationZ = this._rotationZ;
        const oldAxisOfRotationX = this._axisOfRotationX;
        const oldAxisOfRotationY = this._axisOfRotationY;
        const oldAxisOfRotationZ = this._axisOfRotationZ;
        const oldAngularVelocityX = this._angularVelocityX;
        const oldAngularVelocityY = this._angularVelocityY;
        const oldAngularVelocityZ = this._angularVelocityZ;
        const oldStartSizeX = this._startSizeX;
        const oldStartSizeY = this._startSizeY;
        const oldStartSizeZ = this._startSizeZ;
        const oldSizeX = this._sizeX;
        const oldSizeY = this._sizeY;
        const oldSizeZ = this._sizeZ;
        const oldStartColor = this._startColor;
        const oldColor = this._color;
        const oldRandomSeed = this._randomSeed;
        const oldInvStartLifeTime = this._invStartLifeTime;
        const oldNormalizedAliveTime = this._normalizedAliveTime;
        const oldFrameIndex = this._frameIndex;
        const oldNoiseSumX = this._noiseX;
        const oldNoiseSumY = this._noiseY;
        const oldNoiseSumZ = this._noiseZ;
        const oldSubEmitterAccumulators = this._subEmitterAccumulators;
        const oldTrailSegmentNumbers = this._trailSegmentNumbers;
        const oldStartTrailSegmentIndices = this._startTrailSegmentIndices;
        const oldEndTrailSegmentIndices = this._endTrailSegmentIndices;
        const oldTrailSegments = this._trailSegments;
        const oldSpeedModifier = this._speedModifier;
        this._positionX = new Float32Array(capacity);
        this._positionX.set(oldPositionX);
        this._positionY = new Float32Array(capacity);
        this._positionY.set(oldPositionY);
        this._positionZ = new Float32Array(capacity);
        this._positionZ.set(oldPositionZ);
        this._velocityX = new Float32Array(capacity);
        this._velocityX.set(oldVelocityX);
        this._velocityY = new Float32Array(capacity);
        this._velocityY.set(oldVelocityY);
        this._velocityZ = new Float32Array(capacity);
        this._velocityZ.set(oldVelocityZ);
        this._startDirX = new Float32Array(capacity);
        this._startDirX.set(oldStartDirX);
        this._startDirY = new Float32Array(capacity);
        this._startDirY.set(oldStartDirY);
        this._startDirZ = new Float32Array(capacity);
        this._startDirZ.set(oldStartDirZ);
        this._animatedVelocityX = new Float32Array(capacity);
        this._animatedVelocityX.set(oldAnimatedVelocityX);
        this._animatedVelocityY = new Float32Array(capacity);
        this._animatedVelocityY.set(oldAnimatedVelocityY);
        this._animatedVelocityZ = new Float32Array(capacity);
        this._animatedVelocityZ.set(oldAnimatedVelocityZ);
        this._speedModifier = new Float32Array(capacity);
        this._speedModifier.set(oldSpeedModifier);
        this._rotationX = new Float32Array(capacity);
        this._rotationX.set(oldRotationX);
        this._rotationY = new Float32Array(capacity);
        this._rotationY.set(oldRotationY);
        this._rotationZ = new Float32Array(capacity);
        this._rotationZ.set(oldRotationZ);
        this._axisOfRotationX = new Float32Array(capacity);
        this._axisOfRotationX.set(oldAxisOfRotationX);
        this._axisOfRotationY = new Float32Array(capacity);
        this._axisOfRotationY.set(oldAxisOfRotationY);
        this._axisOfRotationZ = new Float32Array(capacity);
        this._axisOfRotationZ.set(oldAxisOfRotationZ);
        this._angularVelocityX = new Float32Array(capacity);
        this._angularVelocityX.set(oldAngularVelocityX);
        this._angularVelocityY = new Float32Array(capacity);
        this._angularVelocityY.set(oldAngularVelocityY);
        this._angularVelocityZ = new Float32Array(capacity);
        this._angularVelocityZ.set(oldAngularVelocityZ);
        this._startSizeX = new Float32Array(capacity);
        this._startSizeX.set(oldStartSizeX);
        this._startSizeY = new Float32Array(capacity);
        this._startSizeY.set(oldStartSizeY);
        this._startSizeZ = new Float32Array(capacity);
        this._startSizeZ.set(oldStartSizeZ);
        this._sizeX = new Float32Array(capacity);
        this._sizeX.set(oldSizeX);
        this._sizeY = new Float32Array(capacity);
        this._sizeY.set(oldSizeY);
        this._sizeZ = new Float32Array(capacity);
        this._sizeZ.set(oldSizeZ);
        this._startColor = new Uint32Array(capacity);
        this._startColor.set(oldStartColor);
        this._color = new Uint32Array(capacity);
        this._color.set(oldColor);
        this._randomSeed = new Uint32Array(capacity);
        this._randomSeed.set(oldRandomSeed);
        this._invStartLifeTime = new Float32Array(capacity);
        this._invStartLifeTime.set(oldInvStartLifeTime);
        this._normalizedAliveTime = new Float32Array(capacity);
        this._normalizedAliveTime.set(oldNormalizedAliveTime);
        this._frameIndex = new Float32Array(capacity);
        this._frameIndex.set(oldFrameIndex);
        this._noiseX = new Float32Array(capacity);
        this._noiseX.set(oldNoiseSumX);
        this._noiseY = new Float32Array(capacity);
        this._noiseY.set(oldNoiseSumY);
        this._noiseZ = new Float32Array(capacity);
        this._noiseZ.set(oldNoiseSumZ);
        this._subEmitterAccumulators = new Float32Array(capacity * MAX_SUB_EMITTER_ACCUMULATOR);
        this._subEmitterAccumulators.set(oldSubEmitterAccumulators);
        this._trailSegmentNumbers = new Uint16Array(capacity);
        this._trailSegmentNumbers.set(oldTrailSegmentNumbers);
        this._startTrailSegmentIndices = new Uint16Array(capacity);
        this._startTrailSegmentIndices.set(oldStartTrailSegmentIndices);
        this._endTrailSegmentIndices = new Uint16Array(capacity);
        this._endTrailSegmentIndices.set(oldEndTrailSegmentIndices);
        this._trailSegments = new Float32Array(capacity * this._trailSegmentCapacityPerParticle * this._trailSegmentStride);
        this._trailSegments.set(oldTrailSegments);
    }

    clear () {
        this._count = 0;
    }
}
