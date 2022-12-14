import { assert } from '../core';

export enum SOADataChannel {
    X,
    Y,
    Z,
}

export type ParticleHandle = number;

export const INVALID_HANDLE = -1;

export class ParticleSOA {
    private _count = 0;
    private _capacity = 16;
    private _positionX = new Float32Array(this._capacity);
    private _positionY = new Float32Array(this._capacity);
    private _positionZ = new Float32Array(this._capacity);
    private _velocityX = new Float32Array(this._capacity);
    private _velocityY = new Float32Array(this._capacity);
    private _velocityZ = new Float32Array(this._capacity);
    private _animatedVelocityX = new Float32Array(this._capacity);
    private _animatedVelocityY = new Float32Array(this._capacity);
    private _animatedVelocityZ = new Float32Array(this._capacity);
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
    private _frameIndex = new Uint16Array(this._capacity);

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

    getPositionChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._positionX;
        case SOADataChannel.Y:
            return this._positionY;
        default:
            return this._positionZ;
        }
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

    getVelocityChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._velocityX;
        case SOADataChannel.Y:
            return this._velocityY;
        default:
            return this._velocityZ;
        }
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

    getAnimatedVelocityChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._animatedVelocityX;
        case SOADataChannel.Y:
            return this._animatedVelocityY;
        default:
            return this._animatedVelocityZ;
        }
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

    getRotationChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._rotationX;
        case SOADataChannel.Y:
            return this._rotationY;
        default:
            return this._rotationZ;
        }
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

    getAxisOfRotationChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._axisOfRotationX;
        case SOADataChannel.Y:
            return this._axisOfRotationY;
        default:
            return this._axisOfRotationZ;
        }
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

    getAngularVelocityChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._angularVelocityX;
        case SOADataChannel.Y:
            return this._angularVelocityY;
        default:
            return this._angularVelocityZ;
        }
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

    getSizeChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._sizeX;
        case SOADataChannel.Y:
            return this._sizeY;
        default:
            return this._sizeZ;
        }
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

    getStartSizeChannel (chanel: SOADataChannel) {
        switch (chanel) {
        case SOADataChannel.X:
            return this._startSizeX;
        case SOADataChannel.Y:
            return this._startSizeY;
        default:
            return this._startSizeZ;
        }
    }

    get startColor () {
        return this._startColor;
    }

    get color () {
        return this._color;
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

    addParticle (): ParticleHandle {
        if (this._count >= this._capacity) {
            this.reserve(this._capacity * 2);
        }
        const handle = this._count;
        this._count++;
        return handle;
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
        this._animatedVelocityX[handle] = this._animatedVelocityX[lastParticle];
        this._animatedVelocityY[handle] = this._animatedVelocityY[lastParticle];
        this._animatedVelocityZ[handle] = this._animatedVelocityZ[lastParticle];
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
        this._count -= 1;
    }

    reserve (capacity: number) {
        if (capacity === this._capacity) return;
        const shouldGrow = capacity > this._capacity;
        this._capacity = capacity;
        const oldPositionX = this._positionX;
        const oldPositionY = this._positionY;
        const oldPositionZ = this._positionZ;
        const oldVelocityX = this._velocityX;
        const oldVelocityY = this._velocityY;
        const oldVelocityZ = this._velocityZ;
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
        if (shouldGrow) {
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
            this._animatedVelocityX = new Float32Array(capacity);
            this._animatedVelocityX.set(oldAnimatedVelocityX);
            this._animatedVelocityY = new Float32Array(capacity);
            this._animatedVelocityY.set(oldAnimatedVelocityY);
            this._animatedVelocityZ = new Float32Array(capacity);
            this._animatedVelocityZ.set(oldAnimatedVelocityZ);
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
            this._frameIndex = new Uint16Array(capacity);
            this._frameIndex.set(oldFrameIndex);
        } else {
            if (this._count > capacity) {
                this._count = capacity;
            }
            this._positionX = oldPositionX.slice(0, capacity);
            this._positionY = oldPositionY.slice(0, capacity);
            this._positionZ = oldPositionZ.slice(0, capacity);
            this._velocityX = oldVelocityX.slice(0, capacity);
            this._velocityY = oldVelocityY.slice(0, capacity);
            this._velocityZ = oldVelocityZ.slice(0, capacity);
            this._animatedVelocityX = oldAnimatedVelocityX.slice(0, capacity);
            this._animatedVelocityY = oldAnimatedVelocityY.slice(0, capacity);
            this._animatedVelocityZ = oldAnimatedVelocityZ.slice(0, capacity);
            this._rotationX = oldRotationX.slice(0, capacity);
            this._rotationY = oldRotationY.slice(0, capacity);
            this._rotationZ = oldRotationZ.slice(0, capacity);
            this._axisOfRotationX = oldAxisOfRotationX.slice(0, capacity);
            this._axisOfRotationY = oldAxisOfRotationY.slice(0, capacity);
            this._axisOfRotationZ = oldAxisOfRotationZ.slice(0, capacity);
            this._angularVelocityX = oldAngularVelocityX.slice(0, capacity);
            this._angularVelocityY = oldAngularVelocityY.slice(0, capacity);
            this._angularVelocityZ = oldAngularVelocityZ.slice(0, capacity);
            this._startSizeX = oldStartSizeX.slice(0, capacity);
            this._startSizeY = oldStartSizeY.slice(0, capacity);
            this._startSizeZ = oldStartSizeZ.slice(0, capacity);
            this._sizeX = oldSizeX.slice(0, capacity);
            this._sizeY = oldSizeY.slice(0, capacity);
            this._sizeZ = oldSizeZ.slice(0, capacity);
            this._startColor = oldStartColor.slice(0, capacity);
            this._color = oldColor.slice(0, capacity);
            this._randomSeed = oldRandomSeed.slice(0, capacity);
            this._invStartLifeTime = oldInvStartLifeTime.slice(0, capacity);
            this._normalizedAliveTime = oldNormalizedAliveTime.slice(0, capacity);
            this._frameIndex = oldFrameIndex.slice(0, capacity);
        }
    }

    clear () {
        this._count = 0;
    }
}
