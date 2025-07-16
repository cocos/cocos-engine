/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Vec3, IVec3Like } from '../../core';
import { Collider } from '../../../exports/physics-framework';

/**
 * @en
 * Used to store physics ray test results.
 * @zh
 * 用于保存物理射线检测结果。
 */
export class PhysicsRayResult {
    /**
     * @en
     * The hit point，in world space.
     * @zh
     * 在世界坐标系下的击中点。
     */
    get hitPoint (): Vec3 {
        return this._hitPoint;
    }

    /**
     * @en
     * The distance between the ray origin with the hit.
     * @zh
     * 距离。
     */
    get distance (): number {
        return this._distance;
    }

    /**
     * @en
     * The collider hit by the ray.
     * @zh
     * 击中的碰撞盒
     */
    get collider (): Collider {
        return this._collider!;
    }

    /**
     * @en
     * The normal of the hit plane，in world space.
     * @zh
     * 在世界坐标系下击中面的法线。
     */
    get hitNormal (): Vec3 {
        return this._hitNormal;
    }

    /**
     * @en
     * Represents the fraction (range: 0.0 to 1.0) along the ray's path where the closest collision occurs.
     * A value of 0.0 indicates an immediate collision at the ray's starting point,
     * while a value of 1.0 means no collision along the entire ray length.
     * Intermediate values indicate the fraction of the ray distance at which the closest hit is detected.
     * Warning: only take effect with Bullet.
     * @zh
     * 表示射线路径上最近碰撞发生的位置，以百分比形式（范围：0.0 到 1.0）。
     * 0.0 表示射线在起点处立即发生碰撞，1.0 表示射线在整个路径上未发生碰撞。
     * 中间值表示碰撞点在射线总长度上的比例位置。
     * 注意：只在 Bullet 引擎起效.
     */
    get closestHitFraction (): number {
        return this._closestHitFraction;
    }

    protected _hitPoint: Vec3 = new Vec3();
    protected _hitNormal: Vec3 = new Vec3();
    protected _distance = 0;
    protected _collider: Collider | null = null;
    protected _closestHitFraction = 0;

    /**
     * @en
     * internal methods.
     * @zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用。
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _assign (hitPoint: IVec3Like, distance: number, collider: Collider, hitNormal: IVec3Like, closestHitFraction?: number): void {
        Vec3.copy(this._hitPoint, hitPoint);
        Vec3.copy(this._hitNormal, hitNormal);
        this._distance = distance;
        this._collider = collider;
        if (closestHitFraction) this._closestHitFraction = closestHitFraction;
    }

    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    public clone (): PhysicsRayResult {
        const c = new PhysicsRayResult();
        Vec3.copy(c._hitPoint, this._hitPoint);
        Vec3.copy(c._hitNormal, this._hitNormal);
        c._distance = this._distance;
        c._collider = this._collider;
        c._closestHitFraction = this._closestHitFraction;
        return c;
    }
}

/**
 * @en
 * Used to store physics line strip cast test results.
 * @zh
 * 用于保存物理逐线段检测结果。
 */
export class PhysicsLineStripCastResult extends PhysicsRayResult {
    private _id = 0;

    /**
     * @en
     * The line id of the line segments. This is only for lineStripCast
     * @zh
     * id
     */
    get id (): number {
        return this._id;
    }

    /**
     * @en
     * internal methods.
     * @zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用。
     * @engineInternal
     */
    public _assign (hitPoint: IVec3Like, distance: number, collider: Collider, hitNormal: IVec3Like, id = 0): void {
        super._assign(hitPoint, distance, collider, hitNormal);
        this._id = id;
    }

    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    public clone (): PhysicsLineStripCastResult {
        const c = new PhysicsLineStripCastResult();
        Vec3.copy(c._hitPoint, this._hitPoint);
        Vec3.copy(c._hitNormal, this._hitNormal);
        c._distance = this._distance;
        c._collider = this._collider;
        c._id = this._id;
        return c;
    }
}
