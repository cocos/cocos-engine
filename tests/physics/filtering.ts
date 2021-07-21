import { director, game, geometry, Node, Vec3 } from "../../cocos/core";
import { physics } from "../../exports/physics-framework";

/**
 * This function is used to test the filtering
 */
export default function (parent: Node, _steps = 0) {

    // group mask
    {
        const nodeStatic = new Node('StaticB');
        parent.addChild(nodeStatic);
        nodeStatic.worldScale = new Vec3(20, 0.01, 20);
        nodeStatic.worldPosition = new Vec3(0, -0.005, 0);
        const boxStatic = nodeStatic.addComponent(physics.BoxCollider) as physics.BoxCollider;
        const bodyStatic = nodeStatic.addComponent(physics.RigidBody) as physics.RigidBody;
        bodyStatic.type = physics.ERigidBodyType.STATIC;

        const gA = 1 << 2;
        const gB = 1 << 5;
        bodyStatic.setGroup(gA);
        expect(boxStatic.getGroup()).toBe(gA);
        bodyStatic.addGroup(gB);
        expect(boxStatic.getGroup()).toBe(gA + gB);
        bodyStatic.removeGroup(gA);
        expect(boxStatic.getGroup()).toBe(gB);

        bodyStatic.setMask(gA);
        expect(boxStatic.getMask()).toBe(gA);
        bodyStatic.addMask(gB);
        expect(boxStatic.getMask()).toBe(gA + gB);
        bodyStatic.removeMask(gA);
        expect(boxStatic.getMask()).toBe(gB);
        nodeStatic.destroy();
        nodeStatic.removeFromParent();
    }

    // collision matrix
    {
        const config = {
            collisionGroups: [
                {
                    "index": 1,
                    "name": "BIT_1"
                },
                {
                    "index": 2,
                    "name": "BIT_2"
                }
            ],
            collisionMatrix: {
                "0": 5, // can collide with Default\BIT_2
                "1": 6, // can collide with BIT_1\BIT_2
                "2": 7  // can collide with Default\BIT_1\BIT_2
            }
        };
        physics.PhysicsSystem.instance.resetConfiguration(config);

        const node1 = new Node('1');
        const boxNode1 = node1.addComponent(physics.BoxCollider) as physics.BoxCollider;
        const bodyNode1 = node1.addComponent(physics.RigidBody) as physics.RigidBody;
        bodyNode1.group = physics.PhysicsGroup['BIT_1'];
        parent.addChild(node1);
        expect(boxNode1.getGroup()).toBe(physics.PhysicsGroup['BIT_1']);
        expect(boxNode1.getGroup()).toBe(bodyNode1.getGroup());
        expect(boxNode1.getMask()).toBe(bodyNode1.getMask());
        expect(bodyNode1.getMask()).toBe(
            physics.PhysicsSystem.instance.collisionMatrix[physics.PhysicsGroup['BIT_1']]
        );
        node1.destroy();
        node1.removeFromParent();

        const node2 = new Node('2');
        parent.addChild(node2);
        const boxNode2 = node2.addComponent(physics.BoxCollider) as physics.BoxCollider;
        const bodyNode2 = node2.addComponent(physics.RigidBody) as physics.RigidBody;
        expect(boxNode2.getGroup()).toBe(physics.PhysicsGroup.DEFAULT);
        expect(boxNode2.getGroup()).toBe(bodyNode2.getGroup());
        expect(boxNode2.getMask()).toBe(bodyNode2.getMask());
        expect(bodyNode2.getMask()).toBe(
            physics.PhysicsSystem.instance.collisionMatrix[physics.PhysicsGroup.DEFAULT]
        );
        node2.destroy();
        node2.removeFromParent();

        parent.destroyAllChildren();
        parent.removeAllChildren();
    }
}