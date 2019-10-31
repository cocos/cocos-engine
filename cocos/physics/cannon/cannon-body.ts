import CANNON from '@cocos/cannon';
import { Mat4, Quat, Vec3 } from '../../core/math';
import { ICollisionCallback, ICollisionEventType, ICreateBodyOptions, PhysicsWorldBase, RigidBodyBase, ShapeBase } from '../api';
import { ERigidBodyType } from '../physic-enum';
import { getWrap, setWrap, stringfyVec3 } from '../util';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';
import { IRigidBody } from '../spec/IRigidBody';
import { RigidBodyComponent } from '../components/rigid-body-component';
import { ColliderComponent, PhysicsSystem } from '../../../exports/physics-framework';
import { INode } from '../../core/utils/interfaces';

/**
 * sharedbody, node : sharedbody = 1 : 1
 * static
 */
export class CannonSharedBody {
    private _node: INode;
    private _body: CANNON.Body;
    private _shapes: CannonShape[] = [];

    

    addShape (shape: CannonShape) {
        const offset = Vec3.subtract(new Vec3(), shape.collider.node.worldPosition, this._node.worldPosition);
        offset.add(shape.collider.center);
        this._body.addShape(shape.impl, new CANNON.Vec3(offset.x, offset.y, offset.z));
        this._shapes.push(shape);
        shape.setBody(this._body, this._body.shapes.length - 1);
    }

    removeShape (shape: CannonShape) {
        const index = this._shapes.indexOf(shape);
        if (index >= 0) {
            this._shapes.splice(index, 1);
            (this._body as any).removeShape(shape.impl);
            shape.setBody(null as any, -1);
        }
    }

    syncSceneToPhysics () {
        if (this._node.hasChangedFlags) {
            Vec3.copy(this._body.position, this._node.worldPosition);
            Quat.copy(this._body.quaternion, this._node.worldRotation);
        }
    }
}

/**
 * wraped shared body
 * dynamic
 * kinematic
 */
export class CannonRigidBody implements IRigidBody {

    get impl (): CANNON.Body {
        return this._body;
    }

    private _shareBody: CannonSharedBody;
    private _body: CANNON.Body;
    index: number = -1;
    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;
    private _shapes: CannonShape[] = [];
    private _world!: CannonWorld;

    rigidBody!: RigidBodyComponent;

    constructor (options?: ICreateBodyOptions) {
        super();
        this._onCollidedListener = this._onCollided.bind(this);
    }

    /** LIFECYCLE */

    __preload () {
        this._world = PhysicsSystem.instance._world as CannonWorld;
        this._body = this._world.getBody(this.rigidBody.node.uuid);
        this._body.addEventListener('collide', this._onCollidedListener);
    }

    onLoad () {
        /** initialize */
        const colliders = this.rigidBody.getComponents(ColliderComponent);
        let hasEnabled = false;
        if (colliders.length > 0) {
            for (let i = 0; i < colliders.length; i++) {
                if (colliders[i].enabled) {
                    hasEnabled = true;
                }
            }
        }

        if (hasEnabled) {
            this._world.impl.addBody(this._body);
            this.index = this._world.impl.bodies.length - 1;
        }
    }

    onEnable () {
        if (this.index < 0) { this._world.impl.addBody(this._body); }
        this.mass = this.rigidBody.mass;
        this.allowSleep = this.rigidBody.allowSleep;
        this.linearDamping = this.rigidBody.linearDamping;
        this.angularDamping = this.rigidBody.angularDamping;
        this.useGravity = this.rigidBody.useGravity;
        this.isKinematic = this.rigidBody.isKinematic;
        this.fixedRotation = this.rigidBody.fixedRotation;
        this.linearFactor = this.rigidBody.linearFactor;
        this.angularFactor = this.rigidBody.angularFactor;
    }

    onDisable () {
        this._world.impl.remove(this._body);
        this.index = -1;
    }

    onDestroy () {

    }

    /** */

    addShape (shape: CannonShape) {
        const offset = Vec3.subtract(new Vec3(), shape.collider.node.worldPosition, this.rigidBody.node.worldPosition);
        offset.add(shape.collider.center);
        this._body.addShape(shape.impl, new CANNON.Vec3(offset.x, offset.y, offset.z));
        this._shapes.push(shape);
        shape.setBody(this._body, this._body.shapes.length - 1);
    }

    removeShape (shape: CannonShape) {
        const index = this._shapes.indexOf(shape);
        if (index >= 0) {
            this._shapes.splice(index, 1);
            (this._body as any).removeShape(shape.impl);
            shape.setBody(null as any, -1);
        }
    }

    syncSceneToPhysics () {
        Vec3.copy(this._body.position, this.rigidBody.node.worldPosition);
        Quat.copy(this._body.quaternion, this.rigidBody.node.worldRotation);
    }

    syncPhysicsToScene () {
        this.rigidBody.node.worldPosition = Vec3.clone(this._body.position);
        this.rigidBody.node.worldRotation = Quat.clone(this._body.quaternion);
    }


    /** allow sleep */
    public get allowSleep (): boolean {
        return this._body.allowSleep;
    }

    public set allowSleep (v: boolean) {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.allowSleep = v;
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

    public wakeUp (): void {
        return this._body.wakeUp();
    }
    public sleep (): void {
        return this._body.sleep();
    }

    public get isAwake (): boolean {
        return this._body.isAwake();
    }

    public get isSleepy (): boolean {
        return this._body.isSleepy();
    }

    public get isSleeping (): boolean {
        return this._body.isSleeping();
    }

    public set mass (value: number) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.mass = value;
        this._body.updateMassProperties();
    }

    public set isKinematic (value: boolean) {
        if (value) {
            this._body.type = CANNON.Body.KINEMATIC;
        } else {
            this._body.type = CANNON.Body.DYNAMIC;
        }
    }

    public set fixedRotation (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.fixedRotation = value;
        this._body.updateMassProperties();
    }

    public get linearDamping () {
        return this._body.linearDamping;
    }

    public set linearDamping (value: number) {
        this._body.linearDamping = value;
    }

    public get angularDamping () {
        return this._body.angularDamping;
    }

    public set angularDamping (value: number) {
        this._body.angularDamping = value;
    }

    public set useGravity (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.useGravity = value;
    }

    public set linearFactor (value: Vec3) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.linearFactor, value);
    }

    public set angularFactor (value: Vec3) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.angularFactor, value);
    }

    public getLinearVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.velocity);
        return out;
    }

    public setLinearVelocity (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.velocity, value);
    }

    public getAngularVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.angularVelocity);
        return out;
    }

    public setAngularVelocity (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.angularVelocity, value);
    }

    public applyForce (force: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyForce(Vec3.copy(_tCannonV1, force), Vec3.copy(_tCannonV2, worldPoint));
    }

    public applyImpulse (impulse: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyImpulse(Vec3.copy(_tCannonV1, impulse), Vec3.copy(_tCannonV2, worldPoint));
    }

    public applyLocalForce (force: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalForce(Vec3.copy(_tCannonV1, force), Vec3.copy(_tCannonV2, localPoint));
    }

    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalImpulse(Vec3.copy(_tCannonV1, impulse), Vec3.copy(_tCannonV2, localPoint));
    }

    public applyTorque (torque: Vec3): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.torque.x += torque.x;
        this._body.torque.y += torque.y;
        this._body.torque.z += torque.z;
    }

    public applyLocalTorque (torque: Vec3): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        Vec3.copy(_tCannonV1, torque);
        this._body.vectorToWorldFrame(_tCannonV1, _tCannonV1);
        this._body.torque.x += _tCannonV1.x;
        this._body.torque.y += _tCannonV1.y;
        this._body.torque.z += _tCannonV1.z;
    }

    // public scaleAllShapes (scale: Vec3) {
    //     for (const shape of this._shapes) {
    //         shape.setScale(scale);
    //     }
    // }

    private _onCollided (event: CANNON.ICollisionEvent) {
        CollisionEventObject.type = event.event;
        CollisionEventObject.selfCollider = getWrap<ShapeBase>(event.selfShape).getUserData();
        CollisionEventObject.otherCollider = getWrap<ShapeBase>(event.otherShape).getUserData();
        // CollisionEventObject.selfRigidBody = getWrap<RigidBodyBase>(event.target).getUserData();
        // CollisionEventObject.otherRigidBody = getWrap<RigidBodyBase>(event.body).getUserData();

        let i = 0;
        for (i = CollisionEventObject.contacts.length; i--;) {
            contactsPool.push(CollisionEventObject.contacts.pop());
        }

        for (i = 0; i < event.contacts.length; i++) {
            const cq = event.contacts[i];
            if (contactsPool.length > 0) {
                const c = contactsPool.pop();
                Vec3.copy(c.contactA, cq.ri);
                Vec3.copy(c.contactB, cq.rj);
                Vec3.copy(c.normal, cq.ni);
                CollisionEventObject.contacts.push(c);
            } else {
                const c = {
                    contactA: Vec3.copy(new Vec3(), cq.ri),
                    contactB: Vec3.copy(new Vec3(), cq.rj),
                    normal: Vec3.copy(new Vec3(), cq.ni),
                };
                CollisionEventObject.contacts.push(c);
            }
        }

        for (i = 0; i < this._shapes.length; i++) {
            const shape = this._shapes[i];
            shape.collider.emit(CollisionEventObject.type, CollisionEventObject);
        }
    }

}

const CollisionEventObject = {
    type: 'onCollisionEnter' as ICollisionEventType,
    selfCollider: null,
    otherCollider: null,
    // selfRigidBody: null,
    // otherRigidBody: null,
    contacts: [] as any,
};

const contactsPool = [] as any;

const _tCannonV1 = new CANNON.Vec3();

const _tCannonV2 = new CANNON.Vec3();