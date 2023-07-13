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
import { IBoxCharacterController } from '../../../spec/i-character-controller';
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
@ccclass('cc.BoxCharacterController')
@help('i18n:cc.BoxCharacterController')
@menu('Physics/BoxCharacterController')
@executeInEditMode
@executionOrder(-1)
export class BoxCharacterController extends CharacterController {
    constructor () {
        super(ECharacterControllerType.BOX);
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///
    /**
     * @en
     * Gets or sets the half height of the box shape of the CharacterController in local space.
     * @zh
     * 获取或设置立方体在本地坐标系下的高度的一半。
     */
    @tooltip('i18n:physics3d.character_controller.boxHalfHeight')
    @type(CCFloat)
    public get halfHeight (): number {
        return this._halfHeight;
    }

    public set halfHeight (value) {
        if (this._halfHeight === value) return;
        this._halfHeight = Math.abs(value);
        if (this._cct) {
            (this._cct as IBoxCharacterController).setHalfHeight(value);
        }
    }

    /**
     * @en
     * Gets or sets the half side extent of box shape of the CharacterController in local space.
     * @zh
     * 获取或设置立方体在本地坐标系下的横向宽度的一半。
     */
    @tooltip('i18n:physics3d.character_controller.boxHalfSideExtent')
    @type(CCFloat)
    public get halfSideExtent (): number {
        return this._halfSideExtent;
    }

    public set halfSideExtent (value) {
        if (this._halfSideExtent === value) return;
        this._halfSideExtent = Math.abs(value);
        if (this._cct) {
            (this._cct as IBoxCharacterController).setHalfSideExtent(value);
        }
    }

    /**
     * @en
     * Gets or sets the half forward extent of the box on the CharacterController in local space.
     * @zh
     * 获取或设置立方体在本地坐标系下的纵向宽度一半。
     */
    @tooltip('i18n:physics3d.character_controller.boxHalfForwardExtent')
    @type(CCFloat)
    public get halfForwardExtent (): number {
        return this._halfForwardExtent;
    }

    public set halfForwardExtent (value) {
        if (this._halfForwardExtent === value) return;
        this._halfForwardExtent = Math.abs(value);
        if (this._cct) {
            (this._cct as IBoxCharacterController).setHalfForwardExtent(value);
        }
    }

    /// PRIVATE PROPERTY ///
    @serializable
    private _halfHeight = 0.5;
    @serializable
    private _halfSideExtent = 0.5;
    @serializable
    private _halfForwardExtent = 0.5;
}
