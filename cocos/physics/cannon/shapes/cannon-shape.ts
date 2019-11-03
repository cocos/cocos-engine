import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { getWrap, setWrap } from '../../framework/util';
import { commitShapeUpdates } from '../cannon-util';
import { PhysicMaterial } from '../../framework/assets/physic-material';
import { IBaseShape } from '../../spec/i-physics-spahe';
import { IVec3Like } from '../../../core/math/type-define';
import { CannonSharedBody } from '../cannon-shared-body';
import { CannonWorld } from '../cannon-world';
import { Node } from '../../../core';
import { TriggerEventType } from '../../framework/physics-interface';
import { ERigidBodyType } from '../../framework/physics-enum';
import { PhysicsSystem } from '../../framework/physics-system';
import { ColliderComponent } from '../../framework';

const TriggerEventObject = {
    type: 'onTriggerEnter' as TriggerEventType,
    selfCollider: null as ColliderComponent | null,
    otherCollider: null as ColliderComponent | null,
};

export class CannonShape implements IBaseShape {

    static readonly idToMaterial = {};

    get shape () { return this._shape!; }

    get collider () { return this._collider; }

    get attachedRigidBody () {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get sharedBody (): CannonSharedBody { return this._sharedBody; }

    set material (mat: PhysicMaterial) {
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
        const type = v ? ERigidBodyType.DYNAMIC : ERigidBodyType.STATIC;
        this._body.type = type;
        // if (this._index >= 0) {
        //     this._body.updateHasTrigger();
        // }
    }

    set center (v: IVec3Like) {
        const lpos = this._offset as IVec3Like;
        Vec3.copy(lpos, v);
        Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }

    _collider!: ColliderComponent;

    protected _shape!: CANNON.Shape;
    protected _offset = new CANNON.Vec3();
    protected _orient = new CANNON.Quaternion();
    protected _index: number = -1;
    protected _sharedBody!: CannonSharedBody;
    protected get _body (): CANNON.Body { return this._sharedBody.body; }
    protected onTriggerListener = this.onTrigger.bind(this);

    /** LIFECYCLE */

    __preload (comp: ColliderComponent) {
        this._collider = comp;
        setWrap(this._shape, this);
        this._shape.addEventListener('triggered', this.onTriggerListener);
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this._collider.node as Node);
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
        (this._sharedBody as any) = null;
        setWrap(this._shape, null);
        (this._offset as any) = null;
        (this._orient as any) = null;
        (this._shape as any) = null;
        (this._collider as any) = null;
        (this.onTriggerListener as any) = null;
    }

    /** INTERFACE */

    /** group */
    getGroup (): number {
        return this._body.collisionFilterGroup;
    }

    setGroup (v: number): void {
        this._body.collisionFilterGroup = v;
    }

    addGroup (v: number): void {
        this._body.collisionFilterGroup |= v;
    }

    removeGroup (v: number): void {
        this._body.collisionFilterGroup &= ~v;
    }

    /** mask */
    getMask (): number {
        return this._body.collisionFilterMask;
    }

    setMask (v: number): void {
        this._body.collisionFilterMask = v;
    }

    addMask (v: number): void {
        this._body.collisionFilterMask |= v;
    }

    removeMask (v: number): void {
        this._body.collisionFilterMask &= ~v;
    }

    /**
     * change scale will recalculate center & size \
     * size handle by child class
     * @param scale 
     */
    setScale (scale: IVec3Like) {
        this.center = this._collider.center;
    }

    setIndex (index: number) {
        this._index = index;
    }

    setOffsetAndOrient (offset: CANNON.Vec3, Orient: CANNON.Quaternion) {
        this._offset = offset;
        this._orient = Orient;
    }

    private onTrigger (event: CANNON.ITriggeredEvent) {
        TriggerEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);

        if (self) {
            TriggerEventObject.selfCollider = self.collider;
            TriggerEventObject.otherCollider = other ? other.collider : null;
            this._collider.emit(TriggerEventObject.type, TriggerEventObject);

            // if (self.collider.node.hasChangedFlags) {
            //     self.sharedBody.syncSceneToPhysics();
            // }

            // if (other.collider.node.hasChangedFlags) {
            //     other.sharedBody.syncSceneToPhysics();
            // }
        }
    }
}
