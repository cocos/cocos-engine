
/**
 * @category animation
 */

import { ccclass, property } from '../core/data/class-decorator';
import { Quat, Vec2, Vec3, Vec4 } from '../core/math';
import { ILerpable } from './types';

interface ICubicSplineValue<T> extends ILerpable {
    dataPoint: T;
    inTangent: T;
    outTangent: T;
    lerp (to: ICubicSplineValue<T>, t: number, dt: number): T;
    getNoLerp (): T;
}

type CubicSplineValueConstructor<T> = new (dataPoint: T, inTangent: T, outTangent: T) => ICubicSplineValue<T>;

type ScaleFx<T> = (out: T, v: T, s: number) => T;
type ScaleAndAddFx<T> = (out: T, v1: T, v2: T, s: number) => T;
function makeCubicSplineValueConstructor<T> (
    name: string,
    constructorX: new () => T,
    scaleFx: ScaleFx<T>,
    scaleAndAdd: ScaleAndAddFx<T>): CubicSplineValueConstructor<T> {

    let tempValue = new constructorX();
    let m0 = new constructorX();
    let m1 = new constructorX();

    @ccclass(name)
    class CubicSplineValueClass implements ICubicSplineValue<T> {
        @property
        public dataPoint: T = new constructorX();

        @property
        public inTangent: T = new constructorX();

        @property
        public outTangent: T = new constructorX();

        constructor (dataPoint?: T, inTangent?: T, outTangent?: T) {
            this.dataPoint = dataPoint || new constructorX();
            this.inTangent = inTangent || new constructorX();
            this.outTangent = outTangent || new constructorX();
        }

        public lerp (to: CubicSplineValueClass, t: number, dt: number) {
            const p0 = this.dataPoint;
            const p1 = to.dataPoint;
            // dt => t_k+1 - t_k
            m0 = scaleFx(m0, this.outTangent, dt);
            m1 = scaleFx(m1, to.inTangent, dt);
            const t_3 = t * t * t;
            const t_2 = t * t;
            const f_0 = 2 * t_3 - 3 * t_2 + 1;
            const f_1 = t_3 - 2 * t_2 + t;
            const f_2 = -2 * t_3 + 3 * t_2;
            const f_3 = t_3 - t_2;
            tempValue = scaleFx(tempValue, p0, f_0);
            tempValue = scaleAndAdd(tempValue, tempValue, m0, f_1);
            tempValue = scaleAndAdd(tempValue, tempValue, p1, f_2);
            tempValue = scaleAndAdd(tempValue, tempValue, m1, f_3);
            return tempValue;
        }

        public getNoLerp () {
            return this.dataPoint;
        }
    }

    return CubicSplineValueClass;
}

export const CubicSplineVec2Value = makeCubicSplineValueConstructor(
    'cc.CubicSplineVec2Value', Vec2, Vec2.multiplyScalar, Vec2.scaleAndAdd);
cc.CubicSplineVec2Value = CubicSplineVec2Value;

export const CubicSplineVec3Value = makeCubicSplineValueConstructor(
    'cc.CubicSplineVec3Value', Vec3, Vec3.multiplyScalar, Vec3.scaleAndAdd);
cc.CubicSplineVec3Value = CubicSplineVec3Value;

export const CubicSplineVec4Value = makeCubicSplineValueConstructor(
    'cc.CubicSplineVec4Value', Vec4, Vec4.multiplyScalar, Vec4.scaleAndAdd);
cc.CubicSplineVec4Value = CubicSplineVec4Value;

export const CubicSplineQuatValue = makeCubicSplineValueConstructor(
    'cc.CubicSplineQuatValue', Quat, Quat.multiplyScalar, Quat.scaleAndAdd);
cc.CubicSplineQuatValue = CubicSplineQuatValue;

@ccclass('cc.CubicSplineNumberValue')
export class CubicSplineNumberValue implements ICubicSplineValue<number> {
    @property
    public dataPoint: number = 0;

    @property
    public inTangent: number = 0;

    @property
    public outTangent: number = 0;

    constructor (dataPoint: number, inTangent: number, outTangent: number) {
        this.dataPoint = dataPoint;
        this.inTangent = inTangent;
        this.outTangent = outTangent;
    }

    public lerp (to: CubicSplineNumberValue, t: number, dt: number) {
        const p0 = this.dataPoint;
        const p1 = to.dataPoint;
        // dt => t_k+1 - t_k
        const m0 = this.outTangent * dt;
        const m1 = to.inTangent * dt;
        const t_3 = t * t * t;
        const t_2 = t * t;
        const f_0 = 2 * t_3 - 3 * t_2 + 1;
        const f_1 = t_3 - 2 * t_2 + t;
        const f_2 = -2 * t_3 + 3 * t_2;
        const f_3 = t_3 - t_2;
        return p0 * f_0 + m0 * f_1 + p1 * f_2 + m1 * f_3;
    }

    public getNoLerp () {
        return this.dataPoint;
    }
}
cc.CubicSplineNumberValue = CubicSplineNumberValue;
