import { vec3 } from '../../../../core/vmath';
import { sphere } from '../../../geom-utils';
import { IShapeTransform } from '../builtin-interface';

export class SphereShape extends sphere implements IShapeTransform {
    constructor (cx = 0, cy = 0, cz = 0, r = 1) {
        super(cx, cy, cz, r);
    }

    /** 根据世界pos和偏移offset设置obb的center */
    public translate (pos: vec3, offset: vec3) {
        vec3.add(this.c, pos, offset);
    }
    /** 根据缩放向量缩放球 */
    public scale (scale: vec3) {
        this.r = this.r * Math.max(Math.max(scale.x, scale.y), scale.z);
    }
    /** 根据四元数设置朝向 */
    public rotate (...args: any) { }
}
