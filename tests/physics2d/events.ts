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
        const nodeStaticCollider = new Node('StaticCollider2D');
        parent.addChild(nodeStaticCollider);
        const initPos = new Vec3(0, 0, 0);
        nodeStaticCollider.worldPosition = initPos;
        const staticBody = nodeStaticCollider.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
        const staticCollider = nodeStaticCollider.addComponent(physics2d.BoxCollider2D) as physics2d.Collider2D;
        staticBody.type = physics2d.ERigidBody2DType.Static;
        //staticBody.enabledContactListener = true;

        const nodeDynamicCollider = new Node('DynamicCollider2D');
        parent.addChild(nodeDynamicCollider);
        nodeDynamicCollider.worldPosition = new Vec3(0, 2, 0);
        const dynamicBody = nodeDynamicCollider.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
        const dynamicCollider = nodeDynamicCollider.addComponent(physics2d.BoxCollider2D) as physics2d.Collider2D;
        dynamicBody.enabledContactListener = true;
        dynamicBody.type = physics2d.ERigidBody2DType.Dynamic;

        function onBeginContact (selfCollider, otherCollider, contact: physics2d.IPhysics2DContact) {
            expect(contact.colliderA).toBe(dynamicCollider);
            expect(contact.colliderB).toBe(staticCollider);
        }
    
        dynamicCollider.on(physics2d.Contact2DType.BEGIN_CONTACT, onBeginContact);
    
        const dt = physics2d.PhysicsSystem2D.instance.fixedTimeStep;
        for (let i = 0; i < 3000; i++) {
            director.tick(dt);
        }

        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

}