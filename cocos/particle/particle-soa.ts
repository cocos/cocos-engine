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

    get velocityX () {
        return this._velocityX;
    }

    get velocityY () {
        return this._velocityY;
    }

    get velocityZ () {
        return this._velocityZ;
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

    get randomSeed () {
        return this._randomSeed;
    }

    get invStartLifeTime () {
        return this._invStartLifeTime;
    }

    get normalizedAliveTime () {
        return this._normalizedAliveTime;
    }

    clear () {
        this._count = 0;
    }
}
