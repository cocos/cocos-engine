import { Node, Scene } from "../../cocos/core/scene-graph"
import { Vec3 } from "../../cocos/core/math"
import { director, game } from "../../cocos/core";
import { NodeEventType } from "../../cocos/core/scene-graph/node-event";

describe(`Node`, () => {
    test('@inverseTransformPoint', () => {
        let scene = new Scene('temp');
        let parentNode = new Node();
        let subNode = new Node();
        parentNode.setPosition(20, -30, 100);
        subNode.setPosition(55, 35, 22);
        parentNode.parent = scene;
        subNode.parent = parentNode;
        let p = new Vec3(100, 200, 0);
        subNode.inverseTransformPoint(p, p);
        expect(p).toStrictEqual(new Vec3(25, 195, -122));
    });

    test('active-in-hierarchy-changed', () => {
        const scene = new Scene('');
        director.runSceneImmediate(scene);
        const node = new Node();
        const cb = jest.fn((node: Node) => {
            expect(node.activeInHierarchy).toBeTruthy();
        });
        node.once(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, cb);
        scene.addChild(node);

        const cb1 = jest.fn((node: Node) => {
            expect(node.activeInHierarchy).toBeFalsy();
        });
        node.once(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, cb1);
        node.active = false;
        node.once(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, cb);
        node.active = true;

        const node2 = new Node();
        scene.addChild(node2);
        node2.active = false;
        node.once(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, cb1);
        node2.addChild(node);

        node.once(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, cb);
        node.setParent(scene);
        expect(cb).toBeCalledTimes(3);
        expect(cb1).toBeCalledTimes(2);
    });

    test('hierarchy-changed', () => {
        const scene = new Scene('');
        director.runSceneImmediate(scene);
        const node = new Node();
        const childNode = new Node();
        node.addChild(childNode);
        expect(node.hasChildrenHierarchyChanged()).toBeTruthy();

        game.step();
        expect(node.hasChildrenHierarchyChanged()).toBeFalsy();

        // scene -|
        //        |-node-|
        //               |-childNode                    
        // insert node, scene will be notify
        scene.addChild(node);
        expect(node.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(childNode.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();

        game.step();

        const node1 = new Node();
        // scene -|
        //        |- node -|
        //                 |-childNode
        //        |- node1
        // insert node1, scene will be notify
        scene.addChild(node1);
        expect(node1.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(node.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        // change node sibling index, scene will be notify
        node.setSiblingIndex(1);
        expect(node1.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(node.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();

        game.step();

        const childNode2 = new Node();
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        //                 |-childNode2
        // insert childNode2, node and scene will be notify
        node.addChild(childNode2);
        expect(node.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(node1.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        // change childNode2 sibling, node and scene will be notify
        childNode2.setSiblingIndex(0);
        expect(node.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(node1.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(childNode2.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(childNode.hasChildrenHierarchyChanged()).toBeFalsy();

        game.step();

        const childNode3 = new Node();
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        //                 |-childNode3
        // insert childNode3, node and scene will be notify
        node.addChild(childNode3);
        expect(node.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(node1.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(childNode2.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(childNode.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(childNode3.hasChildrenHierarchyChanged()).toBeFalsy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        // remove childNode3, node and scene will be notify
        childNode3.removeFromParent();
        expect(node.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(node1.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(scene.hasChildrenHierarchyChanged()).toBeTruthy();
        expect(childNode2.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(childNode.hasChildrenHierarchyChanged()).toBeFalsy();
        expect(childNode3.hasChildrenHierarchyChanged()).toBeFalsy();
    });
});
