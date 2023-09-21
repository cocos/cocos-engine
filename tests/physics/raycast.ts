import { geometry, Quat, Vec3 } from "../../cocos/core";
import { physics } from "../../exports/physics-framework";
import { Node } from "../../cocos/scene-graph";
import { director } from "../../cocos/game";
import { PhysicsTestEnv } from "./physics.test";


/**
 * This function is used to test the raycast
 */
export default function (env: PhysicsTestEnv) {
    test(`Raycast`, () => {
        const { rootNode: parent } = env;

        const node0 = new Node('0');
        const sphere = node0.addComponent(physics.SphereCollider) as physics.SphereCollider;
        parent.addChild(node0);
        node0.worldPosition = new Vec3(0, 0.15, 2);
        sphere.setGroup(physics.PhysicsGroup.DEFAULT);

        const node1 = new Node('1');
        const box = node1.addComponent(physics.BoxCollider) as physics.BoxCollider;
        parent.addChild(node1);
        box.setGroup(1 << 1);

        const node2 = new Node('2');
        const capsule = node2.addComponent(physics.CapsuleCollider) as physics.CapsuleCollider;
        parent.addChild(node2);
        node2.worldPosition = new Vec3(0.1, -0.15, 5);
        capsule.setGroup(1 << 2);
        capsule.isTrigger = true;

        // test zero mask
        let isHit = false;
        const hits = physics.PhysicsSystem.instance.raycastResults;
        const ray_t = new geometry.Ray();
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, 0);
        expect(isHit).toBe(false);

        // physics.PhysicsSystem.instance.syncSceneToPhysics();
        director.tick(physics.PhysicsSystem.instance.fixedTimeStep);

        // test wrong ray
        ray_t.o.set(0.25, 0.25, -5);
        ray_t.d.set(Vec3.UNIT_Y);
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, -1);
        expect(isHit).toBe(false);

        // test distance
        ray_t.d.set(Vec3.UNIT_Z);
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, -1, 5);
        expect(isHit).toBe(true);
        expect(hits.length).toBe(1);

        // query trigger false
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, -1, 100, false);
        expect(isHit).toBe(true);
        expect(hits.length).toBe(physics.PhysicsSystem.PHYSICS_BUILTIN ? 3 : 2);

        // query trigger true
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, -1, 100, true);
        expect(isHit).toBe(true);
        expect(hits.length).toBe(physics.PhysicsSystem.PHYSICS_CANNON ? 2 : 3);

        // default distance & query trigger
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, -1);
        expect(isHit).toBe(true);
        expect(hits.length).toBe(physics.PhysicsSystem.PHYSICS_CANNON ? 2 : 3);

        // only detect 1
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, 1);
        expect(isHit).toBe(true);
        expect(hits.length).toBe(1);

        // detect 2 & 4, except 1
        isHit = physics.PhysicsSystem.instance.raycast(ray_t, (1 << 1) | (1 << 0));
        expect(isHit).toBe(true);
        expect(hits.length).toBe(2);

        // closest test
        const hitClosest = physics.PhysicsSystem.instance.raycastClosestResult;
        isHit = physics.PhysicsSystem.instance.raycastClosest(ray_t, -1);
        expect(isHit).toBe(true);
        expect(hitClosest.collider.uuid).toBe(box.uuid);
        ray_t.o.z = box.node.worldPosition.z - box.size.z / 2;
        expect(Vec3.equals(hitClosest.hitPoint, ray_t.o, 0.001)).toBe(true);
        expect(Vec3.equals(hitClosest.hitNormal, physics.PhysicsSystem.PHYSICS_BUILTIN ? Vec3.ZERO : Vec3.FORWARD)).toBe(true);
    });
}