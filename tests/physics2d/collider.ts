import { EPSILON, Quat, Vec2, Vec3 } from "../../cocos/core";
import { director } from "../../cocos/game";
import { Node } from "../../cocos/scene-graph";
import * as physics2d from "../../exports/physics-2d-framework";

/**
 * This function is used to test the api of the RigidBody
 */
export default function (parent: Node, _steps = 0) {
    //skip builtin for now
    if (physics2d.selector.id === 'builtin') 
        return;

    // basic api
    {
        const nodeCollider = new Node('Collider2D');
        parent.addChild(nodeCollider);
        const initPos = new Vec3(0, 10, 0);
        nodeCollider.worldPosition = initPos;
        const body = nodeCollider.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
        const collider = nodeCollider.addComponent(physics2d.BoxCollider2D) as physics2d.Collider2D;

        expect(collider.body).toBe(body);

        collider.density = 100;
        expect(collider.density).toBe(100);
        collider.apply();
        expect(body.getMass()).toBe(0.09765625);

        collider.friction = 1;
        expect(collider.friction).toBe(1);

        collider.restitution = 1;
        expect(collider.restitution).toBe(1);

        collider.sensor = true;
        expect(collider.sensor).toBe(true);
    
        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

}