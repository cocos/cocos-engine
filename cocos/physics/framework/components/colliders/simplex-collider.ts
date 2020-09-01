/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    visible,
    type,
    editable,
    serializable,
} from 'cc.decorator';
import { Vec3 } from '../../../../core/math';
import { Collider } from './collider';
import { ISimplexShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { ESimplexType, EColliderType } from '../../physics-enum';
import { IVec3Like } from '../../../../core/math/type-define';

/**
 * @en
 * Simplex collider, support point, line, triangle, tetrahedron.
 * @zh
 * 单纯形碰撞器，支持点、线、三角形、四面体。
 */
@ccclass('cc.SimplexCollider')
@help('i18n:cc.SimplexCollider')
@menu('Physics/SimplexCollider')
@executeInEditMode
export class SimplexCollider extends Collider {

    static readonly ESimplexType = ESimplexType;

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @type(ESimplexType)
    get shapeType () {
        return this._shapeType;
    }

    set shapeType (v) {
        this._shapeType = v;
        if (!EDITOR && !TEST) {
            this.shape.setShapeType(v);
        }
    }

    @editable
    get vertex0 () {
        return this._vertices[0];
    }

    set vertex0 (v: IVec3Like) {
        Vec3.copy(this._vertices[0], v);
        this.updateVertices();
    }

    @visible(function (this: SimplexCollider) { return this._shapeType > 1; })
    get vertex1 () {
        return this._vertices[1];
    }

    set vertex1 (v: IVec3Like) {
        Vec3.copy(this._vertices[1], v);
        this.updateVertices();
    }

    @visible(function (this: SimplexCollider) { return this._shapeType > 2; })
    get vertex2 () {
        return this._vertices[2];
    }

    set vertex2 (v: IVec3Like) {
        Vec3.copy(this._vertices[2], v);
        this.updateVertices();
    }

    @visible(function (this: SimplexCollider) { return this._shapeType > 3; })
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
        return this._shape as ISimplexShape;
    }

    get vertices () {
        return this._vertices
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _shapeType: ESimplexType = ESimplexType.TETRAHEDRON;

    @serializable
    private _vertices: IVec3Like[] = [
        new Vec3(0, 0, 0),
        new Vec3(0, 0, 1),
        new Vec3(1, 0, 0),
        new Vec3(0, 1, 0),
    ];

    constructor () {
        super(EColliderType.SIMPLEX);
    }

    updateVertices () {
        if (!EDITOR && !TEST) {
            this.shape.setVertices(this._vertices);
        }
    }

}

export namespace SimplexCollider {
    export type ESimplexType = EnumAlias<typeof ESimplexType>;
}
