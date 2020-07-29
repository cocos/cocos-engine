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

import CANNON from '../../../../../external/cannon/cannon';
import { ERigidBodyType } from '../framework/physics-enum';
import { getWrap } from '../framework/util';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';
import { Collider3D } from '../exports/physics-framework';
import { CollisionEventType } from '../framework/physics-interface';
import { CannonRigidBody } from './cannon-rigid-body';
import { groupIndexToBitMask } from './cannon-util'
import { updateWorldTransform, updateWorldRT } from "../framework/util"

const LocalDirtyFlag = cc.Node._LocalDirtyFlag;
const PHYSICS_SCALE = LocalDirtyFlag.PHYSICS_SCALE;
const Quat = cc.Quat;
const Vec3 = cc.Vec3;
const fastRemoveAt = cc.js.array.fastRemoveAt;
const v3_0 = new Vec3();
const quat_0 = new Quat();
const contactsPool = [] as any;
const CollisionEventObject = {
    type: 'collision-enter' as CollisionEventType,
    selfCollider: null as Collider3D | null,
    otherCollider: null as Collider3D | null,
    contacts: [] as any,
};

/**
 * sharedbody, node : sharedbody = 1 : 1
 * static
 */
export class CannonSharedBody {

    private static readonly sharedBodiesMap = new Map<string, CannonSharedBody>();

    static getSharedBody (node: cc.Node, wrappedWorld: CannonWorld) {
        const key = node._id;
        if (CannonSharedBody.sharedBodiesMap.has(key)) {
            return CannonSharedBody.sharedBodiesMap.get(key)!;
        } else {
            const newSB = new CannonSharedBody(node, wrappedWorld);
            CannonSharedBody.sharedBodiesMap.set(node._id, newSB);
            return newSB;
        }
    }

    readonly node: cc.Node;
    readonly wrappedWorld: CannonWorld;
    readonly body: CANNON.Body = new CANNON.Body();
    readonly shapes: CannonShape[] = [];
    wrappedBody: CannonRigidBody | null = null;

    private index: number = -1;
    private ref: number = 0;
    private onCollidedListener = this.onCollided.bind(this);

    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    set enabled (v: boolean) {
        if (v) {
            if (this.index < 0) {
                this.index = this.wrappedWorld.bodies.length;
                this.wrappedWorld.addSharedBody(this);
                this.syncSceneToPhysics(true);
            }
        } else {
            if (this.index >= 0) {
                const isRemove = (this.shapes.length == 0 && this.wrappedBody == null) ||
                    (this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy) ||
                    (this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled)

                if (isRemove) {
                    this.body.sleep(); // clear velocity etc.
                    this.index = -1;
                    this.wrappedWorld.removeSharedBody(this);
                }
            }
        }
    }

    set reference (v: boolean) {
        v ? this.ref++ : this.ref--;
        if (this.ref == 0) { this.destroy(); }
    }

    private constructor (node: cc.Node, wrappedWorld: CannonWorld) {
        this.wrappedWorld = wrappedWorld;
        this.node = node;
        this.body.material = this.wrappedWorld.world.defaultMaterial;
        this.body.addEventListener('collide', this.onCollidedListener);
        this._updateGroup();
        this.node.on(cc.Node.EventType.GROUP_CHANGED, this._updateGroup, this);
    }

    _updateGroup () {
        groupIndexToBitMask(this.node.groupIndex, this.body);
    }

    addShape (v: CannonShape) {
        const index = this.shapes.indexOf(v);
        if (index < 0) {
            const index = this.body.shapes.length;
            this.body.addShape(v.shape);
            this.shapes.push(v);

            v.setIndex(index);
            const offset = this.body.shapeOffsets[index];
            const orient = this.body.shapeOrientations[index];
            v.setOffsetAndOrient(offset, orient);
        }
    }

    removeShape (v: CannonShape) {
        const index = this.shapes.indexOf(v);
        if (index >= 0) {
            fastRemoveAt(this.shapes, index);
            this.body.removeShape(v.shape);
            v.setIndex(-1);
        }
    }

    syncSceneToPhysics (force: boolean = false) {
        let node = this.node;
        let needUpdateTransform = updateWorldTransform(node, force);
        if (!force && !needUpdateTransform) {
            return;
        }

        Vec3.copy(this.body.position, node.__wpos);
        Quat.copy(this.body.quaternion, node.__wrot);

        if (node._localMatDirty & PHYSICS_SCALE) {
            let wscale = node.__wscale;
            for (let i = 0; i < this.shapes.length; i++) {
                this.shapes[i].setScale(wscale);
            }
        }
        
        if (this.body.isSleeping()) {
            this.body.wakeUp();
        }

        // body world aabb need to be recalculated
        this.body.aabbNeedsUpdate = true;
    }

    syncPhysicsToScene () {
        if (this.body.type != ERigidBodyType.STATIC) {
            Vec3.copy(v3_0, this.body.position);
            Quat.copy(quat_0, this.body.quaternion);
            updateWorldRT(this.node, v3_0, quat_0);
        }
    }

    private destroy () {
        this.node.off(cc.Node.EventType.GROUP_CHANGED, this._updateGroup, this);
        CannonSharedBody.sharedBodiesMap.delete(this.node._id);
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;
        (this.body as any) = null;
        (this.shapes as any) = null;
        (this.onCollidedListener as any) = null;
    }

    private onCollided (event: CANNON.ICollisionEvent) {
        CollisionEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);

        if (self) {
            CollisionEventObject.selfCollider = self.collider;
            CollisionEventObject.otherCollider = other ? other.collider : null;
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

            for (i = 0; i < this.shapes.length; i++) {
                const shape = this.shapes[i];
                shape.collider.emit(CollisionEventObject.type, CollisionEventObject);
            }
        }
    }
}