/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    type,
    editable,
    serializable,
    tooltip,
} from 'cc.decorator';
import { Collider } from './collider';
import { Mesh } from '../../../../3d/assets';
import { ITrimeshShape } from '../../../spec/i-physics-shape';
import { EColliderType, ERigidBodyType } from '../../physics-enum';
import { warnID } from '../../../../core';
import { RigidBody } from '../rigid-body';

/**
 * @en
 * Triangle mesh collider component.
 * @zh
 * 三角网格碰撞器。
 */
@ccclass('cc.MeshCollider')
@help('i18n:cc.MeshCollider')
@menu('Physics/MeshCollider')
@executeInEditMode
export class MeshCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the mesh assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    @type(Mesh)
    @tooltip('i18n:physics3d.collider.mesh_mesh')
    get mesh (): Mesh | null {
        return this._mesh;
    }

    set mesh (value) {
        if (this._mesh === value) return;
        this._mesh = value;
        if (this._shape) this.shape.setMesh(this._mesh);
    }

    /**
     * @en
     * Gets or sets whether the collider replaces the mesh with a convex shape.
     * @zh
     * 获取或设置此碰撞体是否用凸形状代替网格.
     */
    @editable
    @tooltip('i18n:physics3d.collider.mesh_convex')
    get convex (): boolean {
        return this._convex;
    }

    set convex (value) {
        if (this._convex === value) return;
        this._convex = value;

        if (this._shape && this._mesh) this.shape.setMesh(this._mesh);
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape (): ITrimeshShape {
        return this._shape as ITrimeshShape;
    }

    protected onEnable (): void {
        super.onEnable();

        if (this.node) {
            const body = this.node.getComponent(RigidBody);
            if (body && body.isValid && (body.type === ERigidBodyType.DYNAMIC) && !this.convex) {
                warnID(9630, this.node.name);
            }
        }
    }

    @serializable
    private _mesh: Mesh | null = null;

    @serializable
    private _convex = false;

    constructor () {
        super(EColliderType.MESH);
    }
}
