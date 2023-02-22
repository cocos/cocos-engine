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
import { CharacterController } from '../../framework/components/character-controllers/character-controller';
import { IBaseCharacterController } from '../../spec/i-character-controller';
import { createBoxCharacterController, PX, _trans } from '../physx-adapter';
import { PhysXInstance } from '../physx-instance';
import { PhysXWorld } from '../physx-world';

const v3_0 = new Vec3(0, 0, 0);
export class PhysXCharacterController implements IBaseCharacterController {
    private _isEnabled = false;
    protected _impl: any = null;
    protected _comp: CharacterController = null as any;
    private _pxLastCollisionFlags = 0;//: PX.PxControllerCollisionFlags;

    get isEnabled (): boolean { return this._isEnabled; }
    get impl (): any { return this._impl; }
    get characterController (): CharacterController { return this._comp; }

    // virtual
    protected onComponentSet (): void { }

    initialize (comp: CharacterController): boolean {
        this._comp = comp;

        this.onComponentSet();

        if (this._impl == null) {
            error('[Physics]: PhysXCharacterController Initialize createCapsuleCharacterController Failed');
            return false;
        } else {
            (PhysicsSystem.instance.physicsWorld as PhysXWorld).addCCT(this);
            //this._filterData = { word0: 1, word1: 1, word2: 0, word3: 0 };
            return true;
        }
    }

    // initialize (comp: CharacterController): boolean {
    //     this._comp = comp;

    //     const collider = comp.node.getComponent(Collider);
    //     if (!collider) {
    //         error('[Physics]: Character Controller Needs A Capsule or Box Collider');
    //         return false;
    //     }

    //     if (collider.type !== EColliderType.BOX && collider.type !== EColliderType.CAPSULE) {
    //         error('[Physics]: Character Controller Only Supports Capsule and Box Collider');
    //         return false;
    //     }

    //     comp.node.getWorldPosition(v3_0);
    //     console.log('initialize pos', v3_0.x, v3_0.y, v3_0.z);
    //     const upDir = new Vec3(0, 1, 0);//temp
    //     const mat = PhysXInstance.physics.createMaterial(0.5, 0.5, 0.5);//temp
    //     //const mat = collider.material;//PhysXInstance.physics.createMaterial(0.5, 0.5, 0.5);//temp
    //     this._pxWorld = PhysicsSystem.instance.physicsWorld as PhysXWorld;

    //     const cctMgr = this._pxWorld.controllerManager;
    //     if (collider.type === EColliderType.CAPSULE) {
    //         const capsuleCollider = (collider as CapsuleCollider);
    //         this._impl = createCapsuleCharacterController(cctMgr, capsuleCollider.radius,
    //             capsuleCollider.cylinderHeight, v3_0, comp._stepOffset,
    //             comp._slopeLimit, comp._density, comp._scaleCoeff, comp._volumeGrowth, comp._contactOffset, upDir, mat);
    //     } else if (collider.type === EColliderType.BOX) {
    //         const boxCollider = (collider as BoxCollider);
    //         this._impl = createBoxCharacterController(cctMgr, boxCollider.size.x * 0.5,
    //             boxCollider.size.y * 0.5, boxCollider.size.z * 0.5, v3_0, comp._stepOffset,
    //             comp._slopeLimit, comp._density, comp._scaleCoeff, comp._volumeGrowth, comp._contactOffset, upDir, mat);
    //     }

    //     if (this._impl == null) {
    //         error('[Physics]: PhysXCharacterController Initialize createCapsuleCharacterController Failed');
    //         return false;
    //     }

    //     this._pxWorld.addCCT(this);
    //     //this._filterData = { word0: 1, word1: 1, word2: 0, word3: 0 };

    //     return true;
    // }

    onEnable (): void {
        this._isEnabled = true;
    }

    onDisable (): void {
        this._isEnabled = false;
    }

    onDestroy (): void {
        if (this._impl) {
            if (this._impl.$$) {
                PX.IMPL_PTR[this._impl.$$.ptr] = null;
                delete PX.IMPL_PTR[this._impl.$$.ptr];
            }
            this._impl.release();
            this._impl = null;
        }

        (PhysicsSystem.instance.physicsWorld as PhysXWorld).removeCCT(this);
    }

    getPosition (out: IVec3Like): void {
        Vec3.copy(out, this._impl.getPosition());
    }

    setPosition (value: IVec3Like): void {
        this._impl.setLinearVelocity(value);
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
        //debug
        // const pos = new Vec3();
        // this.getPosition(pos);
        // console.log('before move pos', pos.x, pos.y, pos.z);

        this._pxLastCollisionFlags = this._impl.move(movement, minDist, elapsedTime);

        // //debug
        // this.getPosition(pos);
        // console.log('after move pos', pos.x, pos.y, pos.z);
        // console.log('this.onGround():', this.onGround());
    }
}
