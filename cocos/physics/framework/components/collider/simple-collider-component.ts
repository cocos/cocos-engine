/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { Vec3 } from '../../../../core/math';
import { createSimpleShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { ISimpleShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { ESimpleShapeType } from '../../physics-enum';
import { IVec3Like } from '../../../../core/math/type-define';

/**
 * @en
 * Simple collider component, such as vertex, line, triangle, tetrahedron.
 * @zh
 * 简单形状碰撞器，点、线、三角形、四面体。
 */
@ccclass('cc.SimpleColliderComponent')
@help('i18n:cc.SimpleColliderComponent')
@executionOrder(98)
@menu('Physics/SimpleCollider(beta)')
@executeInEditMode
export class SimpleColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @property({
        type: ESimpleShapeType
    })
    get shapeType () {
        return this._shapeType;
    }

    set shapeType (v) {
        this._shapeType = v;
        if (!EDITOR && !TEST) {
            this.shape.setShapeType(v);
        }
    }

    @property
    get vertex0 () {
        return this._vertices[0];
    }

    set vertex0 (v: IVec3Like) {
        Vec3.copy(this._vertices[0], v);
        this.updateVertices();
    }

    @property({
        visible: function (this: SimpleColliderComponent) {
            return this._shapeType > 1;
        }
    })
    get vertex1 () {
        return this._vertices[1];
    }

    set vertex1 (v: IVec3Like) {
        Vec3.copy(this._vertices[1], v);
        this.updateVertices();
    }

    @property({
        visible: function (this: SimpleColliderComponent) {
            return this._shapeType > 2;
        }
    })
    get vertex2 () {
        return this._vertices[2];
    }

    set vertex2 (v: IVec3Like) {
        Vec3.copy(this._vertices[2], v);
        this.updateVertices();
    }

    @property({
        visible: function (this: SimpleColliderComponent) {
            return this._shapeType > 3;
        }
    })
    get vertex3 () {
        return this._vertices[3];
    }

    set vertex3 (v: IVec3Like) {
        Vec3.copy(this._vertices[3], v);
        this.updateVertices();
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape as ISimpleShape;
    }

    get vertices () {
        return this._vertices
    }

    /// PRIVATE PROPERTY ///

    @property
    private _shapeType: ESimpleShapeType = ESimpleShapeType.TETRAHEDRON;

    @property
    private _vertices: IVec3Like[] = [
        new Vec3(0, 0, 0),
        new Vec3(0, 0, 1),
        new Vec3(1, 0, 0),
        new Vec3(0, 1, 0),
    ];

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createSimpleShape();
        }
    }

    updateVertices () {
        if (!EDITOR && !TEST) {
            this.shape.setVertices(this._vertices);
        }
    }

}
