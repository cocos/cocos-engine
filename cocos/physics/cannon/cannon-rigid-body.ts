import CANNON from '@cocos/cannon';
import { Vec3 } from '../../core/math';
import { IRigidBody } from '../spec/i-rigid-body';
import { CannonSharedBody } from './cannon-shared-body';
import { Node } from '../../core';
import { CannonWorld } from './cannon-world';
import { PhysicsSystem } from '../framework/physics-system';
import { RigidBodyComponent } from '../framework';

const v3_cannon0 = new CANNON.Vec3();
const v3_cannon1 = new CANNON.Vec3();

/**
 * wraped shared body
 * dynamic
 * kinematic
 */
export class CannonRigidBody implements IRigidBody {

    get isAwake (): boolean {
        return this._body.isAwake();
    }

    get isSleepy (): boolean {
        return this._body.isSleepy();
    }

    get isSleeping (): boolean {
        return this._body.isSleeping();
    }

    set allowSleep (v: boolean) {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.allowSleep = v;
    }

    set mass (value: number) {
        this._body.mass = value;
        if (this._body.mass == 0) {
            this._body.type = CANNON.Body.STATIC;
        }

        this._body.updateMassProperties();

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
    }

    set isKinematic (value: boolean) {
        if (this._body.mass == 0) {
            this._body.type = CANNON.Body.STATIC;
        } else {
            if (value) {
                this._body.type = CANNON.Body.KINEMATIC;
            } else {
                this._body.type = CANNON.Body.DYNAMIC;
            }
        }
    }

    set fixedRotation (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.fixedRotation = value;
        this._body.updateMassProperties();
    }

    set linearDamping (value: number) {
        this._body.linearDamping = value;
    }

    set angularDamping (value: number) {
        this._body.angularDamping = value;
    }

    set useGravity (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.useGravity = value;
    }

    set linearFactor (value: Vec3) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.linearFactor, value);
    }

    set angularFactor (value: Vec3) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.angularFactor, value);
    }

    get rigidBody () {
        return this._rigidBody;
    }

    get sharedBody () {
        return this._sharedBody;
    }

    get isEnabled () {
        return this._isEnabled;
    }

    private _rigidBody!: RigidBodyComponent;
    private _sharedBody!: CannonSharedBody;
    private get _body () { return this._sharedBody.body; }

    private _isEnabled = false;

    /** LIFECYCLE */

    __preload (com: RigidBodyComponent) {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this._rigidBody.node as Node);
        this._sharedBody.reference = true;
        this._sharedBody.wrappedBody = this;
    }

    onLoad () {
    }

    onEnable () {
        this._isEnabled = true;
        this.mass = this._rigidBody.mass;
        this.allowSleep = this._rigidBody.allowSleep;
        this.linearDamping = this._rigidBody.linearDamping;
        this.angularDamping = this._rigidBody.angularDamping;
        this.useGravity = this._rigidBody.useGravity;
        this.isKinematic = this._rigidBody.isKinematic;
        this.fixedRotation = this._rigidBody.fixedRotation;
        this.linearFactor = this._rigidBody.linearFactor;
        this.angularFactor = this._rigidBody.angularFactor;
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    /** INTERFACE */

    wakeUp (): void {
        return this._body.wakeUp();
    }

    sleep (): void {
        return this._body.sleep();
    }

    getLinearVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.velocity);
        return out;
    }

    setLinearVelocity (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.velocity, value);
    }

    getAngularVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.angularVelocity);
        return out;
    }

    setAngularVelocity (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.angularVelocity, value);
    }

    applyForce (force: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, worldPoint));
    }

    applyImpulse (impulse: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, worldPoint));
    }

    applyLocalForce (force: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, localPoint));
    }

    applyLocalImpulse (impulse: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, localPoint));
    }

    applyTorque (torque: Vec3): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.torque.x += torque.x;
        this._body.torque.y += torque.y;
        this._body.torque.z += torque.z;
    }

    applyLocalTorque (torque: Vec3): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        Vec3.copy(v3_cannon0, torque);
        this._body.vectorToWorldFrame(v3_cannon0, v3_cannon0);
        this._body.torque.x += v3_cannon0.x;
        this._body.torque.y += v3_cannon0.y;
        this._body.torque.z += v3_cannon0.z;
    }

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

}