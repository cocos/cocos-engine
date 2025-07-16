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
        const nodeRigidBody = new Node('RigidBody');
        parent.addChild(nodeRigidBody);
        const initPos = new Vec3(0, 10, 0);
        nodeRigidBody.worldPosition = initPos;
        const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;

        //test getLinearVelocityFromWorldPoint
        {
            const v2_0 = new Vec2(1, 0);
            const velocity = new Vec2();
            body.getLinearVelocityFromWorldPoint(v2_0, velocity);
            expect(Vec2.equals(velocity, Vec2.ZERO)).toBe(true);
        }
        //test getLocalVector
        {
            const v2_0 = new Vec2(1, 0);
            const v2_1 = new Vec2();
            body.getLocalVector(v2_0, v2_1);
            expect(Vec2.equals(v2_0, v2_1)).toBe(true);
        }
        //test getWorldVector
        {
            const v2_0 = new Vec2(1, 0);
            const v2_1 = new Vec2();
            body.getWorldVector(v2_0, v2_1);
            expect(Vec2.equals(v2_0, v2_1)).toBe(true);
        }
        //test getLocalPoint
        {
            const v2_0 = new Vec2(1, 0);
            const v2_1 = new Vec2();
            body.getLocalPoint(v2_0, v2_1);
            let expectLocalPoint = new Vec2(1, -10);
            expect(Vec2.equals(expectLocalPoint, v2_1)).toBe(true);
        }
        //test getWorldPoint
        {
            const v2_0 = new Vec2(1, 0);
            const v2_1 = new Vec2();
            body.getWorldPoint(v2_0, v2_1);
            let expectWorldPoint = new Vec2(1, 10);
            expect(Vec2.equals(expectWorldPoint, v2_1)).toBe(true);
        }
    
        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

    // applyForceToCenter
    {
        const nodeRigidBody = new Node('RigidBody2D');
        parent.addChild(nodeRigidBody);
        const initPos = new Vec3(0, 0, 0);
        nodeRigidBody.worldPosition = initPos;
        const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;

        body.applyForceToCenter(new Vec2(1, 0), true);
        body.gravityScale = 0;

        const dt = physics2d.PhysicsSystem2D.instance.fixedTimeStep;
        for(let i = 0; i < 10; i++)
            director.tick(dt);

        expect(nodeRigidBody.worldPosition.x > initPos.x).toBe(true);
        expect(Math.abs(nodeRigidBody.worldPosition.y - initPos.y) < EPSILON).toBe(true);
        expect(Quat.equals(nodeRigidBody.worldRotation, Quat.IDENTITY)).toBe(true);
        expect(Math.abs(body.linearVelocity.y) < EPSILON).toBe(true);
        expect(Math.abs(body.linearVelocity.x) > EPSILON).toBe(true);
        expect(Math.abs(body.angularVelocity) < EPSILON).toBe(true);

        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

    // applyTorque
    if(0)//todo
    {
        const nodeRigidBody = new Node('RigidBody');
        parent.addChild(nodeRigidBody);
        const initPos = new Vec3(0, 0, 0);
        nodeRigidBody.worldPosition = initPos;
        const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
        nodeRigidBody.addComponent(physics2d.BoxCollider2D);

        body.applyTorque(10, true);
        body.gravityScale = 0;

        const dt = physics2d.PhysicsSystem2D.instance.fixedTimeStep;
        for(let i = 0; i < 10; i++)
            director.tick(dt);

         let eulerAngle = new Vec3();
        nodeRigidBody.worldRotation.getEulerAngles(eulerAngle);
        expect(nodeRigidBody.worldPosition.y === initPos.y).toBe(true);
        expect(Math.abs(eulerAngle.x) < EPSILON).toBe(true);
        expect(Math.abs(eulerAngle.y) < EPSILON).toBe(true);
        expect(Math.abs(eulerAngle.z) > EPSILON).toBe(true);

        parent.destroyAllChildren();
        parent.removeAllChildren();
    }
    
    //sleep and wakeup
    {
        const nodeRigidBody = new Node('RigidBody');
        parent.addChild(nodeRigidBody);
        const initPos = new Vec3(0, 0, 0);
        nodeRigidBody.worldPosition = initPos;
        const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
        

        body.allowSleep = true;
        body.sleep();
        expect(body.isAwake()).toBe(false);
        body.wakeUp();
        expect(body.isAwake()).toBe(true);

        // todo
        // body.allowSleep = false;
        // body.sleep();
        // expect(body.isAwake()).toBe(true);
        
        parent.destroyAllChildren();
        parent.removeAllChildren();
    }

    //test destroy, if failed, wasm will crash
    {
        //rigidbody
        {
            const nodeRigidBody = new Node('RigidBody');
            parent.addChild(nodeRigidBody);
            const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;

            body.destroy();
            director.tick(0.2);//make sure the body is destroyed
            parent.destroyAllChildren();
            parent.removeAllChildren();
            director.tick(0.2);//make sure is destroyed
        }

        //rigidbody, collider
        {
            const nodeRigidBody = new Node('RigidBody');
            parent.addChild(nodeRigidBody);
            const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
            const collider = nodeRigidBody.addComponent(physics2d.BoxCollider2D) as physics2d.Collider2D;

            body.destroy();
            director.tick(0.2);//make sure the body is destroyed
            collider.destroy();

            parent.destroyAllChildren();
            parent.removeAllChildren();
            director.tick(0.2);//make sure is destroyed
        }

        //rigidbody, joint
        {
            const nodeRigidBody = new Node('RigidBody');
            parent.addChild(nodeRigidBody);
            const body = nodeRigidBody.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
            const joint = nodeRigidBody.addComponent(physics2d.DistanceJoint2D) as physics2d.Joint2D;

            const nodeRigidBody1 = new Node('RigidBody1');
            parent.addChild(nodeRigidBody1);
            const body1 = nodeRigidBody1.addComponent(physics2d.RigidBody2D) as physics2d.RigidBody2D;
            joint.connectedBody = body1;

            body1.destroy();
            director.tick(0.2);//make sure the body is destroyed
            joint.destroy();

            parent.destroyAllChildren();
            parent.removeAllChildren();
            director.tick(0.2);//make sure is destroyed
        }
    }
}