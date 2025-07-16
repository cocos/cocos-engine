import { geometry, Quat, Vec3 } from "../../cocos/core";
import { physics } from "../../exports/physics-framework";
import { Node } from "../../cocos/scene-graph";
import { director } from "../../cocos/game";
import { PhysicsTestEnv } from "./physics.test";

/**
 * This function is used to test the raycast
 */
export default function (env: PhysicsTestEnv) {
    if (env.backendId === 'builtin' || env.backendId === 'cannon.js') {
        return;
    }

    test(`Sweep`, () => {
        const { rootNode: parent } = env;
        
        const nodeSphere = new Node('sphere');
        const sphere = nodeSphere.addComponent(physics.SphereCollider) as physics.SphereCollider;
        parent.addChild(nodeSphere);
        nodeSphere.worldPosition = new Vec3(10, 0, 0);
        sphere.setGroup(physics.PhysicsGroup.DEFAULT);

        const nodeBox = new Node('box');
        const box = nodeBox.addComponent(physics.BoxCollider) as physics.BoxCollider;
        parent.addChild(nodeBox);
        nodeBox.worldPosition = new Vec3(5, 0, 0);
        box.setGroup(physics.PhysicsGroup.DEFAULT);

        let isHit = false;
        const ray_t = new geometry.Ray(0,0,0,1,0,0);

        director.tick(physics.PhysicsSystem.instance.fixedTimeStep);
        
        // all test
        {
            const hits = physics.PhysicsSystem.instance.sweepCastResults;
            const boxHalfExtents = new Vec3(0.5, 0.5, 0.5);
            const orientation = new Quat();
            isHit = physics.PhysicsSystem.instance.sweepBox(ray_t, boxHalfExtents, orientation);
            expect(isHit).toBe(true);
            expect(hits.length).toBe(2);
        }

        // closest test
        {
            const hitClosest = physics.PhysicsSystem.instance.sweepCastClosestResult;
            const boxHalfExtents = new Vec3(0.5, 0.5, 0.5);
            const orientation = new Quat();
            isHit = physics.PhysicsSystem.instance.sweepBoxClosest(ray_t, boxHalfExtents, orientation);
            expect(isHit).toBe(true);
            expect(hitClosest.collider.uuid).toBe(box.uuid);
        }
    });
}