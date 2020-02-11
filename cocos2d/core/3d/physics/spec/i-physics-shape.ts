/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { IVec3Like } from "../../../value-types/math";
import { Collider3D, RigidBody3D } from '../exports/physics-framework';

/**
 * !#en Base shape interface.
 * @class IBaseShape
 */
export interface IBaseShape {
    /**
     * @property {Collider3D} collider
     */
    readonly collider: Collider3D;
    /**
     * @property {RigidBody3D | null} attachedRigidBody
     */
    readonly attachedRigidBody: RigidBody3D | null;
    /**
     * @property {any} material
     */
    material: any;
    /**
     * @property {boolean} isTrigger
     */
    isTrigger: boolean;
    /**
     * @property {IVec3Like} center
     */
    center: IVec3Like;
}

/**
 * !#en box shape interface
 * @class IBoxShape
 */
export interface IBoxShape extends IBaseShape {
    /**
     * @property {IVec3Like} size
     */
    size: IVec3Like;
}

/**
 * !#en Sphere shape interface
 * @class ISphereShape
 */
export interface ISphereShape extends IBaseShape {
    /**
     * @property {number} radius
     */
    radius: number;
}

