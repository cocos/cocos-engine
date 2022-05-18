

import { ccclass, property, menu } from '../../../../core/data/class-decorator';
import { Vec2, Size } from '../../../../core';
import { Collider2D } from './collider-2d';
import { ECollider2DType } from '../../physics-types';
import { IBoxShape } from '../../../spec/i-physics-shape';

@ccclass('cc.BoxCollider2D')
@menu('Physics2D/Colliders/BoxCollider2D')
export class BoxCollider2D extends Collider2D {
    @property
    private _size = new Size(1, 1);

    /**
     * @en Box size
     * @zh 包围盒大小
     */
    @property
    get size () {
        return this._size;
    }
    set size (v) {
        this._size = v;
    }

    /**
     * @en Get world points
     * @zh 世界坐标下 BoX 的四个点
     */
    get worldPoints (): readonly Readonly<Vec2>[] {
        if (this._shape) {
            return (this._shape as IBoxShape).worldPoints;
        }
        return [];
    }

    readonly TYPE = ECollider2DType.BOX;
}
