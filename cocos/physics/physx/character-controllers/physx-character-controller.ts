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
import { PhysicsSystem  } from '../../framework';
import { CharacterController } from '../../framework/components/character-controllers/character-controller';
import { IBaseCharacterController } from '../../spec/i-character-controller';
import { getWrapShape, PX, _trans } from '../physx-adapter';
import { EFilterDataWord3 } from '../physx-enum';
import { PhysXInstance } from '../physx-instance';
import { PhysXWorld } from '../physx-world';
import { PhysXShape } from '../shapes/physx-shape';

const v3_0 = new Vec3(0, 0, 0);
export class PhysXCharacterController implements IBaseCharacterController {
    private _isEnabled = false;
    protected _impl: any = null;
    protected _comp: CharacterController = null as any;
    private _pxCollisionFlags = 0;//: PX.PxControllerCollisionFlags;
    private _filterData: any;
    private _queryFilterCB: any = null;
    protected _word3 = 0;

    get isEnabled (): boolean { return this._isEnabled; }
    get impl (): any { return this._impl; }
    get characterController (): CharacterController { return this._comp; }

    get filterData () {
        return this._filterData;
    }

    get queryFilterCB () {
        return this._queryFilterCB;
    }

    constructor () {
        this._filterData = { word0: 1, word1: 1, word2: 10000, word3: 0 };
    }

    // virtual
    protected onComponentSet (): void { }
    protected create (): void { }

    initialize (comp: CharacterController): boolean {
        this._comp = comp;

        this._queryFilterCB = PX.PxQueryFilterCallback.implement(this.queryCallback);

        const group = this._comp.group;
        this._filterData.word0 = this._comp.group;
        const mask = PhysicsSystem.instance.collisionMatrix[group];
        this._filterData.word1 = mask;

        this.onComponentSet();

        if (this._impl == null) {
            error('[Physics]: PhysXCharacterController Initialize createCapsuleCharacterController Failed');
            return false;
        } else {
            (PhysicsSystem.instance.physicsWorld as PhysXWorld).addCCT(this);
            return true;
        }
    }

    onEnable (): void {
        this._isEnabled = true;
    }

    onDisable (): void {
        this._isEnabled = false;
    }

    onLoad (): void {

    }

    release (): void {
        if (this._impl) {
            if (this._impl.$$) {
                PX.IMPL_PTR[this._impl.$$.ptr] = null;
                delete PX.IMPL_PTR[this._impl.$$.ptr];
            }
            this._impl.release();
            this._impl = null;
        }
    }

    onDestroy (): void {
        this.release();

        (PhysicsSystem.instance.physicsWorld as PhysXWorld).removeCCT(this);
    }

    getPosition (out: IVec3Like): void {
        Vec3.copy(out, this._impl.getPosition());
    }

    setPosition (value: IVec3Like): void {
        this._impl.setPosition(value);
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
        return (this._pxCollisionFlags & (1 << 2)) > 0;//PxControllerCollisionFlag::Enum::eCOLLISION_DOWN
    }

    syncPhysicsToScene (): void {
        this.getPosition(v3_0);
        this._comp.node.setWorldPosition(v3_0);
    }

    // eNONE = 0,   //!< the query should ignore this shape
    // eTOUCH = 1,  //!< a hit on the shape touches the intersection geometry of the query but does not block it
    // eBLOCK = 2   //!< a hit on the shape blocks the query (does not block overlap queries)
    queryCallback = {
        preFilter (filterData: any, shape: any, _actor: any, _out: any): number {
            const collider = getWrapShape<PhysXShape>(shape).collider;
            if (!(filterData.word0 & collider.getMask()) || !(filterData.word1 & collider.getGroup())) {
                return PX.QueryHitType.eNONE;
            }

            // Ignore trigger shape
            // this is done in physx::Cct::findTouchedGeometry
            // Ubi (EA) : Discarding Triggers
            // const shapeFlags = shape.getFlags();
            // if (shapeFlags.isSet(PX.ShapeFlag.eTRIGGER_SHAPE)) {
            //     return PX.QueryHitType.eNONE;
            // }

            return PX.QueryHitType.eBLOCK;
        },
    };

    move (movement: IVec3Like, minDist: number, elapsedTime: number) {
        this._pxCollisionFlags = this._impl.move(movement, minDist, elapsedTime, this.filterData, this.queryFilterCB);
    }

    setGroup (v: number): void {
        v >>>= 0; //convert to unsigned int(32bit) for physx
        this._filterData.word0 = v;
        this.updateFilterData();
    }

    getGroup (): number {
        return this._filterData.word0;
    }

    addGroup (v: number): void {
        v >>>= 0; //convert to unsigned int(32bit) for physx
        this._filterData.word0 |= v;
        this.updateFilterData();
    }

    removeGroup (v: number): void {
        v >>>= 0; //convert to unsigned int(32bit) for physx
        this._filterData.word0 &= ~v;
        this.updateFilterData();
    }

    setMask (v: number): void {
        v >>>= 0; //convert to unsigned int(32bit) for physx
        this._filterData.word1 = v;
        this.updateFilterData();
    }

    getMask (): number {
        return this._filterData.word1;
    }

    addMask (v: number): void {
        v >>>= 0; //convert to unsigned int(32bit) for physx
        this._filterData.word1 |= v;
        this.updateFilterData();
    }

    removeMask (v: number): void {
        v >>>= 0; //convert to unsigned int(32bit) for physx
        this._filterData.word1 &= ~v;
        this.updateFilterData();
    }

    updateEventListener () {
        if (this._comp.needTriggerEvent) {
            this._filterData.word3 |= EFilterDataWord3.DETECT_TRIGGER_EVENT;
        }
        this.updateFilterData();
    }

    updateFilterData () {
        // this._impl.setQueryFilterData(filterData);
        this._impl.setSimulationFilterData(this.filterData);
    }
}
