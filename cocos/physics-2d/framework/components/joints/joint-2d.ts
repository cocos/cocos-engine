/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { Vec2, _decorator, tooltip, serializable } from '../../../../core';
import { RigidBody2D } from '../rigid-body-2d';
import { IJoint2D } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { createJoint } from '../../physics-selector';
import { Component } from '../../../../scene-graph';

const { ccclass, type, property } = _decorator;

@ccclass('cc.Joint2D')
export class Joint2D extends Component {
    /**
     * @en
     * The position of Joint2D in the attached rigid body's local space.
     * @zh
     * 在自身刚体的本地空间中，Joint2D的位置。
     */
    @serializable
    @tooltip('i18n:physics2d.joint.anchor')
    anchor = new Vec2();

    /**
     * @en
     * The position of Joint2D in the connected rigid body's local space.
     * @zh
     * 在连接刚体的本地空间中，Joint2D的位置。
     */
    @serializable
    @tooltip('i18n:physics2d.joint.connectedAnchor')
    connectedAnchor = new Vec2();

    /**
     * @en
     * whether collision is turned on between two rigid bodies connected by a joint.
     * @zh
     * 关节连接的两刚体之间是否开启碰撞。
     */
    @serializable
    @tooltip('i18n:physics2d.joint.collideConnected')
    collideConnected = false;

    /**
     * @en
     * The jointed rigid body, null means link to a static rigid body at the world origin.
     * @zh
     * 关节连接的刚体，为空时表示连接到位于世界原点的静态刚体。
     */
    @type(RigidBody2D)
    @serializable
    @tooltip('i18n:physics2d.joint.connectedBody')
    connectedBody: RigidBody2D | null = null;

    /**
     * @en
     * the Joint2D attached rigid-body.
     * @zh
     * 关节所绑定的刚体组件。
     */
    _body: RigidBody2D | null = null;
    get body (): RigidBody2D | null {
        return this._body;
    }

    get impl (): IJoint2D | null {
        return this._joint;
    }

    protected _joint: IJoint2D | null = null;

    /**
     * @en
     * the type of this joint.
     * @zh
     * 此关节的类型。
     */
    TYPE = EJoint2DType.None;

    protected onLoad (): void {
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._joint = createJoint(this.TYPE);
            this._joint.initialize(this);

            this._body = this.getComponent(RigidBody2D);
        }
    }

    protected onEnable (): void {
        if (this._joint && this._joint.onEnable) {
            this._joint.onEnable();
        }
    }

    protected onDisable (): void {
        if (this._joint && this._joint.onDisable) {
            this._joint.onDisable();
        }
    }

    protected start (): void {
        if (this._joint && this._joint.start) {
            this._joint.start();
        }
    }

    protected onDestroy (): void {
        if (this._joint && this._joint.onDestroy) {
            this._joint.onDestroy();
        }
    }

    /**
     * @en
     * If the physics engine is box2d, need to call this function to apply current changes to joint, this will regenerate inner box2d joint.
     * @zh
     * 如果物理引擎是 box2d, 需要调用此函数来应用当前 joint 中的修改。
     */
    apply (): void {
        if (this._joint && this._joint.apply) {
            this._joint.apply();
        }
    }
}
