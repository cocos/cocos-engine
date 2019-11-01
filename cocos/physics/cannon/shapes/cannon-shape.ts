import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { getWrap, setWrap } from '../../util';
import { commitShapeUpdates } from '../cannon-util';
import { PhysicMaterial } from '../../assets/physic-material';
import { IBaseShape } from '../../spec/i-physics-spahe';
import { IVec3Like } from '../../../core/math/type-define';
import { ColliderComponent, PhysicsSystem } from '../../../../exports/physics-framework';
import { CannonSharedBody } from '../cannon-shared-body';
import { CannonWorld } from '../cannon-world';
import { Node } from '../../../core';
import { TriggerEventType } from '../../export-api';

const TriggerEventObject = {
    type: 'onTriggerEnter' as TriggerEventType,
    selfCollider: null as unknown as ColliderComponent,
    otherCollider: null as unknown as ColliderComponent,
};

export class CannonShape implements IBaseShape {

    static readonly idToMaterial = {};
    get shape () {
        return this._shape!;
    }

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
    }

    set center (v: IVec3Like) {
        const lpos = this.offset as IVec3Like;
        Vec3.copy(lpos, v);
        Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
        commitShapeUpdates(this._body);
    }

    get collider () { return this._collider; }

    get attachedRigidBody () {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get sharedBody (): CannonSharedBody { return this._sharedBody; }

    _collider!: ColliderComponent;
    readonly offset = new CANNON.Vec3();
    readonly quaterion = new CANNON.Quaternion();

    protected _shape!: CANNON.Shape;
    protected _sharedBody!: CannonSharedBody;
    protected get _body (): CANNON.Body { return this._sharedBody.body; }
    protected onTriggerListener = this.onTrigger.bind(this);

    __preload (comp: ColliderComponent) {
        this._collider = comp;
        setWrap(this._shape, this);
        this._shape.addEventListener('triggered', this.onTriggerListener);
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this._collider.node as Node);
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

    }

    onTrigger (event: CANNON.ITriggeredEvent) {
        TriggerEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);
        TriggerEventObject.selfCollider = self.collider;
        TriggerEventObject.otherCollider = other.collider;
        this._collider.emit(TriggerEventObject.type, TriggerEventObject);

        // if (self.collider.node.hasChangedFlags) {
        //     self.sharedBody.syncSceneToPhysics();
        // }

        // if (other.collider.node.hasChangedFlags) {
        //     other.sharedBody.syncSceneToPhysics();
        // }
    }

    /** group */
    public getGroup (): number {
        return this._body.collisionFilterGroup;
    }

    public setGroup (v: number): void {
        this._body.collisionFilterGroup = v;
    }

    public addGroup (v: number): void {
        this._body.collisionFilterGroup |= v;
    }

    public removeGroup (v: number): void {
        this._body.collisionFilterGroup &= ~v;
    }

    /** mask */
    public getMask (): number {
        return this._body.collisionFilterMask;
    }

    public setMask (v: number): void {
        this._body.collisionFilterMask = v;
    }

    public addMask (v: number): void {
        this._body.collisionFilterMask |= v;
    }

    public removeMask (v: number): void {
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
}
