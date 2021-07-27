import { director, Node, Quat, Vec3 } from "../../cocos/core";
import { ICollisionEvent, ITriggerEvent, physics } from "../../exports/physics-framework";

/**
 * This function is used to test the api of the RigidBody
 */
export default function (parent: Node, _steps = 0) {
    // basic api
    {
        const nodeDynamic = new Node('Dynamic');
        parent.addChild(nodeDynamic);
        const initPos = new Vec3(0, 10, 0);
        nodeDynamic.worldPosition = initPos;
        const body = nodeDynamic.addComponent(physics.RigidBody) as physics.RigidBody;
        body.type = physics.RigidBody.Type.STATIC;
        expect(body.isStatic).toBe(true);
        body.type = physics.RigidBody.Type.KINEMATIC;
        expect(body.isKinematic).toBe(true);
        body.type = physics.RigidBody.Type.DYNAMIC;
        expect(body.isDynamic).toBe(true);
        const massA = 2;
        body.mass = massA;
        expect(body.mass).toBe(massA);

        const v3_0 = Vec3.negate(new Vec3(), physics.PhysicsSystem.instance.gravity);
        v3_0.multiplyScalar(massA);
        body.applyForce(v3_0);

        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        director.tick(dt);

        expect(Vec3.equals(nodeDynamic.worldPosition, initPos)).toBe(true);

        v3_0.set(1, 2, 3); const v3_1 = new Vec3();
        body.setLinearVelocity(v3_0);
        body.getLinearVelocity(v3_1);
        expect(Vec3.equals(v3_0, v3_1)).toBe(true);

        v3_0.set(3, 2, 1); v3_1.set(0, 0, 0);
        body.setAngularVelocity(v3_0);
        body.getAngularVelocity(v3_1);
        expect(Vec3.equals(v3_0, v3_1)).toBe(true);

        body.linearDamping = 0.001;
        expect(body.linearDamping === 0.001).toBe(true);

        body.angularDamping = 0.001;
        expect(body.angularDamping === 0.001).toBe(true);

        body.clearForces();
        body.clearVelocity();
        body.clearState();
        body.getLinearVelocity(v3_0);
        body.getAngularVelocity(v3_1);
        expect(Vec3.equals(v3_0, Vec3.ZERO)).toBe(true);
        expect(Vec3.equals(v3_1, Vec3.ZERO)).toBe(true);
        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

    // local inertia
    {
        const nodeDynamic = new Node('Dynamic');
        parent.addChild(nodeDynamic);
        const body = nodeDynamic.addComponent(physics.RigidBody) as physics.RigidBody;
        body.type = physics.RigidBody.Type.DYNAMIC;
        const v3_0 = new Vec3(1, 1, 1);
        body.setAngularVelocity(v3_0);
        expect(Quat.equals(nodeDynamic.worldRotation, Quat.IDENTITY)).toBe(true);
        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        director.tick(dt);
        expect(!Quat.equals(nodeDynamic.worldRotation, Quat.IDENTITY)).toBe(true);
        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

    // use gravity
    {
        const nodeDynamic = new Node('Dynamic');
        parent.addChild(nodeDynamic);
        const body = nodeDynamic.addComponent(physics.RigidBody) as physics.RigidBody;
        body.useGravity = false;
        body.type = physics.RigidBody.Type.DYNAMIC;
        expect(Vec3.equals(nodeDynamic.worldPosition, Vec3.ZERO)).toBe(true);
        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        for (let i = 0; i < 200; i++)director.tick(dt);
        expect(Vec3.equals(nodeDynamic.worldPosition, Vec3.ZERO)).toBe(true);
        expect(body.isSleeping).toBe(true);
        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

    // use ccd
    {
        const nodeDynamic = new Node('Dynamic');
        parent.addChild(nodeDynamic);
        const sphere = nodeDynamic.addComponent(physics.SphereCollider) as physics.SphereCollider;
        const body = nodeDynamic.addComponent(physics.RigidBody) as physics.RigidBody;
        body.useCCD = true;
        body.useGravity = false;
        body.setLinearVelocity(new Vec3(500, 0, 0));
        let isDispatched = false;
        sphere.on('onCollisionEnter', (event: ICollisionEvent) => {
            isDispatched = true;
            expect(event.selfCollider.uuid).toBe(sphere.uuid);
            expect(event.otherCollider.uuid).toBe(box.uuid);
        })

        const nodeStatic = new Node('Static');
        parent.addChild(nodeStatic);
        const box = nodeStatic.addComponent(physics.BoxCollider) as physics.BoxCollider;
        nodeStatic.worldPosition = new Vec3(10, 0, 0);
        nodeStatic.worldRotation = Quat.fromEuler(new Quat(), 10, 20, 30);

        // PhysX/Cannon/Bullet Not enough support currently
        // const nodeTrigger = new Node('Static');
        // parent.addChild(nodeTrigger);
        // const sphereTrigger = nodeTrigger.addComponent(physics.SphereCollider) as physics.SphereCollider;
        // sphereTrigger.isTrigger = true;
        // nodeTrigger.worldPosition = new Vec3(5, 0, 0);
        // nodeTrigger.worldRotation = Quat.fromEuler(new Quat(), -10, 50, 30);
        // let isTriggered = false;
        // sphereTrigger.on('onTriggerEnter', (event: ITriggerEvent) => {
        //     isTriggered = true;
        //     expect(event.selfCollider.uuid).toBe(sphereTrigger.uuid);
        //     expect(event.otherCollider.uuid).toBe(sphere.uuid);
        // })

        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        for (let i = 0; i < 100; i++)director.tick(dt);

        expect(isDispatched).toBe(true);
        // expect(isTriggered).toBe(true);

        parent.destroyAllChildren();
        parent.removeAllChildren();
    }
}