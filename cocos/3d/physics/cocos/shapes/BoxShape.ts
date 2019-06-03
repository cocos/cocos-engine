import { mat3, quat, vec3 } from '../../../../core/vmath';
import { obb } from '../../../geom-utils';
import { IShapeTransform } from '../builtin-interface';

export class BoxShape extends obb implements IShapeTransform {
    private _originHalfExtents: vec3;
    public set size (size: vec3) {
        vec3.scale(this._originHalfExtents, size, 0.5);
    }
    constructor (px = 0, py = 0, pz = 0,
                 hw = 1, hh = 1, hl = 1,
                 ox_1 = 1, ox_2 = 0, ox_3 = 0,
                 oy_1 = 0, oy_2 = 1, oy_3 = 0,
                 oz_1 = 0, oz_2 = 0, oz_3 = 1) {
        super(
            px, py, pz,
            hw, hh, hl,
            ox_1, ox_2, ox_3,
            oy_1, oy_2, oy_3,
            oz_1, oz_2, oz_3);

        this._originHalfExtents = vec3.create(hw, hh, hl);
    }

    /** 根据世界pos和偏移offset设置obb的center */
    public translate (pos: vec3, offset: vec3) {
        vec3.add(this.center, pos, offset);
    }
    /** 缩放obb */
    public scale (scale: vec3) {
        vec3.mul(this.halfExtents, this._originHalfExtents, scale);
    }
    /** 根据四元数设置obb朝向 */
    public rotate (rot: quat) {
        mat3.fromQuat(this.orientation, rot);
    }
}
