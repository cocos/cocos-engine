/**
 * @category physics
 */

import { Vec3 } from '../../core/math';
import { ColliderComponent } from '../../../exports/physics-framework';

/**
 * @zh
 * 用于保存物理射线检测结果
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
        return this._collidier!;
    }

    private _hitPoint: Vec3 = new Vec3();
    private _distance: number = 0;
    private _collidier: ColliderComponent | null = null;

    /**
     * @zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用
     */
    public _assign (hitPoint: Vec3, distance: number, collider: ColliderComponent) {
        Vec3.copy(this._hitPoint, hitPoint);
        this._distance = distance;
        this._collidier = collider;
    }

    /**
     * @zh
     * 克隆
     */
    public clone () {
        const c = new PhysicsRayResult();
        Vec3.copy(c._hitPoint, this._hitPoint);
        c._distance = this._distance;
        c._collidier = this._collidier;
        return c;
    }
}
