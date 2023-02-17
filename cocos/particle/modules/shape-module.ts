/* eslint-disable no-lonely-if */
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

import { ccclass, tooltip, displayOrder, type, formerlySerializedAs, serializable, visible, range } from 'cc.decorator';
import { Mat4, Quat, Vec2, Vec3, clamp, pingPong, random, randomRange, repeat, toDegree, toRadian, randomRangeInt } from '../../core/math';

import { CurveRange } from '../curve-range';
import { fixedAngleUnitVector2, particleEmitZAxis, randomPointBetweenCircleAtFixedAngle, randomPointBetweenSphere,
    randomPointInCube, randomSign, randomSortArray, randomUnitVector } from '../particle-general-function';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';
import { Enum } from '../../core';

const _intermediVec = new Vec3(0, 0, 0);
const tmpPosition = new Vec3();
const tmpDir = new Vec3();
const shuffleArray = new Float32Array(3);
const boxThickness = new Vec3();

/**
 * 粒子发射器类型。
 * @enum shapeModule.ShapeType
 */
export enum ShapeType {
    /**
     * 立方体类型粒子发射器。
     */
    BOX,

    BOX_SHELL,

    BOX_EDGE,

    /**
     * 圆形粒子发射器。
     */
    CIRCLE,

    /**
     * 圆锥体粒子发射器。
     */
    CONE,

    CONE_BASE,

    CONE_SHELL,

    /**
     * 球体粒子发射器。
     */
    SPHERE,

    SPHERE_SHELL,

    /**
     * 半球体粒子发射器。
     */
    HEMISPHERE,

    HEMISPHERE_SHELL,
}

/**
 * 粒子在扇形区域的发射方式。
 * @enum shapeModule.ArcMode
 */
export enum ArcMode {
    /**
     * 随机位置发射。
     */
    RANDOM,

    /**
     * 沿某一方向循环发射，每次循环方向相同。
     */
    LOOP,

    /**
     * 循环发射，每次循环方向相反。
     */
    PING_PONG,
}

@ccclass('cc.ShapeModule')
export class ShapeModule extends ParticleModule {
    /**
     * @zh 粒子发射器位置。
     */
    @displayOrder(13)
    @tooltip('i18n:shapeModule.position')
    get position () {
        return this._position;
    }
    set position (val) {
        this._position.set(val);
        this._isTransformDirty = true;
    }

    /**
     * @zh 粒子发射器旋转角度。
     */
    @displayOrder(14)
    @tooltip('i18n:shapeModule.rotation')
    get rotation () {
        return this._rotation;
    }
    set rotation (val) {
        this._rotation.set(val);
        this._isTransformDirty = true;
    }

    /**
     * @zh 粒子发射器缩放比例。
     */
    @displayOrder(15)
    @tooltip('i18n:shapeModule.scale')
    get scale (): Readonly<Vec3> {
        return this._scale;
    }
    set scale (val) {
        this._scale.set(val);
        this._isTransformDirty = true;
    }

    /**
     * @zh 粒子发射器在一个扇形范围内发射。
     */
    @displayOrder(6)
    @tooltip('i18n:shapeModule.arc')
    @visible(function (this: ShapeModule) {
        return this._shapeType === ShapeType.CONE || this._shapeType === ShapeType.CONE_BASE || this._shapeType === ShapeType.CONE_SHELL
            || this._shapeType === ShapeType.CIRCLE;
    })
    get arc () {
        return toDegree(this._arc);
    }

    set arc (val) {
        this._arc = toRadian(val);
    }

    /**
     * @zh 圆锥的轴与母线的夹角<bg>。
     * 决定圆锥发射器的开合程度。
     */
    @displayOrder(5)
    @tooltip('i18n:shapeModule.angle')
    @visible(function (this: ShapeModule) {
        return this._shapeType === ShapeType.CONE || this._shapeType === ShapeType.CONE_BASE || this._shapeType === ShapeType.CONE_SHELL;
    })
    get angle () {
        return Math.round(toDegree(this._angle) * 100) / 100;
    }

    set angle (val) {
        this._angle = toRadian(val);
    }

    private _shapeType = ShapeType.CONE;

    @type(Enum(ShapeType))
    @tooltip('i18n:shapeModule.shapeType')
    public get shapeType () {
        return this._shapeType;
    }

    public set shapeType (val) {
        this._shapeType = val;
    }

    /**
     * @zh 根据粒子的初始方向决定粒子的移动方向。
     */
    @serializable
    @displayOrder(16)
    @tooltip('i18n:shapeModule.alignToDirection')
    public alignToDirection = false;

    /**
     * @zh 粒子生成方向随机设定。
     */
    @serializable
    @displayOrder(17)
    @tooltip('i18n:shapeModule.randomDirectionAmount')
    public randomDirectionAmount = 0;

    /**
     * @zh 表示当前发射方向与当前位置到结点中心连线方向的插值。
     */
    @serializable
    @displayOrder(18)
    @tooltip('i18n:shapeModule.sphericalDirectionAmount')
    public sphericalDirectionAmount = 0;

    /**
     * @zh 粒子生成位置随机设定（设定此值为非 0 会使粒子生成位置超出生成器大小范围）。
     */
    @serializable
    @displayOrder(19)
    @tooltip('i18n:shapeModule.randomPositionAmount')
    public randomPositionAmount = 0;

    /**
     * @zh 粒子发射器半径。
     */
    @serializable
    @displayOrder(3)
    @tooltip('i18n:shapeModule.radius')
    @visible(function (this: ShapeModule) {
        return this._shapeType !== ShapeType.BOX && this._shapeType !== ShapeType.BOX_EDGE && this._shapeType !== ShapeType.BOX_SHELL;
    })
    public radius = 1;

    /**
     * @zh 粒子发射器发射位置（对 Box 类型的发射器无效）：<bg>
     * - 0 表示从表面发射；
     * - 1 表示从中心发射；
     * - 0 ~ 1 之间表示在中心到表面之间发射。
     */
    @serializable
    @displayOrder(4)
    @tooltip('i18n:shapeModule.radiusThickness')
    @visible(function (this: ShapeModule) {
        return this._shapeType !== ShapeType.BOX && this._shapeType !== ShapeType.BOX_EDGE && this._shapeType !== ShapeType.BOX_SHELL;
    })
    public radiusThickness = 1;

    /**
     * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
     */
    @type(Enum(ArcMode))
    @serializable
    @displayOrder(7)
    @tooltip('i18n:shapeModule.arcMode')
    @visible(function (this: ShapeModule) {
        return this._shapeType === ShapeType.CONE || this._shapeType === ShapeType.CONE_BASE || this._shapeType === ShapeType.CONE_SHELL
            || this._shapeType === ShapeType.CIRCLE;
    })
    public arcMode = ArcMode.RANDOM;

    /**
     * @zh 控制可能产生粒子的弧周围的离散间隔。
     */
    @serializable
    @displayOrder(9)
    @tooltip('i18n:shapeModule.arcSpread')
    @visible(function (this: ShapeModule) {
        return (this._shapeType === ShapeType.CONE || this._shapeType === ShapeType.CONE_BASE || this._shapeType === ShapeType.CONE_SHELL
            || this._shapeType === ShapeType.CIRCLE) && this.arcMode !== ArcMode.RANDOM;
    })
    public arcSpread = 0;

    /**
     * @zh 粒子沿圆周发射的速度。
     */
    @type(CurveRange)
    @range([0, 1])
    @serializable
    @displayOrder(10)
    @tooltip('i18n:shapeModule.arcSpeed')
    @visible(function (this: ShapeModule) {
        return (this._shapeType === ShapeType.CONE || this._shapeType === ShapeType.CONE_BASE || this._shapeType === ShapeType.CONE_SHELL
            || this._shapeType === ShapeType.CIRCLE) && this.arcMode !== ArcMode.RANDOM;
    })
    public arcSpeed = new CurveRange();

    /**
     * @zh 圆锥顶部截面距离底部的轴长<bg>。
     * 决定圆锥发射器的高度。
     */
    @serializable
    @displayOrder(11)
    @tooltip('i18n:shapeModule.length')
    @visible(function (this: ShapeModule) {
        return this._shapeType === ShapeType.CONE || this._shapeType === ShapeType.CONE_BASE || this._shapeType === ShapeType.CONE_SHELL;
    })
    public length = 5;

    /**
     * @zh 粒子发射器发射位置（针对 Box 类型的粒子发射器）。
     */
    @serializable
    @displayOrder(12)
    @tooltip('i18n:shapeModule.boxThickness')
    @visible(function (this: ShapeModule) {
        return this._shapeType === ShapeType.BOX || this._shapeType === ShapeType.BOX_EDGE || this._shapeType === ShapeType.BOX_SHELL;
    })
    public boxThickness = new Vec3(0, 0, 0);

    public get name (): string {
        return 'shapeModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.INITIALIZE;
    }

    public get updatePriority (): number {
        return 0;
    }

    @serializable
    private _position = new Vec3(0, 0, 0);

    @serializable
    private _rotation = new Vec3(0, 0, 0);

    @serializable
    private _scale = new Vec3(1, 1, 1);

    @serializable
    private _arc = toRadian(360);

    @serializable
    private _angle = toRadian(25);
    private _totalAngle = 0;
    private _mat = new Mat4();
    private _quat = new Quat();
    private _isTransformDirty = true;

    public tick (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext, t: number, deltaTime: number) {
        this._totalAngle += 2 * Math.PI * this.arcSpeed.evaluate(t / params.duration, 1) * deltaTime;
        if (this._isTransformDirty) {
            Quat.fromEuler(this._quat, this._rotation.x, this._rotation.y, this._rotation.z);
            Mat4.fromRTS(this._mat, this._quat, this._position, this._scale);
            this._isTransformDirty = false;
        }
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, t: number) {
        const randomPositionAmount = this.randomPositionAmount;
        const minRadius = this.radius * (1 - this.radiusThickness);
        const velocityZ = -Math.cos(this._angle) * this.radius;
        boxThickness.set(1 - this.boxThickness.x, 1 - this.boxThickness.y, 1 - this.boxThickness.z);
        let angle = this._totalAngle;
        if (this.arcSpread !== 0) {
            angle = Math.floor(angle / (this._arc * this.arcSpread)) * this._arc * this.arcSpread;
        }

        switch (this.shapeType) {
        case ShapeType.BOX:
            for (let i = fromIndex; i < toIndex; ++i) {
                Vec3.set(tmpPosition,
                    randomRange(-0.5, 0.5),
                    randomRange(-0.5, 0.5),
                    randomRange(-0.5, 0.5));
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        case ShapeType.BOX_SHELL:
            for (let i = fromIndex; i < toIndex; ++i) {
                shuffleArray[0] = randomRange(-0.5, 0.5);
                shuffleArray[1] = randomRange(-0.5, 0.5);
                shuffleArray[2] = randomSign() * 0.5;
                shuffleFloat3(shuffleArray);
                applyBoxThickness(shuffleArray, boxThickness);
                Vec3.set(tmpPosition, shuffleArray[0], shuffleArray[1], shuffleArray[2]);
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        case ShapeType.BOX_EDGE:
            for (let i = fromIndex; i < toIndex; ++i) {
                shuffleArray[0] = randomRange(-0.5, 0.5);
                shuffleArray[1] = randomSign() * 0.5;
                shuffleArray[2] = randomSign() * 0.5;
                shuffleFloat3(shuffleArray);
                applyBoxThickness(shuffleArray, boxThickness);
                Vec3.set(tmpPosition, shuffleArray[0], shuffleArray[1], shuffleArray[2]);
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        case ShapeType.CIRCLE:
            if (this.arcMode === ArcMode.RANDOM) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    tmpPosition.set(Math.cos(theta), Math.sin(theta), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec3.normalize(tmpDir, tmpPosition);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            } else {
                if (this.arcMode === ArcMode.LOOP) {
                    angle = repeat(angle, this._arc);
                } else {
                    angle = pingPong(angle, this._arc);
                }
                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec3.normalize(tmpDir, tmpPosition);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            }
            break;
        case ShapeType.CONE:
            if (this.arcMode === ArcMode.RANDOM) {
                const radiusThickness = this.radius - minRadius;
                const angleSin = Math.sin(this._angle);
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    Vec3.set(tmpPosition, Math.cos(theta), Math.sin(theta), 0);
                    Vec3.multiplyScalar(tmpPosition, tmpPosition, minRadius + radiusThickness * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, angleSin);
                    tmpDir.z = velocityZ;
                    Vec3.normalize(tmpDir, tmpDir);
                    Vec3.scaleAndAdd(tmpPosition, tmpPosition, tmpDir, this.length * random() / -velocityZ);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            } else {
                if (this.arcMode === ArcMode.LOOP) {
                    angle = repeat(angle, this._arc);
                } else {
                    angle = pingPong(angle, this._arc);
                }
                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = velocityZ;
                    tmpDir.normalize();
                    Vec3.scaleAndAdd(tmpPosition, tmpPosition, tmpDir, this.length * random() / -velocityZ);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            }
            break;
        case ShapeType.CONE_BASE:
            if (this.arcMode === ArcMode.RANDOM) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    tmpPosition.set(Math.cos(theta), Math.sin(theta), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = velocityZ;
                    Vec3.normalize(tmpDir, tmpDir);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            } else {
                if (this.arcMode === ArcMode.LOOP) {
                    angle = repeat(angle, this._arc);
                } else {
                    angle = pingPong(angle, this._arc);
                }

                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = velocityZ;
                    tmpDir.normalize();
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            }
            break;
        case ShapeType.CONE_SHELL:
            if (this.arcMode === ArcMode.RANDOM) {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const theta = randomRange(0, this._arc);
                    tmpPosition.set(Math.cos(theta), Math.sin(theta), 0);
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = -Math.cos(this._angle);
                    tmpDir.normalize();
                    Vec2.multiplyScalar(tmpPosition, tmpPosition, this.radius);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            } else {
                if (this.arcMode === ArcMode.LOOP) {
                    angle = repeat(angle, this._arc);
                } else {
                    angle = pingPong(angle, this._arc);
                }

                for (let i = fromIndex; i < toIndex; ++i) {
                    tmpPosition.set(Math.cos(angle), Math.sin(angle), 0);
                    Vec2.multiplyScalar(tmpDir, tmpPosition, Math.sin(this._angle));
                    tmpDir.z = -Math.cos(this._angle);
                    tmpDir.normalize();
                    Vec2.multiplyScalar(tmpPosition, tmpPosition, this.radius);
                    particles.setStartDirAt(tmpDir, i);
                    particles.setPositionAt(tmpPosition, i);
                }
            }
            break;
        case ShapeType.SPHERE:
            for (let i = fromIndex; i < toIndex; ++i) {
                const z = randomRange(-1, 1);
                const a = randomRange(0, 2 * Math.PI);
                const r = Math.sqrt(1 - z * z);
                tmpPosition.x = r * Math.cos(a);
                tmpPosition.y = r * Math.sin(a);
                tmpPosition.z = z;
                tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                Vec3.normalize(tmpDir, tmpPosition);
                particles.setStartDirAt(tmpDir, i);
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        case ShapeType.SPHERE_SHELL:
            for (let i = fromIndex; i < toIndex; ++i) {
                const z = randomRange(-1, 1);
                const a = randomRange(0, 2 * Math.PI);
                const r = Math.sqrt(1 - z * z);
                tmpPosition.x = r * Math.cos(a);
                tmpPosition.y = r * Math.sin(a);
                tmpPosition.z = z;
                tmpPosition.multiplyScalar(this.radius);
                Vec3.normalize(tmpDir, tmpPosition);
                particles.setStartDirAt(tmpDir, i);
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        case ShapeType.HEMISPHERE:
            for (let i = fromIndex; i < toIndex; ++i) {
                const z = randomRange(-1, 1);
                const a = randomRange(0, 2 * Math.PI);
                const r = Math.sqrt(1 - z * z);
                tmpPosition.x = r * Math.cos(a);
                tmpPosition.y = r * Math.sin(a);
                tmpPosition.z = z;
                tmpPosition.multiplyScalar(minRadius + (this.radius - minRadius) * random());
                if (tmpPosition.z > 0) {
                    tmpPosition.z *= -1;
                }
                Vec3.normalize(tmpDir, tmpPosition);
                particles.setStartDirAt(tmpDir, i);
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        case ShapeType.HEMISPHERE_SHELL:
            for (let i = fromIndex; i < toIndex; ++i) {
                const z = randomRange(-1, 1);
                const a = randomRange(0, 2 * Math.PI);
                const r = Math.sqrt(1 - z * z);
                tmpPosition.x = r * Math.cos(a);
                tmpPosition.y = r * Math.sin(a);
                tmpPosition.z = z;
                tmpPosition.multiplyScalar(this.radius);
                if (tmpPosition.z > 0) {
                    tmpPosition.z *= -1;
                }
                Vec3.normalize(tmpDir, tmpPosition);
                particles.setStartDirAt(tmpDir, i);
                particles.setPositionAt(tmpPosition, i);
            }
            break;
        default:
            console.warn(`${this.shapeType} shapeType is not supported by ShapeModule.`);
        }
        if (randomPositionAmount > 0) {
            for (let i = fromIndex; i < toIndex; ++i) {
                particles.getPositionAt(tmpPosition, i);
                tmpPosition.add3f(randomRange(-randomPositionAmount, randomPositionAmount),
                    randomRange(-randomPositionAmount, randomPositionAmount),
                    randomRange(-randomPositionAmount, randomPositionAmount));
                particles.setPositionAt(tmpPosition, i);
            }
        }
        for (let i = fromIndex; i < toIndex; ++i) {
            particles.getStartDirAt(tmpDir, i);
            particles.setStartDirAt(Vec3.transformQuat(tmpDir, tmpDir, this._quat), i);
        }
        for (let i = fromIndex; i < toIndex; ++i) {
            particles.getPositionAt(tmpPosition, i);
            particles.setPositionAt(Vec3.transformMat4(tmpPosition, tmpPosition, this._mat), i);
        }
        if (this.sphericalDirectionAmount > 0) {
            for (let i = fromIndex; i < toIndex; ++i) {
                particles.getPositionAt(tmpPosition, i);
                particles.getStartDirAt(tmpDir, i);
                const sphericalVel = Vec3.normalize(_intermediVec, tmpPosition);
                Vec3.lerp(tmpDir, tmpDir, sphericalVel, this.sphericalDirectionAmount);
                particles.setStartDirAt(tmpDir, i);
            }
        }
    }
}

function applyBoxThickness (position: Float32Array, thickness: Vec3) {
    if (thickness.x > 0) {
        position[0] *= randomRange(thickness.x, 1);
    }
    if (thickness.y > 0) {
        position[1] *= randomRange(thickness.y, 1);
    }
    if (thickness.z > 0) {
        position[2] *= randomRange(thickness.z, 1);
    }
}

export function shuffleFloat3 (float3: Float32Array) {
    let transpose = randomRangeInt(0, 3);
    let val = float3[transpose];
    float3[transpose] = float3[0];
    float3[0] = val;
    transpose = 1 + randomRangeInt(0, 2);
    val = float3[transpose];
    float3[transpose] = float3[1];
    float3[1] = val;
    transpose = 2 + randomRangeInt(0, 1);
    val = float3[transpose];
    float3[transpose] = float3[2];
    float3[2] = val;
}
