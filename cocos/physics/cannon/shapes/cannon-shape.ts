import CANNON from '@cocos/cannon';
import { Quat, Vec3 } from '../../../core/math';
import { ITriggerCallback, ITriggerEventType, ShapeBase } from '../../api';
import { getWrap, stringfyVec3 } from '../../util';
import { commitShapeUpdates } from '../cannon-util';
import { PhysicMaterial } from '../../assets/physic-material';
import { IBaseShape } from '../../spec/IPhysicsSpahe';
import { IVec3Like } from '../../../core/math/type-define';
import { ColliderComponent, RigidBodyComponent } from '../../../../exports/physics-framework';
import { CannonRigidBody } from '../cannon-body';

export class CannonShape implements IBaseShape {

    static readonly idToMaterial = {};
    get impl () {
        return this._shape!;
    }

    protected _shape!: CANNON.Shape;

    protected _body!: CANNON.Body;

    private _index: number = -1;

    private _onTriggerListener: (event: CANNON.ITriggeredEvent) => any;

    get index () {
        return this._index;
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
        this._shape.collisionResponse = v;
    }

    set center (v: IVec3Like) {
        const lpos = this._body.shapeOffsets[this._index] as IVec3Like;
        Vec3.copy(lpos, v);
        Vec3.multiply(lpos, lpos, this.collider.node.worldScale);
        commitShapeUpdates(this._body);
    }

    collider!: ColliderComponent;
    wrapBody!: CannonRigidBody | null;
    constructor () {
        this._onTriggerListener = this.onTrigger.bind(this);
    }

    setBody (body: CANNON.Body, index: number) {
        this._body = body;
        this._index = index;
    }

    onTrigger (event: CANNON.ITriggeredEvent) {
        TriggerEventObject.type = event.event;
        TriggerEventObject.selfCollider = getWrap<ShapeBase>(event.selfShape).getUserData();
        TriggerEventObject.otherCollider = getWrap<ShapeBase>(event.otherShape).getUserData();
        // TriggerEventObject.selfRigidBody = getWrap<RigidBodyBase>(event.selfBody).getUserData();
        // TriggerEventObject.otherRigidBody = getWrap<RigidBodyBase>(event.otherBody).getUserData();
        this.collider.emit(TriggerEventObject.type, TriggerEventObject);
    }

    __preload () {
        this._shape.addEventListener('triggered', this._onTriggerListener);
    }

    onLoad () {

    }

    onEnable () {
        if (this._index < 0) {
            if (this.wrapBody) {
                this.wrapBody.addShape(this);
            }
        }
    }

    onDisable () {
        if (this.wrapBody) {
            this.wrapBody.removeShape(this);
        }
    }

    onDestroy () {

    }
}

const TriggerEventObject = {
    type: '' as unknown as ITriggerEventType,
    selfCollider: null,
    otherCollider: null,
    // selfRigidBody: null,
    // otherRigidBody: null,
};
