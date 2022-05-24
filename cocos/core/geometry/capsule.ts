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

import { Vec3, Quat, Mat4, absMaxComponent } from '../math';
import enums from './enums';
import { IVec3Like, IQuatLike } from '../math/type-define';

/**
 * @en
 * Basic Geometry: capsule.
 * @zh
 * 基础几何，胶囊体。
 */
export class Capsule {
    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    get type () {
        return this._type;
    }

    protected readonly _type: number;

    /**
     * @en
     * Capsule sphere radius.
     * @zh
     * 胶囊体球部半径。
     */
    radius: number;

    /**
     * @en
     * The distance between the center point of the capsule and the center of the sphere.
     * @zh
     * 胶囊体中心点和球部圆心的距离。
     */
    halfHeight: number;

    /**
     * @en
     * Local orientation of capsule [0,1,2] => [x,y,z].
     * @zh
     * 胶囊体的本地朝向，映射关系 [0,1,2] => [x,y,z]。
     */
    axis: number;

    /**
     * @en
     * The origin of the capsule.
     * @zh
     * 胶囊体的原点。
     */
    readonly center: Vec3;

    /**
     * @en
     * The rotation of the capsule.
     * @zh
     * 胶囊体的旋转。
     */
    readonly rotation: Quat;

    /**
     * @internal
     * cache, local center of ellipse
     **/
    readonly ellipseCenter0: Vec3;
    /**
     * @internal
     */
    readonly ellipseCenter1: Vec3;

    constructor (radius = 0.5, halfHeight = 0.5, axis = 1) {
        this._type = enums.SHAPE_CAPSULE;
        this.radius = radius;
        this.halfHeight = halfHeight;
        this.axis = axis;

        this.center = new Vec3();
        this.rotation = new Quat();

        this.ellipseCenter0 = new Vec3(0, halfHeight, 0);
        this.ellipseCenter1 = new Vec3(0, -halfHeight, 0);
        this.updateCache();
    }

    /**
     * @en
     * Transform this capsule.
     * @zh
     * 变换此胶囊体。
     */
    transform (m: Mat4, pos: IVec3Like, rot: IQuatLike, scale: IVec3Like, out: Capsule) {
        const ws = scale;
        const s = absMaxComponent(ws as Vec3);
        out.radius = this.radius * Math.abs(s);

        const halfTotalWorldHeight = (this.halfHeight + this.radius) * Math.abs(ws.y);
        let halfWorldHeight = halfTotalWorldHeight - out.radius;
        if (halfWorldHeight < 0) halfWorldHeight = 0;
        out.halfHeight = halfWorldHeight;

        Vec3.transformMat4(out.center, this.center, m);
        Quat.multiply(out.rotation, this.rotation, rot);
        out.updateCache();
    }

    updateCache () {
        this.updateLocalCenter();
        Vec3.transformQuat(this.ellipseCenter0, this.ellipseCenter0, this.rotation);
        Vec3.transformQuat(this.ellipseCenter1, this.ellipseCenter1, this.rotation);
        this.ellipseCenter0.add(this.center);
        this.ellipseCenter1.add(this.center);
    }

    updateLocalCenter () {
        const halfHeight = this.halfHeight;
        const axis = this.axis;
        switch (axis) {
        case 0:
            this.ellipseCenter0.set(halfHeight, 0, 0);
            this.ellipseCenter1.set(-halfHeight, 0, 0);
            break;
        case 1:
            this.ellipseCenter0.set(0, halfHeight, 0);
            this.ellipseCenter1.set(0, -halfHeight, 0);
            break;
        case 2:
            this.ellipseCenter0.set(0, 0, halfHeight);
            this.ellipseCenter1.set(0, 0, -halfHeight);
            break;
        default:
            break;
        }
    }
}
