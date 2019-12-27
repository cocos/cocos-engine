import { Vec3, Quat, Mat4, absMaxComponent } from "../math";
import enums from "./enums";
import { IVec3Like, IQuatLike } from "../math/type-define";

/**
 * @zh
 * 基础几何，胶囊体
 */
export class capsule {

    protected _type: number;

    /** 
     * @zh
     * 胶囊体球部半径
     */
    radius: number;

    /**
     * @zh
     * 胶囊体中心点和球部圆心的距离
     */
    halfHeight: number;

    /**
     * @zh
     * 胶囊体的朝向，映射关系 [0,1,2] => [x,y,z]
     */
    axis: number;

    readonly center: Vec3;
    readonly rotation: Quat;

    /** cache, local center of ellipse */
    readonly ellipseCenter0: Vec3;
    readonly ellipseCenter1: Vec3;

    constructor (radius: number = 0.5, halfHeight: number = 0.5, axis = 1) {
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

    transform (m: Mat4, pos: IVec3Like, rot: IQuatLike, scale: IVec3Like, out: capsule) {
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
        }
    }

}