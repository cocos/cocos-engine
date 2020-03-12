/**
 * @category physics
 */

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { ColliderComponent } from './collider-component';
import { createTrimeshShape } from '../../instance';
import { Mesh } from '../../../../core';

/**
 * @zh
 * 三角网格碰撞器
 */
@ccclass('cc.MeshColliderComponent')
@executionOrder(98)
@menu('Physics/MeshColliderComponent')
@executeInEditMode
export class MeshColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @property({
        type: Mesh,
    })
    public get mesh () {
        return this._mesh;
    }

    public set mesh (value) {
        this._mesh = value;
    }

    // @property
    // public get convex () {
    //     return this._convex;
    // }

    // public set convex (value) {
    //     this._convex = value;
    // }

    /// PRIVATE PROPERTY ///

    @property
    private _mesh: Mesh | null = null;

    // @property
    // private _convex: boolean = false;

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createTrimeshShape();
        }
    }
}
