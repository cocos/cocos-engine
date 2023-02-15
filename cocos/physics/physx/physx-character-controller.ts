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
import { IVec3Like, Vec3 } from '../../core';
import { boolean } from '../../core/data/decorators';
import { PhysicsSystem, CharacterController } from '../framework';
import { ICharacterController } from '../spec/i-character-controller';
import { createCapsuleCharacterController, createBoxCharacterController, PX, _trans } from './physx-adapter';
import { PhysXInstance } from './physx-instance';
import { PhysXWorld } from './physx-world';

const v3_0 = new Vec3(0, 0, 0);
export class PhysXCharacterController implements ICharacterController {
    private _isEnabled = false;
    protected _impl: PX.PxCapsuleController = null;
    protected _comp: CharacterController = null as any;
    private _pxLastCollisionFlags = 0;//: PX.PxControllerCollisionFlags;
    private _pxWorld: any = null;

    get isEnabled (): boolean { return this._isEnabled; }
    get impl (): any { return this._impl; }

    onComponentSet (): void {
    }

    initialize (comp: CharacterController): void {
        this._comp = comp;

        comp.node.getWorldPosition(v3_0);
        console.log('initialize pos', v3_0.x, v3_0.y, v3_0.z);
        const upDir = new Vec3(0, 1, 0);//temp
        const mat = PhysXInstance.physics.createMaterial(0.5, 0.5, 0.5);//temp
        this._pxWorld = PhysicsSystem.instance.physicsWorld as PhysXWorld;
        const cctMgr = this._pxWorld.controllerManager;
        //this._impl = createCapsuleCharacterController(cctMgr, comp._radius, comp._height, worldPos, comp._stepHeight, comp._maxSlope, comp._density, comp._scaleCoeff, comp._volumeGrowth, comp._contactOffset, upDir, mat);
        this._impl = createBoxCharacterController(cctMgr, comp._radius, comp._radius, comp._radius, v3_0, comp._stepOffset, comp._slopeLimit, comp._density, comp._scaleCoeff, comp._volumeGrowth, comp._contactOffset, upDir, mat);
        if (this._impl == null) {
            console.log('PhysXCharacterController initialize createCapsuleCharacterController failed');
            return;
        }

        this._pxWorld.addCCT(this);
        //this._filterData = { word0: 1, word1: 1, word2: 0, word3: 0 };
    }

    onEnable (): void {
        this._isEnabled = true;
    }

    onDisable (): void {
        this._isEnabled = false;
    }

    onDestroy (): void {
        if (this._impl) {
            this._impl.release();
            this._impl = null;
        }

        if (this._pxWorld) {
            this._pxWorld.removeCCT(this);
        }
    }

    getPosition (out: IVec3Like): void {
        Vec3.copy(out, this._impl.getPosition());
    }

    setPosition (value: IVec3Like): void {
        this._impl.setLinearVelocity(value);
    }

    setRadius (value: number): void {
        this._impl.setRadius(value);
    }

    setContactOffset (value: number): void {
        this._impl.setContactOffset(value);
    }

    setStepOffset (value: number): void {
        this._impl.setStepOffset(value);
    }

    setSlopeLimit (value: number): void {
        this._impl.setSlopeLimit(value);
    }

    setHeight (value: number): void {
        this._impl.setHeight(value);
    }

    onGround (): boolean {
        //return (this._pxLastControllerCollisionFlags & PX.PxControllerCollisionFlag::Enum::eCOLLISION_DOWN);
        return (this._pxLastCollisionFlags & (1 << 2)) > 0;
    }

    syncPhysicsToScene (): void {
        this.getPosition(v3_0);
        this._comp.node.setWorldPosition(v3_0);
    }

    move (movement: IVec3Like, minDist: number, elapsedTime: number, filters: any) {
        //const filterData = new PX.PxFilterData();
        //const filter = new PX.PxControllerFilters(this._filterData, 0, 0);
        const pos = new Vec3();
        this.getPosition(pos);
        console.log('before move pos', pos.x, pos.y, pos.z);

        this._pxLastCollisionFlags = this._impl.move(movement, minDist, elapsedTime);

        //debug
        this.getPosition(pos);
        console.log('after move pos', pos.x, pos.y, pos.z);
        console.log('this.onGround():', this.onGround());
    }
}
