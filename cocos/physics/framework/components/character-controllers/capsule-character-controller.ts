/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
import { ICapsuleCharacterController } from '../../../spec/i-character-controller';
import { ECharacterControllerType } from '../../physics-enum';
import { selector, createCharacterController } from '../../physics-selector';
import { PhysicsSystem } from '../../physics-system';
import { CharacterController } from './character-controller';

const v3_0 = new Vec3(0, 0, 0);

/**
 * @en
 * Character Controller component.
 * @zh
 * 角色控制器组件。
 */
@ccclass('cc.CapsuleCharacterController')
@help('i18n:cc.CapsuleCharacterController')
@menu('Physics/CapsuleCharacterController')
@executeInEditMode
@executionOrder(-1)
export class CapsuleCharacterController extends CharacterController {
    constructor () {
        super(ECharacterControllerType.CAPSULE);
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///
    /**
     * @en
     * Gets or sets the radius of the sphere of the capsule shape of the CharacterController in local space.
     * @zh
     * 获取或设置在本地坐标系下的胶囊体球半径。
     */
    @tooltip('i18n:physics3d.character_controller.capsuleRadius')
    @type(CCFloat)
    public get radius (): number {
        return this._radius;
    }

    public set radius (value) {
        if (this._radius === value) return;
        this._radius = Math.abs(value);
        if (this._cct) {
            (this._cct as ICapsuleCharacterController).setRadius(value);
        }
    }

    /**
     * @en
     * Gets or sets the height of the capsule shape of the CharacterController in local space.
     * Height the distance between the two sphere centers at the end of the capsule.
     * @zh
     * 获取或设置在本地坐标系下的胶囊体末端两个球心的距离。
     */
    @tooltip('i18n:physics3d.character_controller.capsuleHeight')
    @type(CCFloat)
    public get height (): number {
        return this._height;
    }

    public set height (value) {
        if (this._height === value) return;
        this._height = Math.abs(value);
        if (this._cct) {
            (this._cct as ICapsuleCharacterController).setHeight(value);
        }
    }

    /// PRIVATE PROPERTY ///
    @serializable
    private _radius = 0.5;
    @serializable
    private _height = 1.0;
}
