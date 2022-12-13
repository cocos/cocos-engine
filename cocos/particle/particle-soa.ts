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

    addParticle (): ParticleHandle {
        if (this._count >= this._capacity) {
            this.reserve(this._capacity * 2);
        }
        const handle = this._count;
        this._count++;
        return handle;
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
        if (shouldGrow) {
            this._positionX = new Float32Array(this._capacity);
            this._positionX.set(oldPositionX);
            this._positionY = new Float32Array(this._capacity);
            this._positionY.set(oldPositionY);
            this._positionZ = new Float32Array(this._capacity);
            this._positionZ.set(oldPositionZ);
            this._velocityX = new Float32Array(this._capacity);
            this._velocityX.set(oldVelocityX);
            this._velocityY = new Float32Array(this._capacity);
            this._velocityY.set(oldVelocityY);
            this._velocityZ = new Float32Array(this._capacity);
            this._velocityZ.set(oldVelocityZ);
            this._animatedVelocityX = new Float32Array(this._capacity);
            this._animatedVelocityX.set(oldAnimatedVelocityX);
            this._animatedVelocityY = new Float32Array(this._capacity);
            this._animatedVelocityY.set(oldAnimatedVelocityY);
            this._animatedVelocityZ = new Float32Array(this._capacity);
            this._animatedVelocityZ.set(oldAnimatedVelocityZ);
            this._rotationX = new Float32Array(this._capacity);
            this._rotationX.set(oldRotationX);
            this._rotationY = new Float32Array(this._capacity);
            this._rotationY.set(oldRotationY);
            this._rotationZ = new Float32Array(this._capacity);
            this._rotationZ.set(oldRotationZ);
            this._axisOfRotationX = new Float32Array(this._capacity);
            this._axisOfRotationX.set(oldAxisOfRotationX);
            this._axisOfRotationY = new Float32Array(this._capacity);
            this._axisOfRotationY.set(oldAxisOfRotationY);
            this._axisOfRotationZ = new Float32Array(this._capacity);
            this._axisOfRotationZ.set(oldAxisOfRotationZ);
            this._angularVelocityX = new Float32Array(this._capacity);
            this._angularVelocityX.set(oldAngularVelocityX);
            this._angularVelocityY = new Float32Array(this._capacity);
            this._angularVelocityY.set(oldAngularVelocityY);
            this._angularVelocityZ = new Float32Array(this._capacity);
            this._angularVelocityZ.set(oldAngularVelocityZ);
            this._startSizeX = new Float32Array(this._capacity);
            this._startSizeY = new Float32Array(this._capacity);
            this._startSizeZ = new Float32Array(this._capacity);
            this._sizeX = new Float32Array(this._capacity);
            this._sizeY = new Float32Array(this._capacity);
            this._sizeZ = new Float32Array(this._capacity);
            this._startColor = new Uint32Array(this._capacity);
            this._color = new Uint32Array(this._capacity);
            this._randomSeed = new Uint32Array(this._capacity);
            this._invStartLifeTime = new Float32Array(this._capacity);
            this._normalizedAliveTime = new Float32Array(this._capacity);
        }
    }

    clear () {
        this._count = 0;
    }
}
