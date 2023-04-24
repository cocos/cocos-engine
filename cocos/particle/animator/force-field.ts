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

import { EPSILON, Mat3, Mat4, pseudoRandom, Quat, Vec2, Vec3 } from '../../core';
import { Particle } from '../particle';
import { ParticleSystem } from '../particle-system';
import { ShapeType, Space } from '../enum';
import CurveRange from './curve-range';

export const ForceRandSeed = {
    FORCE: 212165,
    ForcesRotationRandomnessXId: 2222344,
    ForcesRotationRandomnessYId: 4432133,
    DirectionX: 55533123,
    DirectionY: 55533124,
    DirectionZ: 55533125,
    GRAVITY: 66663324,
    RotationSpeed: 1021334,
    RotationAttraction: 1021335,
    DRAG: 10314145,
};

const _temp_world_pos = new Vec3();
const _temp_local_pos = new Vec3();

export default class ForceField {
    private _mode;
    private _fieldLocalToWorld: Mat4;
    private _multiplier: CurveRange;

    private _startRange: number;
    private _endRange: number;
    private _length: number;
    private _gravityFocus: number;
    private _rotationRandomness: Vec2;
    private _multiplyDragByParticleSize: boolean;
    private _multiplyDragByParticleVelocity: boolean;

    private _directionCacheX: CurveRange | undefined;
    private _directionCacheY: CurveRange | undefined;
    private _directionCacheZ: CurveRange | undefined;
    private _gravityCache: CurveRange | undefined;
    private _rotationSpeedCache: CurveRange | undefined;
    private _rotationAttractionCache: CurveRange | undefined;
    private _dragCache: CurveRange | undefined;

    private _directionFactor: Vec3;
    private _gravityFactor: number;
    private _rotationSpeedFactor: number;
    private _rotationAttractionFactor: number;
    private _vectorSpeedFactor: number;
    private _vectorAttractionFactor: number;
    private _dragFactor: number;

    private _toForce: Vec3;
    private _toForceOriginal: Vec3;
    private _toForceTangent: Vec3;
    private _rotationEuler: Vec3;
    private _rotationQ: Quat;
    private _rotationMat: Mat3;
    private _rotationTranspose: Mat3;
    private _rsMat: Mat3;
    private _velocity: Vec3;
    private _velMag: Vec3;
    private _velNormalized: Vec3;

    private _fieldWorldToLocal: Mat4;
    private _fieldScale: Vec3;
    private _fieldCenter: Vec3;
    private _forceTransform: Mat4;
    private _forceInvTransform: Mat4;

    public set mode (value) {
        this._mode = value;
    }

    public set multiplier (value: CurveRange) {
        this._multiplier = value;
    }

    public set fieldLocalToWorld (value: Mat4) {
        this._fieldLocalToWorld.set(value);
    }

    public set startRange (value) {
        this._startRange = value;
    }

    public set endRange (value) {
        this._endRange = value;
    }

    public set length (value) {
        this._length = value;
    }

    public set gravityFocus (value) {
        this._gravityFocus = value;
    }

    public setRotationRandomness (x, y) {
        this._rotationRandomness.x = x;
        this._rotationRandomness.y = y;
    }

    public set multiplyDragByParticleSize (value: boolean) {
        this._multiplyDragByParticleSize = value;
    }

    public set multiplyDragByParticleVelocity (value: boolean) {
        this._multiplyDragByParticleVelocity = value;
    }

    public set directionCacheX (value: CurveRange) {
        this._directionCacheX = value;
    }

    public set directionCacheY (value: CurveRange) {
        this._directionCacheY = value;
    }

    public set directionCacheZ (value: CurveRange) {
        this._directionCacheZ = value;
    }

    public set gravityCache (value: CurveRange) {
        this._gravityCache = value;
    }

    public set rotationSpeedCache (value: CurveRange) {
        this._rotationSpeedCache = value;
    }

    public set rotationAttractionCache (value: CurveRange) {
        this._rotationAttractionCache = value;
    }

    public set dragCache (value: CurveRange) {
        this._dragCache = value;
    }

    constructor () {
        this._multiplier = new CurveRange();
        this._multiplier.constant = 1;

        this._mode = ShapeType.Box;
        this._fieldLocalToWorld = new Mat4();
        this._startRange = 0;
        this._endRange = 1;
        this._length = 0;
        this._gravityFocus = 0;
        this._rotationRandomness = new Vec2();
        this._multiplyDragByParticleSize = true;
        this._multiplyDragByParticleVelocity = true;

        this._directionFactor = new Vec3();
        this._gravityFactor = 0;
        this._rotationSpeedFactor = 0;
        this._rotationAttractionFactor = 0;
        this._vectorSpeedFactor = 0;
        this._vectorAttractionFactor = 0;
        this._dragFactor = 0;

        this._toForce = new Vec3();
        this._toForceOriginal = new Vec3();
        this._toForceTangent = new Vec3();
        this._rotationEuler = new Vec3();
        this._rotationQ = new Quat();
        this._rotationMat = new Mat3();
        this._rotationTranspose = new Mat3();
        this._rsMat = new Mat3();
        this._velocity = new Vec3();
        this._velMag = new Vec3();
        this._velNormalized = new Vec3();

        this._fieldWorldToLocal = new Mat4();
        this._fieldScale = new Vec3();
        this._fieldCenter = new Vec3();
        this._forceTransform = new Mat4();
        this._forceInvTransform = new Mat4();
    }

    private checkOutside (distanceFromCenter: number, startRangeVec: number, endRangeVec: number, toForceOriginal: Vec3): boolean {
        let outsideVolume: boolean = (distanceFromCenter > endRangeVec) || (distanceFromCenter < startRangeVec);
        if (this._mode === ShapeType.Hemisphere) {
            outsideVolume = outsideVolume || (toForceOriginal.y < 0);
        }
        return outsideVolume;
    }

    private checkInSphere (pointA: Vec3, pointB: Vec3, radius: number): boolean {
        return Vec3.distance(pointA, pointB) <= radius;
    }

    public updateFirst () {
        this._multiplier.bake();
        if (this._directionCacheX) {
            this._directionCacheX.bake();
        }
        if (this._directionCacheY) {
            this._directionCacheY.bake();
        }
        if (this._directionCacheZ) {
            this._directionCacheZ.bake();
        }
        if (this._gravityCache) {
            this._gravityCache.bake();
        }
        if (this._rotationSpeedCache) {
            this._rotationSpeedCache.bake();
        }
        if (this._rotationAttractionCache) {
            this._rotationAttractionCache.bake();
        }
        if (this._dragCache) {
            this._dragCache.bake();
        }
    }

    private apply (p: Particle, dt: number, worldToLocal: Mat4, localToWorld: Mat4, multiplier: CurveRange) {
        if (this._endRange === 0.0) {
            return;
        }

        const startRangeVec = this._startRange;
        const endRangeVec = this._endRange;
        const invEndRangeVec = 1.0 / endRangeVec;
        const lengthHalf = (this._length * 0.5);
        const rangeRatioVec = (startRangeVec / endRangeVec);
        const rangeWidthVec = (endRangeVec - startRangeVec);
        const rangeWidthRatioVec = endRangeVec / rangeWidthVec;
        const gravityFocusDistance = rangeWidthVec * this._gravityFocus + startRangeVec;
        const dragUsesSize = this._multiplyDragByParticleSize ? 0xffffffff : 0;
        const dragUsesVelocity = this._multiplyDragByParticleVelocity ? 0xffffffff : 0;

        const rotationRandomnessX = 2.0 * Math.PI * this._rotationRandomness.x;
        const rotationRandomnessY = 2.0 * Math.PI * this._rotationRandomness.y;
        const hasRandomRotation = (Math.abs(rotationRandomnessX) > EPSILON || Math.abs(rotationRandomnessY) > EPSILON);

        const normalizedTime = 1.0 - p.remainingLifetime / p.startLifetime;
        const forceRandom = pseudoRandom(p.randomSeed + ForceRandSeed.FORCE);
        const forceMultiplier = multiplier.evaluate(normalizedTime, forceRandom);

        Vec3.transformMat4(this._toForce, _temp_local_pos, worldToLocal);

        if (hasRandomRotation) {
            this._rotationEuler.x = (pseudoRandom(p.randomSeed + ForceRandSeed.ForcesRotationRandomnessXId) - 0.5) * rotationRandomnessX;
            this._rotationEuler.z = (pseudoRandom(p.randomSeed + ForceRandSeed.ForcesRotationRandomnessYId) - 0.5) * rotationRandomnessY;
            Quat.fromEuler(this._rotationQ, this._rotationEuler.x, this._rotationEuler.y, this._rotationEuler.z);
            Mat3.fromQuat(this._rotationMat, this._rotationQ);
            Mat3.transpose(this._rotationTranspose, this._rotationMat);
            Vec3.transformMat3(this._toForce, this._toForce, this._rotationMat);
        }

        this._toForceTangent.set(this._toForce.z, 0.0, -this._toForce.x);
        this._toForceOriginal.set(this._toForce);

        let distanceFromCenter = 0.0;
        if (this._mode === ShapeType.Box) {
            distanceFromCenter = Math.max(Math.abs(this._toForce.x), Math.max(Math.abs(this._toForce.y), Math.abs(this._toForce.z)));
        } else {
            distanceFromCenter = this._toForce.length();
        }

        let normalizedDistance = Math.min(distanceFromCenter, endRangeVec) * invEndRangeVec;
        normalizedDistance = Math.max((normalizedDistance - rangeRatioVec) * rangeWidthRatioVec, 0.0);

        const outsideVolume = this.checkOutside(distanceFromCenter, startRangeVec, endRangeVec, this._toForceOriginal);

        if (outsideVolume) {
            return;
        }

        if (this._directionCacheX && this._directionCacheY && this._directionCacheZ) {
            if (this._directionCacheX.getMaxAbs() !== 0.0 || this._directionCacheY.getMaxAbs() !== 0.0 || this._directionCacheZ.getMaxAbs() !== 0.0) {
                const randX = pseudoRandom(p.randomSeed + ForceRandSeed.DirectionX);
                const randY = pseudoRandom(p.randomSeed + ForceRandSeed.DirectionY);
                const randZ = pseudoRandom(p.randomSeed + ForceRandSeed.DirectionZ);
                this._directionFactor.x = this._directionCacheX.evaluate(normalizedDistance, randX);
                this._directionFactor.y = this._directionCacheY.evaluate(normalizedDistance, randY);
                this._directionFactor.z = this._directionCacheZ.evaluate(normalizedDistance, randZ);
                this._directionFactor.x = outsideVolume ? 0.0 : this._directionFactor.x;
                this._directionFactor.y = outsideVolume ? 0.0 : this._directionFactor.y;
                this._directionFactor.z = outsideVolume ? 0.0 : this._directionFactor.z;
                Mat3.fromMat4(this._rsMat, localToWorld);
                Vec3.transformMat3(this._directionFactor, this._directionFactor, this._rsMat);

                p.velocity.add(this._directionFactor.multiplyScalar(dt * forceMultiplier));
            }
        }

        if (this._gravityCache && this._gravityCache.getMaxAbs() !== 0.0) {
            if (hasRandomRotation) {
                Vec3.transformMat3(this._toForce, this._toForce, this._rotationTranspose);
            }
            if (this._rsMat.equals(Mat3.IDENTITY, 0.0)) {
                Mat3.fromMat4(this._rsMat, localToWorld);
            }
            Vec3.transformMat3(this._toForce, this._toForce, this._rsMat);
            Vec3.normalize(this._toForce, this._toForce);
            const randGravity = pseudoRandom(p.randomSeed + ForceRandSeed.GRAVITY);
            this._gravityFactor = -this._gravityCache.evaluate(normalizedDistance, randGravity) * forceMultiplier;
            this._gravityFactor = outsideVolume ? 0.0 : this._gravityFactor;
            if (gravityFocusDistance > distanceFromCenter) {
                this._toForce.set(-this._toForce.x, -this._toForce.y, -this._toForce.z);
            }

            p.velocity.add3f(this._toForce.x * this._gravityFactor, this._toForce.y * this._gravityFactor, this._toForce.z * this._gravityFactor);
        }

        if (this._rotationSpeedCache && this._rotationAttractionCache) {
            if (this._rotationSpeedCache.getMaxAbs() !== 0.0 && this._rotationAttractionCache.getMaxAbs() !== 0.0) {
                if (hasRandomRotation) {
                    Vec3.transformMat3(this._toForceTangent, this._toForceTangent, this._rotationTranspose);
                }
                if (this._rsMat.equals(Mat3.IDENTITY, 0.0)) {
                    Mat3.fromMat4(this._rsMat, localToWorld);
                }
                Vec3.transformMat3(this._toForceTangent, this._toForceTangent, this._rsMat);
                Vec3.normalize(this._toForceTangent, this._toForceTangent);
                const randSpeed = pseudoRandom(p.randomSeed + ForceRandSeed.RotationSpeed);
                const randAttract = pseudoRandom(p.randomSeed + ForceRandSeed.RotationAttraction);
                this._rotationSpeedFactor = this._rotationSpeedCache.evaluate(normalizedDistance, randSpeed) * forceMultiplier;
                this._rotationAttractionFactor = this._rotationAttractionCache.evaluate(normalizedDistance, randAttract) * forceMultiplier;
                this._rotationAttractionFactor = outsideVolume ? 0.0 : this._rotationAttractionFactor;
                Vec3.multiplyScalar(this._toForceTangent, this._toForceTangent, this._rotationSpeedFactor);

                p.velocity.add3f((this._toForceTangent.x - p.velocity.x) * this._rotationAttractionFactor,
                    (this._toForceTangent.y - p.velocity.y) * this._rotationAttractionFactor,
                    (this._toForceTangent.z - p.velocity.z) * this._rotationAttractionFactor);
            }
        }

        if (this._dragCache && this._dragCache.getMaxAbs() !== 0.0) {
            const randDrag = pseudoRandom(p.randomSeed + ForceRandSeed.DRAG);
            this._dragFactor = this._dragCache.evaluate(normalizedDistance, randDrag);
            Vec3.add(this._velocity, p.velocity, p.animatedVelocity);
            const magSqr = Vec3.dot(this._velocity, this._velocity);
            let maxDimension = Math.max(p.size.x, Math.max(p.size.y, p.size.z));
            maxDimension *= 0.5;
            const circleArea = Math.PI * maxDimension * maxDimension;
            let drag = this._dragFactor;
            drag *= dragUsesSize !== 0 ? circleArea : 1.0;
            drag *= dragUsesVelocity !== 0 ? magSqr : 1.0;
            drag = outsideVolume ? 0.0 : drag;
            let mag = Math.sqrt(magSqr);
            if (mag < EPSILON) {
                this._velNormalized.set(0.0, 0.0, 0.0);
            } else {
                this._velNormalized.x = this._velocity.x / mag;
                this._velNormalized.y = this._velocity.y / mag;
                this._velNormalized.z = this._velocity.z / mag;
            }
            mag = Math.max(0.0, mag - drag * dt * forceMultiplier);
            Vec3.multiplyScalar(this._velocity, this._velNormalized, mag);

            Vec3.subtract(p.velocity, this._velocity, p.animatedVelocity);
        }
    }

    public update (p: Particle, dt: number, psLocalToWorld: Mat4, psWorldToLocal: Mat4) {
        Mat4.invert(this._fieldWorldToLocal, this._fieldLocalToWorld);
        Mat4.multiply(this._forceTransform, this._fieldWorldToLocal, psLocalToWorld);
        Mat4.multiply(this._forceInvTransform, psWorldToLocal, this._fieldLocalToWorld);

        Mat4.getScaling(this._fieldScale, this._fieldLocalToWorld);
        const scale = Math.max(Math.abs(this._fieldScale.x), Math.max(Math.abs(this._fieldScale.y), Math.abs(this._fieldScale.z)));
        const sphereRadius = this._endRange * scale;
        this._fieldLocalToWorld.getTranslation(this._fieldCenter);

        if (p.particleSystem.simulationSpace !== Space.World) {
            Vec3.transformMat4(_temp_world_pos, p.position, psLocalToWorld);
            _temp_local_pos.set(p.position);
        } else {
            Vec3.transformMat4(_temp_local_pos, p.position, psWorldToLocal);
            _temp_world_pos.set(p.position);
        }

        if (this.checkInSphere(_temp_world_pos, this._fieldCenter, sphereRadius)) {
            this.apply(p, dt, this._forceTransform, this._forceInvTransform, this._multiplier);
        }
    }
}
