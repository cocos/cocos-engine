import { director, Node, Vec3 } from "../../cocos/core";
import { physics } from "../../exports/physics-framework";

/**
 * This function is used to test stability of the physics
 */
export default function (parent: Node, steps = 500, scale = 0.5) {
    const nodeStatic = new Node('StaticB');
    parent.addChild(nodeStatic);
    nodeStatic.addComponent(physics.BoxCollider);
    nodeStatic.worldScale = new Vec3(20, 0.01, 20);
    nodeStatic.worldPosition = new Vec3(0, -0.005, 0);

    const size = new Vec3(scale, scale, scale);
    const X = 8, Y = 8, Z = 4;
    let x = 0, y = 0, z = 0;
    for (let i = 0; i < Y; i++) {
        y = size.y / 2 + size.y * i;
        const CX = X - i;
        for (let j = 0; j < CX; j++) {
            x = CX * -size.x / 2 + j * size.x;
            for (let k = 0; k < Z; k++) {
                const nodeDynamic = new Node(`${i}-${j}`);
                parent.addChild(nodeDynamic);
                nodeDynamic.worldScale = size;
                nodeDynamic.worldPosition = new Vec3(x, y, z + k * size.z * 2);
                nodeDynamic.addComponent(physics.RigidBody);
                nodeDynamic.addComponent(physics.BoxCollider);
            }
        }
    }

    const dt = physics.PhysicsSystem.instance.fixedTimeStep;
    const bodies = parent.getComponentsInChildren(physics.RigidBody) as physics.RigidBody[];
    const middle = Math.floor(steps / 2);
    for (let i = 0; i < steps; i++) {
        if (i === middle) {
            bodies.forEach((v) => {
                v.wakeUp();
                expect(v.isSleeping).toBe(false);
                expect(v.isAwake).toBe(true);
            });
        }
        director.tick(dt);
    }

    bodies.forEach((v) => {
        expect(v.isSleeping).toBe(true);
        expect(v.isAwake).toBe(false);
    })
    
    parent.destroyAllChildren();
    parent.removeAllChildren();
}
