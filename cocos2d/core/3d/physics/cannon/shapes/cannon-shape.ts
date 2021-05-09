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

import CANNON from '../../../../../../external/cannon/cannon';
import { getWrap, setWrap } from '../../framework/util';
import { commitShapeUpdates, deprecatedEventMap } from '../cannon-util';
import { PhysicsMaterial } from '../../framework/assets/physics-material';
import { IBaseShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../spec/i-common';
import { CannonSharedBody } from '../cannon-shared-body';
import { CannonWorld } from '../cannon-world';
import { TriggerEventType } from '../../framework/physics-interface';
import { Collider3D } from '../../framework';

const TriggerEventObject = {
    type: 'trigger-enter' as TriggerEventType,
    selfCollider: null as Collider3D | null,
    otherCollider: null as Collider3D | null,
};

const Vec3 = cc.Vec3;
const v3_0 = new Vec3();

export class CannonShape implements IBaseShape {

    static readonly idToMaterial = {};

    get shape () { return this._shape!; }

    get collider () { return this._collider; }

    get attachedRigidBody () {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get sharedBody (): CannonSharedBody { return this._sharedBody; }

    set material (mat: PhysicsMaterial) {
        if (mat == null) {
            (this._shape!.material as unknown) = null;
        } else {
            if (CannonShape.idToMaterial[mat._uuid] == null) {
                CannonShape.idToMaterial[mat._uuid] = new CANNON.Material(mat._uuid);
            }

            this._shape!.material = CannonShape.idToMaterial[mat._uuid];
            this._shape!.material.friction = mat.friction;
            this._shape!.material.restitution = mat.restitution;
        }
    }

    set isTrigger (v: boolean) {
        this._shape.collisionResponse = !v;
        if (this._index >= 0) {
            this._body.updateHasTrigger();
        }
    }

    set center (v: IVec3Like) {
        this._setCenter(v);
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }

    _collider!: Collider3D;

    protected _shape!: CANNON.Shape;
    protected _offset = new CANNON.Vec3();
    protected _orient = new CANNON.Quaternion();
    protected _index: number = -1;
    protected _sharedBody!: CannonSharedBody;
    protected get _body (): CANNON.Body { return this._sharedBody.body; }
    protected onTriggerListener = this.onTrigger.bind(this);

    /** LIFECYCLE */

    __preload (comp: Collider3D) {
        this._collider = comp;
        setWrap(this._shape, this);
        this._shape.addEventListener('cc-trigger', this.onTriggerListener);
        this._sharedBody = (cc.director.getPhysics3DManager().physicsWorld as CannonWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
    }

    onLoad () {
        this.center = this._collider.center;
        this.isTrigger = this._collider.isTrigger;
    }

    onEnable () {
        this._sharedBody.addShape(this);
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._sharedBody.removeShape(this);
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        this._shape.removeEventListener('cc-trigger', this.onTriggerListener);
        delete CANNON.World['idToShapeMap'][this._shape.id];
        (this._sharedBody as any) = null;
        setWrap(this._shape, null);
        (this._offset as any) = null;
        (this._orient as any) = null;
        (this._shape as any) = null;
        (this._collider as any) = null;
        (this.onTriggerListener as any) = null;
    }

    /**
     * change scale will recalculate center & size \
     * size handle by child class
     * @param scale 
     */
    setScale (scale: IVec3Like) {
        this._setCenter(this._collider.center);
    }

    setIndex (index: number) {
        this._index = index;
    }

    setOffsetAndOrient (offset: CANNON.Vec3, orient: CANNON.Quaternion) {
        cc.Vec3.copy(offset, this._offset);
        cc.Vec3.copy(orient, this._orient);
        this._offset = offset;
        this._orient = orient;
    }

    protected _setCenter (v: IVec3Like) {
        const lpos = this._offset as IVec3Like;
        Vec3.copy(lpos, v);
        this._collider.node.getWorldScale(v3_0);
        Vec3.multiply(lpos, lpos, v3_0);
    }

    private onTrigger (event: CANNON.ITriggeredEvent) {
        TriggerEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);

        if (self) {
            TriggerEventObject.selfCollider = self.collider;
            TriggerEventObject.otherCollider = other ? other.collider : null;
            TriggerEventObject.type = deprecatedEventMap[TriggerEventObject.type];
            this._collider.emit(TriggerEventObject.type, TriggerEventObject);
            // adapt 
            TriggerEventObject.type = event.event;
            this._collider.emit(TriggerEventObject.type, TriggerEventObject);
        }
    }
}
