/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { Collider3D } from '../exports/physics-framework';
const Vec3 = cc.Vec3;

/**
 * !#en
 * Used to store physical ray detection results
 * !#zh
 * 用于保存物理射线检测结果
 * @class PhysicsRayResult
 */
export class PhysicsRayResult {

    /**
     * !#en
     * Hit the point
     * !#zh
     * 击中点
     * @property {Vec3} hitPoint
     * @readonly
     */
    get hitPoint (): cc.Vec3 {
        return this._hitPoint;
    }

    /**
     * !#en
     * Distance
     * !#zh
     * 距离
     * @property {number} distance
     * @readonly
     */
    get distance (): number {
        return this._distance;
    }

    /**
     * !#en
     * Hit the collision box
     * !#zh
     * 击中的碰撞盒
     * @property {Collider3D} collider
     * @readonly
     */
    get collider (): Collider3D {
        return this._collidier!;
    }

    private _hitPoint: cc.Vec3 = new Vec3();
    private _distance: number = 0;
    private _collidier: Collider3D | null = null;

    /**
     * !#en
     * Set up ray. This method is used internally by the engine. Do not call it from an external script
     * !#zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用
     * @method _assign
     * @param {Vec3} hitPoint
     * @param {number} distance
     * @param {Collider3D} collider
     */
    public _assign (hitPoint: cc.Vec3, distance: number, collider: Collider3D) {
        Vec3.copy(this._hitPoint, hitPoint);
        this._distance = distance;
        this._collidier = collider;
    }

    /**
     * !#en
     * Clone
     * !#zh
     * 克隆
     * @method clone
     */
    public clone () {
        const c = new PhysicsRayResult();
        Vec3.copy(c._hitPoint, this._hitPoint);
        c._distance = this._distance;
        c._collidier = this._collidier;
        return c;
    }
}
