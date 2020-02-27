import { ccclass, property } from '../../../platform/CCClassDecorator';
import { clamp, Mat4, pingPong, Quat, random, randomRange, repeat, toDegree, toRadian, Vec2, Vec3 } from '../../../value-types';
import CurveRange from '../animator/curve-range';
import { fixedAngleUnitVector2, particleEmitZAxis, randomPointBetweenCircleAtFixedAngle, randomPointBetweenSphere, randomPointInCube, randomSign, randomSortArray, randomUnitVector } from '../particle-general-function';
import { ShapeType, EmitLocation, ArcMode } from '../enum';

// tslint:disable: max-line-length
const _intermediVec = new Vec3(0, 0, 0);
const _intermediArr = new Array();
const _unitBoxExtent = new Vec3(0.5, 0.5, 0.5);

/**
 * !#en The shape module of 3d particle.
 * !#zh 3D 粒子的发射形状模块
 * @class ShapeModule
 */
@ccclass('cc.ShapeModule')
export default class ShapeModule {

    /**
     * !#en The enable of shapeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    @property
    _shapeType = ShapeType.Cone;

    /**
     * !#en Particle emitter type.
     * !#zh 粒子发射器类型。
     * @property {ShapeType} shapeType
     */
    @property({
        type: ShapeType,
    })
    public get shapeType () {
        return this._shapeType;
    }

    public set shapeType (val) {
        this._shapeType = val;
        switch (this._shapeType) {
            case ShapeType.Box:
                if (this.emitFrom === EmitLocation.Base) {
                    this.emitFrom = EmitLocation.Volume;
                }
                break;
            case ShapeType.Cone:
                if (this.emitFrom === EmitLocation.Edge) {
                    this.emitFrom = EmitLocation.Base;
                }
                break;
            case ShapeType.Sphere:
            case ShapeType.Hemisphere:
                if (this.emitFrom === EmitLocation.Base || this.emitFrom === EmitLocation.Edge) {
                    this.emitFrom = EmitLocation.Volume;
                }
                break;
        }
    }

    /**
     * !#en The emission site of the particle.
     * !#zh 粒子从发射器哪个部位发射。
     * @property {EmitLocation} emitFrom
     */
    @property({
        type: EmitLocation,
    })
    emitFrom = EmitLocation.Volume;

    /**
     * !#en Particle emitter radius.
     * !#zh 粒子发射器半径。
     * @property {Number} radius
     */
    @property
    radius = 1;

    /**
     * !#en Particle emitter emission position (not valid for Box type emitters)：<bg>
     * - 0 means emitted from the surface;
     * - 1 means launch from the center;
     * - 0 ~ 1 indicates emission from the center to the surface.
     * !#zh 粒子发射器发射位置（对 Box 类型的发射器无效）：<bg>
     * - 0 表示从表面发射；
     * - 1 表示从中心发射；
     * - 0 ~ 1 之间表示在中心到表面之间发射。
     * @property {Number} radiusThickness
     */
    @property
    radiusThickness = 1;

    @property
    _angle = toRadian(25);

    /**
     * !#en The angle between the axis of the cone and the generatrix<bg>
     * Determines the opening and closing of the cone launcher
     * !#zh 圆锥的轴与母线的夹角<bg>。
     * 决定圆锥发射器的开合程度。
     * @property {Number} angle
     */
    @property
    get angle () {
        return Math.round(toDegree(this._angle) * 100) / 100;
    }

    set angle (val) {
        this._angle = toRadian(val);
    }

    @property
    _arc = toRadian(360);

    /**
     * !#en Particle emitters emit in a fan-shaped range.
     * !#zh 粒子发射器在一个扇形范围内发射。
     * @property {Number} arc
     */
    @property
    get arc () {
        return toDegree(this._arc);
    }

    set arc (val) {
        this._arc = toRadian(val);
    }

    /**
     * !#en How particles are emitted in the sector range.
     * !#zh 粒子在扇形范围内的发射方式。
     * @property {ArcMode} arcMode
     */
    @property({
        type: ArcMode,
    })
    arcMode = ArcMode.Random;

    /**
     * !#en Controls the discrete intervals around the arcs where particles might be generated.
     * !#zh 控制可能产生粒子的弧周围的离散间隔。
     * @property {Number} arcSpread
     */
    @property
    arcSpread = 0;

    /**
     * !#en The speed at which particles are emitted around the circumference.
     * !#zh 粒子沿圆周发射的速度。
     * @property {CurveRange} arcSpeed
     */
    @property({
        type: CurveRange,
    })
    arcSpeed = new CurveRange();

    /**
     * !#en Axis length from top of cone to bottom of cone <bg>.
     * Determines the height of the cone emitter.
     * !#zh 圆锥顶部截面距离底部的轴长<bg>。
     * 决定圆锥发射器的高度。
     * @property {Number} length
     */
    @property
    length = 5;

    /**
     * !#en Particle emitter emission location (for box-type particle emitters).
     * !#zh 粒子发射器发射位置（针对 Box 类型的粒子发射器。
     * @property {Vec3} boxThickness
     */
    @property
    boxThickness = new Vec3(0, 0, 0);

    @property
    _position = new Vec3(0, 0, 0);

    /**
     * !#en Particle Emitter Position
     * !#zh 粒子发射器位置。
     * @property {Vec3} position
     */
    @property
    get position () {
        return this._position;
    }
    set position (val) {
        this._position = val;
        this.constructMat();
    }

    @property
    _rotation = new Vec3(0, 0, 0);

    /**
     * !#en Particle emitter rotation angle.
     * !#zh 粒子发射器旋转角度。
     * @property {Vec3} rotation
     */
    @property
    get rotation () {
        return this._rotation;
    }
    set rotation (val) {
        this._rotation = val;
        this.constructMat();
    }

    @property
    _scale = new Vec3(1, 1, 1);

    /**
     * !#en Particle emitter scaling
     * !#zh 粒子发射器缩放比例。
     * @property {Vec3} scale
     */
    @property
    get scale () {
        return this._scale;
    }
    set scale (val) {
        this._scale = val;
        this.constructMat();
    }

    /**
     * !#en The direction of particle movement is determined based on the initial direction of the particles.
     * !#zh 根据粒子的初始方向决定粒子的移动方向。
     * @property {Boolean} alignToDirection
     */
    @property
    alignToDirection = false;

    /**
     * !#en Set particle generation direction randomly.
     * !#zh 粒子生成方向随机设定。
     * @property {Number} randomDirectionAmount
     */
    @property
    randomDirectionAmount = 0;

    /**
     * !#en Interpolation between the current emission direction and the direction from the current position to the center of the node.
     * !#zh 表示当前发射方向与当前位置到结点中心连线方向的插值。
     * @property {Number} sphericalDirectionAmount
     */
    @property
    sphericalDirectionAmount = 0;

    /**
     * !#en Set the particle generation position randomly (setting this value to a value other than 0 will cause the particle generation position to exceed the generator size range)
     * !#zh 粒子生成位置随机设定（设定此值为非 0 会使粒子生成位置超出生成器大小范围）。
     */
    @property
    randomPositionAmount = 0;

    mat = null;
    Quat = null;
    particleSystem = null;
    lastTime = null;
    totalAngle = null;

    constructor () {
        this.mat = new Mat4();
        this.quat = new Quat();
        this.particleSystem = null;
        this.lastTime = 0;
        this.totalAngle = 0;
    }

    onInit (ps) {
        this.particleSystem = ps;
        this.constructMat();
        this.lastTime = this.particleSystem._time;
    }

    constructMat () {
        Quat.fromEuler(this.quat, this._rotation.x, this._rotation.y, this._rotation.z);
        Mat4.fromRTS(this.mat, this.quat, this._position, this._scale);
    }

    emit (p) {
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
        Vec3.transformQuat(p.velocity, p.velocity, this.quat);
        Vec3.transformMat4(p.position, p.position, this.mat);
        if (this.sphericalDirectionAmount > 0) {
            const sphericalVel = Vec3.normalize(_intermediVec, p.position);
            Vec3.lerp(p.velocity, p.velocity, sphericalVel, this.sphericalDirectionAmount);
        }
        this.lastTime = this.particleSystem._time;
    }

    generateArcAngle () {
        if (this.arcMode === ArcMode.Random) {
            return randomRange(0, this._arc);
        }
        let angle = this.totalAngle + 2 * Math.PI * this.arcSpeed.evaluate(this.particleSystem._time, 1) * (this.particleSystem._time - this.lastTime);
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
            Vec3.copy(dir, pos);
            Vec3.normalize(dir, dir);
            break;
        case EmitLocation.Shell:
            randomUnitVector(pos);
            Vec3.scale(pos, pos, radius);
            Vec3.copy(dir, pos);
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
            Vec3.copy(dir, pos);
            Vec3.normalize(dir, dir);
            break;
        case EmitLocation.Shell:
            randomUnitVector(pos);
            Vec3.scale(pos, pos, radius);
            if (pos.z < 0) {
                pos.z *= -1;
            }
            Vec3.copy(dir, pos);
            break;
        default:
            console.warn(emitFrom + ' is not supported for hemisphere emitter.');
    }
}

function coneEmit (emitFrom, radius, radiusThickness, theta, angle, length, pos, dir) {
    switch (emitFrom) {
        case EmitLocation.Base:
            randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
            Vec2.scale(dir, pos, Math.sin(angle));
            dir.z = -Math.cos(angle) * radius;
            Vec3.normalize(dir, dir);
            pos.z = 0;
            break;
        case EmitLocation.Shell:
            fixedAngleUnitVector2(pos, theta);
            Vec2.scale(dir, pos, Math.sin(angle));
            dir.z = -Math.cos(angle);
            Vec3.normalize(dir, dir);
            Vec2.scale(pos, pos, radius);
            pos.z = 0;
            break;
        case EmitLocation.Volume:
            randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
            Vec2.scale(dir, pos, Math.sin(angle));
            dir.z = -Math.cos(angle) * radius;
            Vec3.normalize(dir, dir);
            pos.z = 0;
            Vec3.add(pos, pos, Vec3.scale(_intermediVec, dir, length * random() / -dir.z));
            break;
        default:
            console.warn(emitFrom + ' is not supported for cone emitter.');
    }
}

function boxEmit (emitFrom, boxThickness, pos, dir) {
    switch (emitFrom) {
        case EmitLocation.Volume:
            randomPointInCube(pos, _unitBoxExtent);
            // randomPointBetweenCube(pos, Vec3.multiply(_intermediVec, _unitBoxExtent, boxThickness), _unitBoxExtent);
            break;
        case EmitLocation.Shell:
            _intermediArr.splice(0, _intermediArr.length);
            _intermediArr.push(randomRange(-0.5, 0.5));
            _intermediArr.push(randomRange(-0.5, 0.5));
            _intermediArr.push(randomSign() * 0.5);
            randomSortArray(_intermediArr);
            applyBoxThickness(_intermediArr, boxThickness);
            Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);
            break;
        case EmitLocation.Edge:
            _intermediArr.splice(0, _intermediArr.length);
            _intermediArr.push(randomRange(-0.5, 0.5));
            _intermediArr.push(randomSign() * 0.5);
            _intermediArr.push(randomSign() * 0.5);
            randomSortArray(_intermediArr);
            applyBoxThickness(_intermediArr, boxThickness);
            Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);
            break;
        default:
            console.warn(emitFrom + ' is not supported for box emitter.');
    }
    Vec3.copy(dir, particleEmitZAxis);
}

function circleEmit (radius, radiusThickness, theta, pos, dir) {
    randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
    Vec3.normalize(dir, pos);
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
