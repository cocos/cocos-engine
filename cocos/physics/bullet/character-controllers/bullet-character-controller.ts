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
import { CharacterControllerContact, PhysicsSystem  } from '../../framework';
import { CharacterController } from '../../framework/components/character-controllers/character-controller';
import { IBaseCharacterController } from '../../spec/i-character-controller';
import { BulletCache } from '../bullet-cache';
import { bullet2CocosVec3, cocos2BulletVec3 } from '../bullet-utils';
import { BulletWorld } from '../bullet-world';
import { bt } from '../instantiated';
import { PhysicsGroup } from '../../framework/physics-enum';
import { BulletShape } from '../shapes/bullet-shape';
import { BulletRigidBody } from '../bullet-rigid-body';
import { degreesToRadians } from '../../../core/utils/misc';

const v3_0 = new Vec3(0, 0, 0);
const v3_1 = new Vec3(0, 0, 0);
const v3_2 = new Vec3(0, 0, 0);
export abstract class BulletCharacterController implements IBaseCharacterController {
    private _isEnabled = false;
    protected _impl: any = null; //btCapsuleCharacterController
    protected _comp: CharacterController = null as any;
    private _btCollisionFlags = 0;//: PX.PxControllerCollisionFlags;
    private _filterData: any;
    //private _queryFilterCB: any = null;
    protected _word3 = 0;

    private _collisionFilterGroup: number = PhysicsSystem.PhysicsGroup.DEFAULT;
    private _collisionFilterMask = -1;

    get isEnabled (): boolean { return this._isEnabled; }
    get impl (): any { return this._impl; }
    get characterController (): CharacterController { return this._comp; }

    // get filterData () {
    //     return this._filterData;
    // }

    // get queryFilterCB () {
    //     return this._queryFilterCB;
    // }

    constructor () {
        this._filterData = { word0: 1, word1: 1, word2: 10000, word3: 0 };
    }

    // virtual
    protected onComponentSet (): void { }

    initialize (comp: CharacterController): boolean {
        this._comp = comp;

        //this._queryFilterCB = PX.PxQueryFilterCallback.implement(this.queryCallback);

        // const group = this._comp.group;
        // this._filterData.word0 = this._comp.group;
        // const mask = PhysicsSystem.instance.collisionMatrix[group];
        // this._filterData.word1 = mask;

        const group = this._comp.group;
        const mask =  PhysicsSystem.instance.collisionMatrix[group];
        this._collisionFilterGroup = group;
        this._collisionFilterMask = mask;

        this.onComponentSet();

        if (this._impl == null) {
            error('[Physics]: BulletCharacterController Initialize createCapsuleCharacterController Failed');
            return false;
        } else {
            this.setDetectCollisions(this._comp.detectCollisions);
            (PhysicsSystem.instance.physicsWorld as BulletWorld).addCCT(this);
            this.setWrapper();
            return true;
        }
    }

    setWrapper () {
        if (BulletCache.isNotEmptyShape(this._impl)) {
            //bt.CollisionShape_setUserPointer(this._impl, this._impl);
            BulletCache.setWrapper(this._impl, bt.CCT_CACHE_NAME, this);
        }
    }

    onEnable (): void {
        this._isEnabled = true;
    }

    onDisable (): void {
        this._isEnabled = false;
    }

    onDestroy (): void {
        // if (this._impl) {
        //     if (this._impl.$$) {
        //         PX.IMPL_PTR[this._impl.$$.ptr] = null;
        //         delete PX.IMPL_PTR[this._impl.$$.ptr];
        //     }
        //     this._impl.release();
        //     this._impl = null;
        // }

        (PhysicsSystem.instance.physicsWorld as BulletWorld).removeCCT(this);
    }

    onLoad (): void {

    }

    getPosition (out: IVec3Like): void {
        bullet2CocosVec3(out, bt.CharacterController_getPosition(this.impl));
    }

    setPosition (value: IVec3Like): void {
        cocos2BulletVec3(bt.CharacterController_getPosition(this.impl), value);
    }

    setContactOffset (value: number): void {
        bt.CharacterController_setContactOffset(this._impl, value);
    }

    setStepOffset (value: number): void {
        bt.CharacterController_setStepOffset(this._impl, value);
    }

    setSlopeLimit (value: number): void {
        bt.CharacterController_setSlopeLimit(this._impl, degreesToRadians(value));
    }

    setDetectCollisions (value: boolean): void {
        bt.CharacterController_setCollision(this.impl, value);
    }

    onGround (): boolean {
        return (this._btCollisionFlags & (1 << 2)) > 0;//btControllerCollisionFlag::Enum::BULLET_CONTROLLER_COLLISION_DOWN
    }

    syncPhysicsToScene (): void {
        this.getPosition(v3_0);
        v3_0.subtract(this._comp.center);
        this._comp.node.setWorldPosition(v3_0);
    }

    // // eNONE = 0,   //!< the query should ignore this shape
    // // eTOUCH = 1,  //!< a hit on the shape touches the intersection geometry of the query but does not block it
    // // eBLOCK = 2   //!< a hit on the shape blocks the query (does not block overlap queries)
    // queryCallback = {
    //     preFilter (filterData: any, shape: any, _actor: any, _out: any): number {
    //         const collider = getWrapShape<PhysXShape>(shape).collider;
    //         if (!(filterData.word0 & collider.getMask()) || !(filterData.word1 & collider.getGroup())) {
    //             return PX.QueryHitType.eNONE;
    //         }

    //         // Ignore trigger shape
    //         // this is done in physx::Cct::findTouchedGeometry
    //         // Ubi (EA) : Discarding Triggers
    //         // const shapeFlags = shape.getFlags();
    //         // if (shapeFlags.isSet(PX.ShapeFlag.eTRIGGER_SHAPE)) {
    //         //     return PX.QueryHitType.eNONE;
    //         // }

    //         return PX.QueryHitType.eBLOCK;
    //     },
    // };

    move (movement: IVec3Like, minDist: number, elapsedTime: number) {
        //this._btCollisionFlags = this._impl.move(movement, minDist, elapsedTime);//, this.filterData, this.queryFilterCB);
        const movementBT = BulletCache.instance.BT_V3_0;
        bt.Vec3_set(movementBT, movement.x, movement.y, movement.z);
        this._btCollisionFlags = bt.CharacterController_move(this.impl, movementBT, minDist, elapsedTime);//, this.filterData, this.queryFilterCB);
    }

    setGroup (v: number): void {
        if (v !== this._collisionFilterGroup) {
            this._collisionFilterGroup = v;
            // this.dirty |= EBtSharedBodyDirty.BODY_RE_ADD;
            // this.dirty |= EBtSharedBodyDirty.GHOST_RE_ADD;
        }
    }

    getGroup (): number {
        return this._collisionFilterGroup;
    }

    addGroup (v: number): void {
        this._collisionFilterGroup |= v;
    }

    removeGroup (v: number): void {
        this._collisionFilterGroup &= ~v;
    }

    setMask (v: number): void {
        if (v !== this._collisionFilterGroup) {
            this._collisionFilterMask = v;
            // this.dirty |= EBtSharedBodyDirty.BODY_RE_ADD;
            // this.dirty |= EBtSharedBodyDirty.GHOST_RE_ADD;
        }
    }

    getMask (): number {
        return this._collisionFilterMask;
    }

    addMask (v: number): void {
        this._collisionFilterMask |= v;
    }

    removeMask (v: number): void {
        this._collisionFilterMask &= ~v;
    }

    //todo
    updateFilterData () {
        // if (this._comp.needTriggerEvent) {
        //     this._filterData.word3 |= EFilterDataWord3.DETECT_TRIGGER_EVENT;
        // }

        // this.setFilerData(this.filterData);
    }
    //todo
    setFilerData (filterData: any) {
        // this._impl.setQueryFilterData(filterData);
        this._impl.setSimulationFilterData(filterData);
    }
    //todo
    updateEventListener () {
        this.updateFilterData();
    }

    onShapeHitExt (hit: number) {
        const shapePtr = bt.ControllerShapeHit_getHitShape(hit);
        const bulletWorld = (PhysicsSystem.instance.physicsWorld as BulletWorld);
        //use characterController impl and shape impl pair as key
        let item = bulletWorld.cctShapeEventDic.get<any>(this.impl, shapePtr);
        if (!item) {
            const worldPos = new Vec3();
            bullet2CocosVec3(worldPos, bt.ControllerHit_getHitWorldPos(hit));
            const worldNormal = new Vec3();
            bullet2CocosVec3(worldNormal, bt.ControllerHit_getHitWorldNormal(hit));
            const motionDir = new Vec3();
            bullet2CocosVec3(motionDir, bt.ControllerHit_getHitMotionDir(hit));
            const motionLength = bt.ControllerHit_getHitMotionLength(hit);
            const s: BulletShape = BulletCache.getWrapper(shapePtr, BulletShape.TYPE);
            item = bulletWorld.cctShapeEventDic.set(this.impl, shapePtr,
                { BulletCharacterController: this, BulletShape: s, worldPos, worldNormal, motionDir, motionLength });
        }
    }
}
