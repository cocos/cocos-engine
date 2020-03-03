/**
 * @category physics
 */

import { Vec3 } from '../../core/math';
import { ColliderComponent } from '../../../exports/physics-framework';
import { IVec3Like } from '../../core/math/type-define';

/**
 * @en
 * Used to store physical ray test results.
 * @zh
 * 用于保存物理射线检测结果。
 */
export class PhysicsRayResult {

    /**
     * @zh
     * 击中点
     */
    get hitPoint (): Vec3 {
        return this._hitPoint;
    }

    /**
     * @zh
     * 距离
     */
    get distance (): number {
        return this._distance;
    }

    /**
     * @zh
     * 击中的碰撞盒
     */
    get collider (): ColliderComponent {
        return this._collider!;
    }

    /**
     * @zh
     * 击中面的法线
     */
    get hitNormal (): Vec3 {
        return this._hitNormal;
    }

    private _hitPoint: Vec3 = new Vec3();
    private _hitNormal: Vec3 = new Vec3();
    private _distance: number = 0;
    private _collider: ColliderComponent | null = null;

    /**
     * @zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用
     */
    public _assign (hitPoint: IVec3Like, distance: number, collider: ColliderComponent, hitNormal: IVec3Like) {
        Vec3.copy(this._hitPoint, hitPoint);
        Vec3.copy(this._hitNormal, hitNormal);
        this._distance = distance;
        this._collider = collider;
    }

    /**
     * @zh
     * 克隆
     */
    public clone () {
        const c = new PhysicsRayResult();
        Vec3.copy(c._hitPoint, this._hitPoint);
        Vec3.copy(c._hitNormal, this._hitNormal);
        c._distance = this._distance;
        c._collider = this._collider;
        return c;
    }
}
