/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { Vec3 } from '../../../value-types';
import { ColliderComponent } from '../exports/physics-framework';

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
