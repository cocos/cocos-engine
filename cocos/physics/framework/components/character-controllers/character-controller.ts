/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable func-names */
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
    ccclass, help, disallowMultiple, executeInEditMode, menu, executionOrder,
    tooltip, displayOrder, visible, type, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { Vec3, error, warn, CCFloat } from '../../../../core';
import { Component } from '../../../../scene-graph';
import { IBaseCharacterController } from '../../../spec/i-character-controller';
import { ECharacterControllerType } from '../../physics-enum';
import { selector, createCharacterController } from '../../physics-selector';
import { PhysicsSystem } from '../../physics-system';

const v3_0 = new Vec3(0, 0, 0);

/**
 * @en
 * Base class for Character Controller component.
 * @zh
 * 角色控制器组件基类。
 */
@ccclass('cc.CharacterController')
export class CharacterController extends Component {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    @type(CCFloat)
    public get stepOffset () {
        return this._stepOffset;
    }

    public set stepOffset (value) {
        if (this._stepOffset === value) return;
        this._stepOffset = Math.abs(value);
        if (this._cct) {
            this._cct.setStepOffset(value);
        }
    }

    @type(CCFloat)
    public get slopeLimit () {
        return this._slopeLimit;
    }

    public set slopeLimit (value) {
        if (this._slopeLimit === value) return;
        this._slopeLimit = Math.abs(value);
        if (this._cct) {
            this._cct.setSlopeLimit(value);
        }
    }

    @type(CCFloat)
    public get contactOffset () {
        return this._contactOffset;
    }

    public set contactOffset (value) {
        if (this._contactOffset === value) return;
        this._contactOffset = Math.abs(value);
        if (this._cct) {
            this._cct.setContactOffset(value);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get characterController () {
        return this._cct;
    }

    /**
     * @en
     * Gets the type of this character controller.
     * @zh
     * 获取此的类型。
     */
    readonly TYPE: ECharacterControllerType;

    constructor (type: ECharacterControllerType) {
        super();
        this.TYPE = type;
    }

    protected _cct: IBaseCharacterController | null = null; //lowLevel instance

    /// PRIVATE PROPERTY ///
    @serializable
    public _stepOffset = 1.0;
    @serializable
    public _slopeLimit = 45.0; //degree
    //@serializable
    private _minMoveDistance = 0; //[ 0, infinity ]
    //@serializable
    public _density = 10.0;
    //@serializable
    public _scaleCoeff = 0.8;//0.8;
    //@serializable
    public _volumeGrowth = 1.5;//1.5;
    @serializable
    public _contactOffset = 0.01;

    private _initialized = false;

    protected get _isInitialized (): boolean {
        if (this._cct === null || !this._initialized) {
            //error('[Physics]: This component has not been call onLoad yet, please make sure the node has been added to the scene.');
            return false;
        } else {
            return true;
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!selector.runInEditor) return;
        this._cct = createCharacterController(this.TYPE);
        this._initialized = this._cct.initialize(this);
        //this._cct.onLoad();
    }

    protected onEnable () {
        if (this._cct) {
            this._cct.onEnable!();
        }
    }

    protected onDisable () {
        if (this._cct) {
            this._cct.onDisable!();
        }
    }

    protected onDestroy () {
        if (this._cct) {
            this._cct.onDestroy!();
        }
    }

    /// PUBLIC METHOD ///

    /**
     * @en
     * Gets the position.
     * @zh
     * 获取位置。
     * @param out @zh 位置向量 @en The position vector
     */
    public getPosition (out: Vec3) {
        if (this._isInitialized) this._cct!.getPosition(out);
    }

    /**
     * @en
     * Sets the position.
     * @zh
     * 设置位置。
     * @param value @zh 位置向量 @en The position vector
     */
    public setPosition (value: Vec3): void {
        if (this._isInitialized) this._cct!.setPosition(value);
    }

    /**
     * @en
     * .
     * @zh
     * 。
     * @param value @zh  @en
     */
    onGround (): boolean {
        return this._cct!.onGround();
    }

    /**
     * @en
     * Move.
     * @zh
     * 。
     * @param value @zh  @en
     */
    public move (movement: Vec3): void {
        if (!this._isInitialized) { return; }

        const elapsedTime = PhysicsSystem.instance.fixedTimeStep;
        this._cct!.move(movement, this._minMoveDistance, elapsedTime, 0);

        //sync physics position to scene
        // this._cct!.getPosition(v3_0);
        // this.node.setWorldPosition(v3_0);
    }
}
