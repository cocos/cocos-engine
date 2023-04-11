/* eslint-disable @typescript-eslint/no-namespace */
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

import { ccclass, requireComponent, displayOrder, type, readOnly, serializable, tooltip } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Component } from '../../../../scene-graph';
import { RigidBody } from '../rigid-body';
import { Eventify, cclegacy } from '../../../../core';
import { IBaseConstraint } from '../../../spec/i-physics-constraint';
import { selector, createConstraint } from '../../physics-selector';
import { EConstraintType } from '../../physics-enum';

/**
 * @en
 * Base class for joint constraints, which depends on rigid body components.
 * @zh
 * 关节约束的基类，它依赖于刚体组件。
 */
@ccclass('cc.Constraint')
@requireComponent(RigidBody)
export class Constraint extends Eventify(Component) {
    /**
     * @en
     * Enumeration of joint types.
     * @zh
     * 关节类型的枚举。
     */
    static readonly Type = EConstraintType;

    /**
     * @en
     * The rigid body where the constraint is attached to.
     * @zh
     * 约束附着的刚体。
     */
    @type(RigidBody)
    @readOnly
    @displayOrder(-2)
    @tooltip('i18n:physics3d.constraint.attachedBody')
    get attachedBody (): RigidBody | null {
        return this.getComponent(RigidBody);
    }

    /**
     * @en
     * The rigid body connected to the constraint, if not set, it will be connected to the world.
     * @zh
     * 约束连接的刚体， 未设置时为世界坐标系。
     */
    @type(RigidBody)
    @displayOrder(-1)
    @tooltip('i18n:physics3d.constraint.connectedBody')
    get connectedBody (): RigidBody | null {
        return this._connectedBody;
    }

    set connectedBody (v: RigidBody | null) {
        this._connectedBody = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            if (this._constraint) this._constraint.setConnectedBody(v);
        }
    }

    /**
     * @en
     * Whether to enable collision between the two rigid bodies.
     * @zh
     * 是否开启两个刚体之间的碰撞。
     */
    @displayOrder(0)
    @tooltip('i18n:physics3d.constraint.enableCollision')
    get enableCollision () {
        return this._enableCollision;
    }

    set enableCollision (v) {
        this._enableCollision = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            if (this._constraint) this._constraint.setEnableCollision(v);
        }
    }

    /**
     * @en
     * Gets the type of this joint.
     * @zh
     * 获取此关节的类型。
     */
    readonly TYPE: EConstraintType;

    /// PROTECTED PROPERTY ///

    @serializable
    protected _enableCollision = true;

    @type(RigidBody)
    protected _connectedBody: RigidBody | null = null;

    protected _constraint: IBaseConstraint | null = null;

    constructor (type: EConstraintType) {
        super();
        this.TYPE = type;
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!selector.runInEditor) return;
        this._constraint = createConstraint(this.TYPE);
        this._constraint.initialize(this);
    }

    protected onEnable () {
        if (this._constraint) {
            this._constraint.onEnable!();
        }
    }

    protected onDisable () {
        if (this._constraint) {
            this._constraint.onDisable!();
        }
    }

    protected onDestroy () {
        if (this._constraint) {
            this._constraint.onDestroy!();
        }
    }
}

export namespace Constraint {
    export type Type = EnumAlias<typeof EConstraintType>;
}
