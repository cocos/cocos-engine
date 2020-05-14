/**
 * @category 3d/primitive
 */

import { createMesh } from '../3d/misc/utils';
import { Mesh } from '../assets/mesh';
import { ccclass, property } from '../data/class-decorator';
import * as primitives from '../primitive';
import { ccenum } from '../value-types/enum';
import { legacyCC } from '../global-exports';

enum PrimitiveType {
    BOX = 0,
    SPHERE = 1,
    CYLINDER = 2,
    CONE = 3,
    CAPSULE = 4,
    TORUS = 5,
    PLANE = 6,
    QUAD = 7,
}
ccenum(PrimitiveType);

/**
 * @en
 * Basic primitive mesh, this can be generate some primitive mesh at runtime.
 * @zh
 * 基础图形网格，可以在运行时构建一些基础的网格。
 */
@ccclass('cc.Primitive')
export class Primitive extends Mesh {
    /**
     * @en
     * The type of the primitive mesh, set it before you call onLoaded.
     * @zh
     * 此基础图形网格的类型，请在 onLoaded 调用之前设置。
     */
    @property({ type: PrimitiveType })
    public type: number = PrimitiveType.BOX;

    /**
     * @en
     * The option for build the primitive mesh, set it before you call onLoaded.
     * @zh
     * 创建此基础图形网格的可选参数，请在 onLoaded 调用之前设置。
     */
    @property
    public info: Record<string, number> = {};

    constructor (type = PrimitiveType.BOX) {
        super();
        this.type = type;
    }

    /**
     * @en
     * Construct the primitive mesh with `type` and `info`.
     * @zh
     * 根据`type`和`info`构建相应的网格。
     */
    public onLoaded () {
        createMesh(primitives[PrimitiveType[this.type].toLowerCase()](this.info), this);
    }
}

legacyCC.Primitive = Primitive;
