import CANNON from 'cannon';
import { Quat, Vec3 } from '../../../../core/value-types';
import { vec3 } from '../../../../core/vmath';
import { ITriggerCallback, ITriggerEvent, ITriggerEventType, RigidBodyBase, ShapeBase } from '../../api';
import { getWrap, stringfyVec3 } from '../../util';
import { commitShapeUpdates } from '../cannon-util';

export class CannonShape implements ShapeBase {

    public get impl () {
        return this._shape!;
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);

    protected _shape: CANNON.Shape | null = null;

    protected _body: CANNON.Body | null = null;

    private _index: number = -1;

    private _center: Vec3 = new Vec3(0, 0, 0);

    private _userData: any;

    private _onTriggerListener: (event: CANNON.ITriggeredEvent) => any;

    private _triggeredCB: ITriggerCallback[] = [];

    public constructor () {
        this._onTriggerListener = this.onTrigger.bind(this);
    }

    public addTriggerCallback (callback: ITriggerCallback): void {
        this._triggeredCB.push(callback);
    }

    public removeTriggerCallback (callback: ITriggerCallback): void {
        const i = this._triggeredCB.indexOf(callback);
        if (i >= 0) {
            this._triggeredCB.splice(i, 1);
        }
    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public setBody (body: CANNON.Body | null, index: number){
        if (body == null) {
            this._shape!.removeEventListener('triggered', this._onTriggerListener);
        } else {
            this._shape!.addEventListener('triggered', this._onTriggerListener);
        }
        this._body = body;
        this._index = index;
    }

    public setCenter (center: Vec3): void {
        vec3.copy(this._center, center);
        this._recalcCenter();
    }

    public setScale (scale: Vec3): void {
        vec3.copy(this._scale, scale);
        this._recalcCenter();
    }

    public setRotation (rotation: Quat): void {

    }

    public getCollisionResponse (): boolean {
        return this.impl.collisionResponse;
    }

    public setCollisionResponse (v: boolean): void {
        this.impl.collisionResponse = v;
    }

    public _devStrinfy () {
        if (!this._body) {
            return `<NotAttached>`;
        }
        return `centerOffset: ${stringfyVec3(this._body.shapeOffsets[this._index])}`;
    }

    public onTrigger (event: CANNON.ITriggeredEvent) {
        TriggerEventObject.type = event.event;
        TriggerEventObject.selfCollider = getWrap<ShapeBase>(event.selfShape).getUserData();
        TriggerEventObject.otherCollider = getWrap<ShapeBase>(event.otherShape).getUserData();
        // TriggerEventObject.selfRigidBody = getWrap<RigidBodyBase>(event.selfBody).getUserData();
        // TriggerEventObject.otherRigidBody = getWrap<RigidBodyBase>(event.otherBody).getUserData();
        for (const callback of this._triggeredCB) {
            callback(TriggerEventObject);
        }
    }

    private _recalcCenter () {
        if (!this._body) {
            return;
        }
        const shapeOffset = this._body.shapeOffsets[this._index];
        vec3.copy(shapeOffset, this._center);
        vec3.multiply(shapeOffset, shapeOffset, this._scale);
        // console.log(`[[CANNON]] Set shape offset to (${shapeOffset.x}, ${shapeOffset.y}, ${shapeOffset.z}).`);

        commitShapeUpdates(this._body);
    }
}

const TriggerEventObject = {
    type: '' as unknown as ITriggerEventType,
    selfCollider: null,
    otherCollider: null,
    // selfRigidBody: null,
    // otherRigidBody: null,
};
