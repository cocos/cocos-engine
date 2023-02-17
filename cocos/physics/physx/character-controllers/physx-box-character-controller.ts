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

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { error, IVec3Like, Vec3 } from '../../../core';
import { boolean } from '../../../core/data/decorators';
import { PhysicsSystem, Collider, EColliderType, CapsuleCollider, BoxCollider } from '../../framework';
import { BoxCharacterController } from '../../framework/components/character-controllers/box-character-controller';
import { IBoxCharacterController } from '../../spec/i-character-controller';
import { createBoxCharacterController, PX, _trans } from '../physx-adapter';
import { PhysXCharacterController } from './physx-character-controller';
import { PhysXInstance } from '../physx-instance';
import { PhysXWorld } from '../physx-world';

const v3_0 = new Vec3(0, 0, 0);
export class PhysXBoxCharacterController extends PhysXCharacterController implements IBoxCharacterController {
    get component (): BoxCharacterController {
        return this._comp as BoxCharacterController;
    }

    onComponentSet (): void {
        this.component.node.getWorldPosition(v3_0);
        const upDir = new Vec3(0, 1, 0);//temp
        const mat = PhysXInstance.physics.createMaterial(0.5, 0.5, 0.5);//temp
        //const mat = collider.material;//PhysXInstance.physics.createMaterial(0.5, 0.5, 0.5);//temp

        const cctMgr = (PhysicsSystem.instance.physicsWorld as PhysXWorld).controllerManager;
        this._impl = createBoxCharacterController(cctMgr, this.component._halfHeight, this.component._halfSideExtent,
            this.component._halfForwardExtent, v3_0, this.component._stepOffset, this.component._slopeLimit,
            this.component._density, this.component._scaleCoeff, this.component._volumeGrowth, this.component._contactOffset, upDir, mat);
    }

    setHalfHeight (value: number): void {
        this._impl.setHalfHeight(value);
    }

    setHalfSideExtent (value: number): void {
        this._impl.setHalfSideExtent(value);
    }

    setHalfForwardExtent (value: number): void {
        this._impl.setHalfForwardExtent(value);
    }
}
