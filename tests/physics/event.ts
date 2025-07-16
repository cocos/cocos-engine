import { Vec3 } from "../../cocos/core";
import { director } from "../../cocos/game";
import { Node } from "../../cocos/scene-graph";
import { physics } from "../../exports/physics-framework";
import { PhysicsTestEnv } from "./physics.test";

/**
 * This function is used to test some event callback
 */
export default function (env: PhysicsTestEnv) {
    test(`Event`, () => {
        const { rootNode: parent } = env;
        const steps = 300;

        const nodeDynamic = new Node('DynamicA');
        parent.addChild(nodeDynamic);
        nodeDynamic.worldPosition = new Vec3(0, 4, 0);
        nodeDynamic.addComponent(physics.RigidBody);
        const colliderDynamic: physics.SphereCollider = nodeDynamic.addComponent(physics.SphereCollider);
        const colliderTrigger: physics.BoxCollider = nodeDynamic.addComponent(physics.BoxCollider);
        colliderTrigger.isTrigger = true;

        const nodeStatic = new Node('StaticB');
        parent.addChild(nodeStatic);
        nodeStatic.addComponent(physics.BoxCollider);

        function onCollision(event: physics.ICollisionEvent) {
            expect(event.selfCollider).toBe(colliderDynamic);
        }

        function onTrigger(event: physics.ITriggerEvent) {
            expect(event.selfCollider).toBe(colliderTrigger);
        }

        // collision event
        expect(colliderDynamic.needCollisionEvent).toBe(false);
        colliderDynamic.on('onCollisionEnter', onCollision);

        expect(colliderDynamic.needCollisionEvent).toBe(true);

        // trigger event
        expect(colliderTrigger.needTriggerEvent).toBe(false);
        colliderTrigger.on('onTriggerEnter', onTrigger);
        expect(colliderTrigger.needTriggerEvent).toBe(true);

        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        for (let i = 0; i < steps; i++) {
            director.tick(dt);
        }

        colliderDynamic.off('onCollisionEnter', onCollision);
        expect(colliderDynamic.needCollisionEvent).toBe(false);
        colliderTrigger.off('onTriggerEnter', onTrigger);
        expect(colliderTrigger.needTriggerEvent).toBe(false);
    });
}
