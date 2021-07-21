import { director, Node, Vec3 } from "../../cocos/core";
import { physics } from "../../exports/physics-framework";

/**
 * This function is used to test stability of the physics
 */
export default function (parent: Node) {

    const nodeStatic = new Node('StaticB');
    parent.addChild(nodeStatic);
    nodeStatic.addComponent(physics.BoxCollider);
    nodeStatic.worldScale = new Vec3(10, 1, 10);
    
    const scale = 0.05;
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
                nodeDynamic.worldPosition = new Vec3(x, y, z + k * size.z);
                const box = nodeDynamic.addComponent(physics.BoxCollider) as physics.BoxCollider;
                box.size = size;
            }
        }
    }

    const bodies = parent.getComponentsInChildren(physics.RigidBody) as physics.RigidBody[];
    for (let i = 0; i < 1000; i++) {
        if (i === 500) {
            bodies.forEach((v) => {
                v.wakeUp();
                expect(v.isSleeping).toBe(false);
                expect(v.isAwake).toBe(true);
            });
        }
        director.mainLoop(1 / 60);
    }

    bodies.forEach((v) => {
        expect(v.isSleeping).toBe(true);
        expect(v.isAwake).toBe(false);
    })
}
