import { director, Node, Vec3 } from "../../cocos/core";
import { physics } from "../../exports/physics-framework";

/**
 * This function is used to test automatic sleep
 */
export default function (parent: Node, steps = 300) {
    const nodeDynamicA = new Node('DynamicA');
    parent.addChild(nodeDynamicA);
    nodeDynamicA.worldPosition = new Vec3(0, 10, 0);
    nodeDynamicA.addComponent(physics.SphereCollider);
    const bodyA = nodeDynamicA.addComponent(physics.RigidBody) as physics.RigidBody;

    const nodeDynamicB = new Node('DynamicB');
    parent.addChild(nodeDynamicB);
    nodeDynamicB.worldPosition = new Vec3(0, 5, 0);
    const bodyB = nodeDynamicB.addComponent(physics.RigidBody) as physics.RigidBody;
    nodeDynamicB.addComponent(physics.BoxCollider);

    const nodeStatic = new Node('StaticB');
    parent.addChild(nodeStatic);
    nodeStatic.addComponent(physics.BoxCollider);
    nodeStatic.worldScale = new Vec3(10, 1, 10);

    expect(bodyA.isSleeping).toBe(false);
    expect(bodyB.isSleeping).toBe(false);
    expect(bodyA.isAwake).toBe(true);
    expect(bodyB.isAwake).toBe(true);

    const middle = Math.floor(steps / 2);
    for (let i = 0; i < steps; i++) {
        if (i === middle) {
            bodyA.wakeUp();
            expect(bodyA.isSleeping).toBe(false);
            expect(bodyA.isAwake).toBe(true);
        }
        director.mainLoop(1 / 60);
    }

    expect(bodyA.isSleeping).toBe(true);
    expect(bodyB.isSleeping).toBe(true);
    expect(bodyA.isAwake).toBe(false);
    expect(bodyB.isAwake).toBe(false);
}
