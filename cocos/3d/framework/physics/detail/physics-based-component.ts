import CANNON from 'cannon';
import { Component } from '../../../../components/component';
import { ccclass } from '../../../../core/data/class-decorator';
import { Quat, Vec3 } from '../../../../core/value-types';
import { quat, vec3 } from '../../../../core/vmath';
import { Node } from '../../../../scene-graph/node';
import { BoxColliderComponent, ColliderComponentBase, SphereColliderComponent } from '../collider-component';
import { setWrap } from '../util';
import { PhysicsWorld } from '../world';

export class PhysicsBasedComponent extends Component {

    protected get _body () {
        return this._sharedBody ? this._sharedBody.body : null;
    }

    protected get sharedBody () {
        return this._sharedBody;
    }
    private _sharedBody: SharedRigidBody | null = null;

    constructor () {
        super();
    }

    public onLoad () {
        this._refSharedBody();
    }

    public start () {
        this._sharedBody!.syncPhysWithScene();
    }

    public destroy () {
        if (this._sharedBody) {
            this._sharedBody.deref();
            this._sharedBody = null;
        }
    }

    public syncPhysWithScene () {
        if (this.sharedBody) {
            this.sharedBody.syncPhysWithScene();
        }
    }

    private _refSharedBody () {
        if (this._sharedBody) {
            return;
        }
        const physicsBasedComponents = this.node.getComponents(PhysicsBasedComponent);
        let sharedBody: SharedRigidBody | null = null;
        for (const physicsBasedComponent of physicsBasedComponents) {
            if (physicsBasedComponent._sharedBody) {
                sharedBody = physicsBasedComponent._sharedBody;
                break;
            }
        }
        if (!sharedBody) {
            sharedBody = new SharedRigidBody(this.node, cc.director._physicsSystem.world);
        }
        sharedBody.ref();
        this._sharedBody = sharedBody;
    }
}

export enum TransformSource {
    Scene,
    Phycis,
}

type Collider = ColliderComponentBase;

function isBoxCollider (collider: Collider): collider is BoxColliderComponent {
    return 'size' in collider;
}

function isSphereCollider (collider: Collider): collider is SphereColliderComponent {
    return 'radius' in collider;
}

class SharedRigidBody {
    private _body: CANNON.Body;

    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;

    private _cancelGravityListener: (event: CANNON.IEvent) => any;

    private _onWorldBeforeStepListener: (event: CANNON.IEvent) => any;

    private _onWorldPostStepListener: (event: CANNON.IEvent) => any;

    private _refCount = 0;

    private _world: PhysicsWorld;

    private _node: Node;

    private _transformSource: TransformSource = TransformSource.Scene;

    private _colliders: Map<Collider, number> = new Map();

    private _worldScale: Vec3 = new Vec3(1, 1, 1);

    constructor (node: Node, world: PhysicsWorld) {
        this._body = new CANNON.Body();
        this._node = node;
        setWrap<Node>(this._body, this._node);
        this._world = world;

        this._onCollidedListener = this._onCollided.bind(this);
        this._onWorldBeforeStepListener = this._onWorldBeforeStep.bind(this);
        this._onWorldPostStepListener = this._onWorldPostStep.bind(this);
        this._cancelGravityListener = (event) => {
            if (this._body) {
                const gravity = this._body.world.gravity;
                vec3.scaleAndAdd(this._body.force, this._body.force, gravity, this._body.mass * -1);
            }
        };
    }

    public get body () {
        return this._body;
    }

    public get transformSource () {
        return this._transformSource;
    }

    public set transformSource (value) {
        this._transformSource = value;
    }

    public ref () {
        if (!this._refCount) {
            this._activeBody();
        }
        ++this._refCount;
    }

    public deref () {
        --this._refCount;
        if (!this._refCount) {
            this._deactiveBody();
        }
    }

    public addCollider (collider: Collider) {
        let shape: CANNON.Shape | undefined;
        if (isBoxCollider(collider)) {
            shape = new CANNON.Box(new CANNON.Vec3());
        } else if (isSphereCollider(collider)) {
            shape = new CANNON.Sphere(0);
        }
        if (!shape) {
            return;
        }
        setWrap(shape, collider);
        const ishape = this.body.shapes.length;
        this.body.addShape(shape);
        this._colliders.set(collider, ishape);
        this.updateCollidier(collider);
    }

    public updateCollidier (collider: Collider) {
        const ishape = this._colliders.get(collider);
        if (ishape === undefined) {
            return;
        }
        if (isBoxCollider(collider)) {
            const shape = this.body.shapes[ishape] as CANNON.Box;
            vec3.scale(shape.halfExtents, collider.size, 0.5);
            vec3.multiply(shape.halfExtents, shape.halfExtents, this._worldScale);
            shape.updateConvexPolyhedronRepresentation();
            shape.updateBoundingSphereRadius();
        } else if (isSphereCollider(collider)) {
            const shape = this.body.shapes[ishape] as CANNON.Sphere;
            shape.radius = collider.radius * maxComponent(this._worldScale);
            shape.updateBoundingSphereRadius();
        }
        const center = this.body.shapeOffsets[ishape];
        vec3.multiply(center, center, this._worldScale);
        this.body.updateBoundingRadius();
    }

    public removeCollider (collider: Collider) {
        const ishape = this._colliders.get(collider);
        if (ishape === undefined) {
            return;
        }
        this._colliders.delete(collider);
        this._removeShape(ishape);
    }

    public syncPhysWithScene () {
        vec3.copy(this._body.position, this._node.getWorldPosition());
        quat.copy(this._body.quaternion, this._node.getWorldRotation());

        // Because we sync the scale, we should update shape parameters.
        this._node.getWorldScale(this._worldScale);
        this._colliders.forEach((shape, collider) => {
            this.updateCollidier(collider);
        });
    }

    public setUseGravity (value: boolean) {
        if (value) {
            this._body.world.removeEventListener('beforeStep', this._cancelGravityListener);
        } else {
            this._body.world.addEventListener('beforeStep', this._cancelGravityListener);
        }
    }

    /**
     * Push the rigidbody's transform information back to node.
     */
    private _syncSceneWithPhys () {
        if (!this._node) {
            return;
        }

        const p = this._body.position;
        this._node.setWorldPosition(p.x, p.y, p.z);
        if (!this._body.fixedRotation) {
            const q = this._body.quaternion;
            this._node.setWorldRotation(q.x, q.y, q.z, q.w);
        }
    }

    private _activeBody () {
        this._world.addBody(this._body);
        this._body.addEventListener('collide', this._onCollidedListener);
        this._body.world.addEventListener('beforeStep', this._onWorldBeforeStepListener);
        this._body.world.addEventListener('postStep', this._onWorldPostStepListener);
    }

    private _deactiveBody () {
        this._world.removeBody(this._body);
        this._body.removeEventListener('collide', this._onCollidedListener);
        this._body.world.removeEventListener('postStep', this._onWorldPostStepListener);
        this._body.world.removeEventListener('beforeStep', this._onWorldBeforeStepListener);
    }

    private _onCollided (event: CANNON.ICollisionEvent) {
        if (!this._node) {
            return;
        }
        this._node.emit('collided', {});
        // console.log(`Collided {${getWrap<PhysicsBody>(event.body)._node.name}} and {${getWrap<PhysicsBody>(event.target)._node.name}}.`);
    }

    private _onWorldBeforeStep (event: CANNON.IEvent) {
        // if (this._transformSource === TransformSource.Scene) {
        //     this.syncPhysWithScene();
        // }
    }

    private _onWorldPostStep (event: CANNON.IEvent) {
        if (this._transformSource === TransformSource.Phycis) {
            this._syncSceneWithPhys();
        }
    }

    private _removeShape (iShape: number) {
        const body = this._body;
        const shape = body.shapes[iShape];
        body.shapes.splice(iShape, 1);
        body.shapeOffsets.splice(iShape, 1);
        body.shapeOrientations.splice(iShape, 1);
        body.updateMassProperties();
        body.updateBoundingRadius();
        body.aabbNeedsUpdate = true;
        (shape as any).body = null;
    }
}

function maxComponent (v: Vec3) {
    return Math.max(v.x, Math.max(v.y, v.z));
}
