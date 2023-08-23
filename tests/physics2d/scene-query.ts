import { EPSILON, Quat, Rect, Vec2, Vec3 } from "../../cocos/core";
import { director } from "../../cocos/game";
import { Node } from "../../cocos/scene-graph";
import * as physics2d from "../../exports/physics-2d-framework";

/**
 * This function is used to test the api of the scene query
 */
export default function (parent: Node, _steps = 0) {
    //skip builtin for now
    if (physics2d.selector.id === 'builtin') 
        return;

    const nodeCollider = new Node('Collider2D');
    parent.addChild(nodeCollider);
    const initPos = new Vec3(10, 0, 0);
    nodeCollider.worldPosition = initPos;
    const body = nodeCollider.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
    const collider = nodeCollider.addComponent(physics2d.BoxCollider2D) as physics2d.Collider2D;
    collider.group = 2;

    // add another collider
    const nodeCollider2 = new Node('Collider2D2');
    parent.addChild(nodeCollider2);
    const initPos2 = new Vec3(20, 0, 0);
    nodeCollider2.worldPosition = initPos2;
    const body2 = nodeCollider2.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
    const collider2 = nodeCollider2.addComponent(physics2d.BoxCollider2D) as physics2d.Collider2D;
    collider2.group = physics2d.PhysicsGroup.DEFAULT;

    //test raycast cloest
    {
        const p0 = new Vec2(0, 0);
        const p1 = new Vec2(20, 0);
        let result = physics2d.PhysicsSystem2D.instance.raycast(p0, p1);
        expect(result.length).toBe(1);
        expect(result[0].collider.uuid).toBe(collider.uuid);
        expect(Vec2.equals(result[0].point, new Vec2(9.5, 0))).toBe(true);
        expect(Vec2.equals(result[0].normal, new Vec2(-1, 0))).toBe(true);
        expect(Math.abs(result[0].fraction - 0.475)< 0.0001).toBe(true);
    }

    //test raycast all
    {
        const p0 = new Vec2(0, 0);
        const p1 = new Vec2(20, 0);
        const type = physics2d.ERaycast2DType.All;
        let result = physics2d.PhysicsSystem2D.instance.raycast(p0, p1, type);
        expect(result.length).toBe(2);
        
        expect(result[1].collider.uuid).toBe(collider.uuid);
        expect(Vec2.equals(result[1].point, new Vec2(9.5, 0))).toBe(true);
        expect(Vec2.equals(result[1].normal, new Vec2(-1, 0))).toBe(true);
        expect(Math.abs(result[1].fraction - 0.475)< 0.0001).toBe(true);

        expect(result[0].collider.uuid).toBe(collider2.uuid);
        expect(Vec2.equals(result[0].point, new Vec2(19.5, 0))).toBe(true);
        expect(Vec2.equals(result[0].normal, new Vec2(-1, 0))).toBe(true);
        expect(Math.abs(result[0].fraction - 0.975)< 0.0001).toBe(true);

    }

    //test raycast all with group mask
    {
        const p0 = new Vec2(0, 0);
        const p1 = new Vec2(20, 0);
        const type = physics2d.ERaycast2DType.All;
        const mask = physics2d.PhysicsGroup.DEFAULT;
        let result = physics2d.PhysicsSystem2D.instance.raycast(p0, p1, type, mask);
        expect(result.length).toBe(1);
        expect(result[0].collider.uuid).toBe(collider2.uuid);
        expect(Vec2.equals(result[0].point, new Vec2(19.5, 0))).toBe(true);
        expect(Vec2.equals(result[0].normal, new Vec2(-1, 0))).toBe(true);
        expect(Math.abs(result[0].fraction - 0.975)< 0.0001).toBe(true);
    }

    //test testPoint
    {
        let result = physics2d.PhysicsSystem2D.instance.testPoint(new Vec2(10, 0));
        expect(result.length).toBe(1);
        expect(result[0].uuid).toBe(collider.uuid);
    }

    //test testAABB
    {
        let rect = new Rect(0, 0, 30, 30);
        let result = physics2d.PhysicsSystem2D.instance.testAABB(rect);
        expect(result.length).toBe(2);
        expect(result[0].uuid).toBe(collider2.uuid);
        expect(result[1].uuid).toBe(collider.uuid);
    }


    parent.destroyAllChildren();
    parent.removeAllChildren();
}