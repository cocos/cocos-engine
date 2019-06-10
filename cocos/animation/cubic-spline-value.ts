
import { ccclass, property } from '../core/data/class-decorator';
import { Quat, Vec2, Vec3, Vec4 } from '../core/value-types';
import * as vmath from '../core/vmath';
import { ILerpable } from './types';

class CubicSplineValueBase<T> implements ILerpable {
    @property
    public dataPoint: T;

    @property
    public inTangent: T;

    @property
    public outTangent: T;

    constructor (dataPoint: T, inTangent: T, outTangent: T) {
        this.dataPoint = dataPoint;
        this.inTangent = inTangent;
        this.outTangent = outTangent;
    }

    public getNoLerp () {
        return this.dataPoint;
    }

    public lerp (to: CubicSplineValueBase<T>, t: number, dt: number) {
        return this.dataPoint;
    }
}

type ScaleFx<T> = (out: T, v: T, s: number) => T;
type ScaleAndAddFx<T> = (out: T, v1: T, v2: T, s: number) => T;
function makeCubicSplineValueConstructor<T> (
    name: string,
    constructorX: new () => T,
    scaleFx: ScaleFx<T>,
    scaleAndAdd: ScaleAndAddFx<T>): typeof CubicSplineValueBase {

    let tempValue = new constructorX();
    let m0 = new constructorX();
    let m1 = new constructorX();

    @ccclass(name)
    class CubicSplineValueClass extends CubicSplineValueBase<T> {
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
    }

    return CubicSplineValueClass;
}

export const CubicSplineVec2Value: typeof CubicSplineValueBase = makeCubicSplineValueConstructor(
    'cc.CubicSplineVec2Value', Vec2, vmath.vec2.scale, vmath.vec2.scaleAndAdd);
cc.CubicSplineVec2Value = CubicSplineVec2Value;

export const CubicSplineVec3Value: typeof CubicSplineValueBase = makeCubicSplineValueConstructor(
    'cc.CubicSplineVec3Value', Vec3, vmath.vec3.scale, vmath.vec3.scaleAndAdd);
cc.CubicSplineVec3Value = CubicSplineVec3Value;

export const CubicSplineVec4Value: typeof CubicSplineValueBase = makeCubicSplineValueConstructor(
    'cc.CubicSplineVec4Value', Vec4, vmath.vec4.scale, vmath.vec4.scaleAndAdd);
cc.CubicSplineVec4Value = CubicSplineVec4Value;

export const CubicSplineQuatValue: typeof CubicSplineValueBase = makeCubicSplineValueConstructor(
    'cc.CubicSplineQuatValue', Quat, vmath.quat.scale, vmath.quat.scaleAndAdd);
cc.CubicSplineQuatValue = CubicSplineQuatValue;

@ccclass('cc.CubicSplineNumberValue')
export class CubicSplineNumberValue extends CubicSplineValueBase<number> {
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
}
cc.CubicSplineNumberValue = CubicSplineNumberValue;
