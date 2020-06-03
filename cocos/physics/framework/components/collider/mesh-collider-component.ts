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
import { ColliderComponent } from './collider-component';
import { createTrimeshShape } from '../../instance';
import { Mesh } from '../../../../core';
import { ITrimeshShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';

/**
 * @en
 * Triangle mesh collider component.
 * @zh
 * 三角网格碰撞器。
 */
@ccclass('cc.MeshColliderComponent')
@help('i18n:cc.MeshColliderComponent')
@executionOrder(98)
@menu('Physics/MeshCollider')
@executeInEditMode
export class MeshColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the mesh assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    @property({
        type: Mesh,
    })
    get mesh () {
        return this._mesh;
    }

    set mesh (value) {
        this._mesh = value;
        if (!EDITOR && !TEST) this.shape.setMesh(this._mesh);
    }

    // @property
    // get convex () {
    //     return this._convex;
    // }

    // set convex (value) {
    //     this._convex = value;
    // }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape () {
        return this._shape as ITrimeshShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _mesh: Mesh | null = null;

    // @property
    // private _convex: boolean = false;

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createTrimeshShape();
        }
    }
}
