import { randomUnitVector, particleEmitZAxis, randomSortArray, randomSign, randomPointBetweenSphere, randomPointInCube, randomPointBetweenCircleAtFixedAngle, fixedAngleUnitVector2 } from '../particle-general-function';
import { vec3, vec2, random, randomRange, mat4, quat, clamp, repeat, pingPong, toRadian, toDegree } from '../../../../core/vmath';
import { Enum, Vec3 } from '../../../../core/value-types';
import CurveRange from '../animator/curve-range';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';
import { ParticleSystemComponent } from '../particle-system-component';

// tslint:disable: max-line-length
const _intermediVec = vec3.create(0, 0, 0);
const _intermediArr = new Array();
const _unitBoxExtent = vec3.create(0.5, 0.5, 0.5);

const ShapeType = Enum({
    Box: 0,
    Circle: 1,
    Cone: 2,
    Sphere: 3,
    Hemisphere: 4,
});

const EmitLocation = Enum({
    Base: 0,
    Edge: 1,
    Shell: 2,
    Volume: 3,
});

const ArcMode = Enum({
    Random: 0,
    Loop: 1,
    PingPong: 2,
});

@ccclass('cc.ShapeModule')
export default class ShapeModule {

    @property({
        displayOrder: 0,
    })
    public enable = false;

    @property({
        type: ShapeType,
        displayOrder: 1,
    })
    public shapeType = ShapeType.Box;

    @property({
        type: EmitLocation,
        displayOrder: 2,
    })
    public emitFrom = EmitLocation.Volume;

    @property
    private _position = new Vec3(0, 0, 0);

    @property({
        displayOrder: 12,
    })
    get position () {
        return this._position;
    }
    set position (val) {
        this._position = val;
        this.constructMat();
    }

    @property
    private _rotation = new Vec3(0, 0, 0);

    @property({
        displayOrder: 13,
    })
    get rotation () {
        return this._rotation;
    }
    set rotation (val) {
        this._rotation = val;
        this.constructMat();
    }

    @property
    private _scale = new Vec3(1, 1, 1);

    @property({
        displayOrder: 14,
    })
    get scale () {
        return this._scale;
    }
    set scale (val) {
        this._scale = val;
        this.constructMat();
    }

    @property({
        displayOrder: 15,
    })
    public alignToDirection = false;

    @property({
        displayOrder: 16,
    })
    public randomDirectionAmount = 0;

    @property({
        displayOrder: 17,
    })
    public sphericalDirectionAmount = 0;

    @property({
        displayOrder: 18,
    })
    public randomPositionAmount = 0;

    @property({
        displayOrder: 3,
    })
    public radius = 1;

    @property({
        displayOrder: 4,
    })
    public radiusThickness = 1;

    @property
    private _arc = toRadian(360);

    @property({
        displayOrder: 6,
    })
    get arc () {
        return toDegree(this._arc);
    }

    set arc (val) {
        this._arc = toRadian(val);
    }

    @property({
        type: ArcMode,
        displayOrder: 7,
    })
    public arcMode = ArcMode.Random;

    @property({
        displayOrder: 0,
    })
    public arcSpread = 8;

    @property({
        type: CurveRange,
        displayOrder: 9,
    })
    public arcSpeed = new CurveRange();

    @property
    private _angle = toRadian(25);

    @property({
        displayOrder: 5,
    })
    get angle () {
        return toDegree(this._angle);
    }

    set angle (val) {
        this._angle = toRadian(val);
    }

    @property({
        displayOrder: 10,
    })
    public length = 0;

    @property({
        displayOrder: 11,
    })
    public boxThickness = new Vec3(0, 0, 0);

    private mat: mat4;
    private quat: quat;
    private particleSystem: any;
    private lastTime: number;
    private totalAngle: number;

    constructor () {
        this.mat = mat4.create();
        this.quat = quat.create();
        this.particleSystem = null;
        this.lastTime = 0;
        this.totalAngle = 0;
    }

    public onInit (ps: ParticleSystemComponent) {
        this.constructMat();
        this.particleSystem = ps;
        this.lastTime = this.particleSystem._time;
        this.totalAngle = 0;
    }

    private constructMat () {
        quat.fromEuler(this.quat, this._rotation.x, this._rotation.y, this._rotation.z);
        mat4.fromRTS(this.mat, this.quat, this._position, this._scale);
    }

    public emit (p) {
        switch (this.shapeType) {
            case ShapeType.Box:
                boxEmit(this.emitFrom, this.boxThickness, p.position, p.velocity);
                break;
            case ShapeType.Circle:
                circleEmit(this.radius, this.radiusThickness, this.generateArcAngle(), p.position, p.velocity);
                break;
            case ShapeType.Cone:
                coneEmit(this.emitFrom, this.radius, this.radiusThickness, this.generateArcAngle(), this._angle, this.length, p.position, p.velocity);
                break;
            case ShapeType.Sphere:
                sphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
                break;
            case ShapeType.Hemisphere:
                hemisphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
                break;
            default:
                console.warn(this.shapeType + ' shapeType is not supported by ShapeModule.');
        }
        if (this.randomPositionAmount > 0) {
            p.position.x += randomRange(-this.randomPositionAmount, this.randomPositionAmount);
            p.position.y += randomRange(-this.randomPositionAmount, this.randomPositionAmount);
            p.position.z += randomRange(-this.randomPositionAmount, this.randomPositionAmount);
        }
        vec3.transformQuat(p.velocity, p.velocity, this.quat);
        vec3.transformMat4(p.position, p.position, this.mat);
        if (this.sphericalDirectionAmount > 0) {
            const sphericalVel = vec3.normalize(_intermediVec, p.position);
            vec3.lerp(p.velocity, p.velocity, sphericalVel, this.sphericalDirectionAmount);
        }
        this.lastTime = this.particleSystem!._time;
    }

    private generateArcAngle () {
        if (this.arcMode === ArcMode.Random) {
            return randomRange(0, this._arc);
        }
        let angle = this.totalAngle + 2 * Math.PI * this.arcSpeed.evaluate(this.particleSystem!._time, 1)! * (this.particleSystem!._time - this.lastTime);
        this.totalAngle = angle;
        if (this.arcSpread !== 0) {
            angle = Math.floor(angle / (this._arc * this.arcSpread)) * this._arc * this.arcSpread;
        }
        switch (this.arcMode) {
            case ArcMode.Loop:
                return repeat(angle, this._arc);
            case ArcMode.PingPong:
                return pingPong(angle, this._arc);
        }
    }
}

function sphereEmit (emitFrom, radius, radiusThickness, pos, dir) {
    switch (emitFrom) {
        case EmitLocation.Volume:
            randomPointBetweenSphere(pos, radius * (1 - radiusThickness), radius);
            vec3.copy(dir, pos);
            vec3.normalize(dir, dir);
            break;
        case EmitLocation.Shell:
            randomUnitVector(pos);
            vec3.scale(pos, pos, radius);
            vec3.copy(dir, pos);
            break;
        default:
            console.warn(emitFrom + ' is not supported for sphere emitter.');
    }
}

function hemisphereEmit (emitFrom, radius, radiusThickness, pos, dir) {
    switch (emitFrom) {
        case EmitLocation.Volume:
            randomPointBetweenSphere(pos, radius * (1 - radiusThickness), radius);
            if (pos.z > 0) {
                pos.z *= -1;
            }
            vec3.copy(dir, pos);
            vec3.normalize(dir, dir);
            break;
        case EmitLocation.Shell:
            randomUnitVector(pos);
            vec3.scale(pos, pos, radius);
            if (pos.z < 0) {
                pos.z *= -1;
            }
            vec3.copy(dir, pos);
            break;
        default:
            console.warn(emitFrom + ' is not supported for hemisphere emitter.');
    }
}

function coneEmit (emitFrom, radius, radiusThickness, theta, angle, length, pos, dir) {
    switch (emitFrom) {
        case EmitLocation.Base:
            randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
            vec2.scale(dir, pos, Math.sin(angle));
            dir.z = -Math.cos(angle) * radius;
            vec3.normalize(dir, dir);
            pos.z = 0;
            break;
        case EmitLocation.Shell:
            fixedAngleUnitVector2(pos, theta);
            vec2.scale(dir, pos, Math.sin(angle));
            dir.z = -Math.cos(angle);
            vec3.normalize(dir, dir);
            vec2.scale(pos, pos, radius);
            pos.z = 0;
            break;
        case EmitLocation.Volume:
            randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
            vec2.scale(dir, pos, Math.sin(angle));
            dir.z = -Math.cos(angle) * radius;
            vec3.normalize(dir, dir);
            pos.z = 0;
            vec3.add(pos, pos, vec3.scale(_intermediVec, dir, length * random() / -dir.z));
            break;
        default:
            console.warn(emitFrom + ' is not supported for cone emitter.');
    }
}

function boxEmit (emitFrom, boxThickness, pos, dir) {
    switch (emitFrom) {
        case EmitLocation.Volume:
            randomPointInCube(pos, _unitBoxExtent);
            // randomPointBetweenCube(pos, vec3.multiply(_intermediVec, _unitBoxExtent, boxThickness), _unitBoxExtent);
            break;
        case EmitLocation.Shell:
            _intermediArr.splice(0, _intermediArr.length);
            _intermediArr.push(randomRange(-0.5, 0.5));
            _intermediArr.push(randomRange(-0.5, 0.5));
            _intermediArr.push(randomSign() * 0.5);
            randomSortArray(_intermediArr);
            applyBoxThickness(_intermediArr, boxThickness);
            vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);
            break;
        case EmitLocation.Edge:
            _intermediArr.splice(0, _intermediArr.length);
            _intermediArr.push(randomRange(-0.5, 0.5));
            _intermediArr.push(randomSign() * 0.5);
            _intermediArr.push(randomSign() * 0.5);
            randomSortArray(_intermediArr);
            applyBoxThickness(_intermediArr, boxThickness);
            vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);
            break;
        default:
            console.warn(emitFrom + ' is not supported for box emitter.');
    }
    vec3.copy(dir, particleEmitZAxis);
}

function circleEmit (radius, radiusThickness, theta, pos, dir) {
    randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
    vec3.normalize(dir, pos);
}

function applyBoxThickness (pos, thickness) {
    if (thickness.x > 0) {
        pos[0] += 0.5 * randomRange(-thickness.x, thickness.x);
        pos[0] = clamp(pos[0], -0.5, 0.5);
    }
    if (thickness.y > 0) {
        pos[1] += 0.5 * randomRange(-thickness.y, thickness.y);
        pos[1] = clamp(pos[1], -0.5, 0.5);
    }
    if (thickness.z > 0) {
        pos[2] += 0.5 * randomRange(-thickness.z, thickness.z);
        pos[2] = clamp(pos[2], -0.5, 0.5);
    }
}

// CCClass.fastDefine('cc.ShapeModule', ShapeModule, {
//     enable: false,
//     shapeType: ShapeType.Box,
//     emitFrom: EmitLocation.Base,
//     _position: new Vec3(0, 0, 0),
//     _rotation: new Vec3(0, 0, 0),
//     _scale: new Vec3(0, 0, 0),
//     alignToDirection: false,
//     randomDirectionAmount: 0,
//     sphericalDirectionAmount: 0,
//     randomPositionAmount: 0,
//     radius: 0,
//     radiusThickness: 1,
//     arc: 0,
//     arcMode: ArcMode.Random,
//     arcSpread: 0,
//     arcSpeed: null,
//     angle: 0,
//     length: 0,
//     boxThickness: new Vec3(0, 0, 0)
// });
