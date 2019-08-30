import { ccclass, property } from '../data/class-decorator';
import { createMesh } from '../3d/misc/utils';
import * as primitives from '../primitive';
import { Mesh } from '../assets/mesh';
import { ccenum } from '../value-types/enum';

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

@ccclass('cc.Primitive')
export class Primitive extends Mesh {
    @property({type: PrimitiveType})
    public type: number = PrimitiveType.BOX;
    @property
    public info: Record<string, number> = {};

    public onLoaded () {
        createMesh(primitives[PrimitiveType[this.type]](this.info), this);
    }
}

cc.Primitive = Primitive;
