import { Component } from '../../../../components/component';
import { ccclass } from '../../../../core/data/class-decorator';
import { Quat, Vec3 } from '../../../../core/value-types';
import { quat, vec3 } from '../../../../core/vmath';
import { Node } from '../../../../scene-graph/node';
import { AfterStepCallback, BeforeStepCallback, ICollisionCallback, ICollisionEvent, PhysicsWorldBase, RigidBodyBase } from '../../../physics/api';
import { createRigidBody } from '../../../physics/instance';
import { stringfyQuat, stringfyVec3 } from '../../../physics/util';

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
    }

    public start () {
        this._refSharedBody();
    }

    public destroy () {
        if (this._sharedBody) {
            this._sharedBody.deref();
            this._sharedBody = null;
        }
    }

    public syncPhysWithScene () {
        if (this.sharedBody) {
            this.sharedBody.syncPhysWithScene(this.node);
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

class SharedRigidBody {
    private _body: RigidBodyBase;

    private _refCount = 0;

    private _actived = false;

    private _world: PhysicsWorldBase;

    private _node: Node;

    private _worldScale: Vec3 = new Vec3(1, 1, 1);

    private _beforeStepCallback: BeforeStepCallback;

    private _afterStepCallback: AfterStepCallback;

    private _onCollidedCallback: ICollisionCallback;

    private _transformInitialized: boolean = false;

    constructor (node: Node, world: PhysicsWorldBase) {
        this._body = createRigidBody({
            name: node.name,
        });
        this._node = node;
        this._world = world;
        this._body.setUserData(this._node);
        this._beforeStepCallback = this._beforeStep.bind(this);
        this._afterStepCallback = this._afterStep.bind(this);
        this._onCollidedCallback = this._onCollided.bind(this);
        this._body.addCollisionCallback(this._onCollidedCallback);
        this._world.addBeforeStep(this._beforeStepCallback);
    }

    public get body () {
        return this._body;
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

    public enable () {
        this._activeBody();
    }

    public disable () {
        this._deactiveBody();
    }

    public syncPhysWithScene (node: Node) {
        this._transformInitialized = true;
        const p = node.getWorldPosition();
        const r = node.getWorldRotation();

        this.body.setPosition(p);
        this.body.setRotation(r);
        node.getWorldScale(this._worldScale);

        // Because we sync the scale, we should update shape parameters.
        this.body.scaleAllShapes(this._worldScale);
        this.body.commitShapeUpdates();
    }

    /**
     * Push the rigidbody's transform information back to node.
     */
    private _syncSceneWithPhys () {
        if (!this._node) {
            return;
        }

        const p = new Vec3();
        this.body.getPosition(p);
        this._node.setWorldPosition(p.x, p.y, p.z);
        if (!this._body.getFreezeRotation()) {
            const q = new Quat();
            this.body.getRotation(q);
            this._node.setWorldRotation(q.x, q.y, q.z, q.w);
        }
    }

    private _activeBody () {
        if (!this._transformInitialized) {
            return;
        }
        if (this._actived) {
            return;
        }
        this._actived = true;
        this._body.setWorld(this._world);
        this._world.addAfterStep(this._afterStepCallback);
    }

    private _deactiveBody () {
        if (!this._actived) {
            return;
        }
        this._actived = false;
        this._world.removeAfterStep(this._afterStepCallback);
        this._world.removeBeforeStep(this._beforeStepCallback);
        this._body.setWorld(null);
    }

    private _onCollided (event: ICollisionEvent) {
        if (!this._node) {
            return;
        }
        this._node.emit('collided', {
            source: event.source.getUserData() as Node,
            target: event.target.getUserData() as Node,
        });
    }

    private _beforeStep () {
        // const d = (reason: string) => {
        //    console.log(`${reason} physics transform of [[${this._node.name}]] to : ` +
        //        `Position: ${stringfyVec3(this._node.getWorldPosition())} ` +
        //        `Rotation: ${stringfyQuat(this._node.getWorldRotation())} `);
        // };

        if (!this._transformInitialized) {
            // d(`Initialize`);
            this.syncPhysWithScene(this._node);
            this._activeBody();
        } else if (!this.body.isPhysicsManagedTransform() && this._node.hasChanged) {
            // d(`Synchronize`);
            this.syncPhysWithScene(this._node);
            this._activeBody();
        }
    }

    private _afterStep () {
        if (this.body.isPhysicsManagedTransform()) {
            this._syncSceneWithPhys();
        }
    }
}
