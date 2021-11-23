import { Node, Scene } from "../../cocos/core/scene-graph"
import { Vec3 } from "../../cocos/core/math"
import { director } from "../../cocos/core";
import { NodeEventType } from "../../cocos/core/scene-graph/node-event";
import { NodeUIProperties } from "../../cocos/core/scene-graph/node-ui-properties";

describe(`Node`, () => {
    test('mark-opacity-tree',() => {
        let scene = new Scene('scene');
        let rootNode = new Node('root');
        let node_1 = new Node('node_1');
        let node_2 = new Node('node_2');
        let node_1_1 = new Node('node_1_1');
        let node_1_2 = new Node('node_1_2');
        let node_2_1 = new Node('node_2_1');
        let node_2_2 = new Node('node_2_2');
        let node_1_1_1 = new Node('node_1_1_1');
        let node_1_2_1 = new Node('node_1_2_1');

        rootNode.parent = scene;
        node_1.parent = rootNode;
        node_2.parent = rootNode;
        node_1_1.parent = node_1;
        node_1_2.parent = node_1;
        node_2_1.parent = node_2;
        node_2_2.parent = node_2;
        node_1_1_1.parent = node_1_1;
        node_1_2_1.parent = node_1_2;

        // set all nodes alpha-dirty to false
        NodeUIProperties.markOpacityTree(rootNode, false);
        expect(node_2_1._uiProps.opacityDirty).toStrictEqual(false);

        // modify node_1 and its subtree, node_2 and its subtree are not influenced
        NodeUIProperties.markOpacityTree(node_1);
        expect(node_1._uiProps.opacityDirty).toStrictEqual(true);
        expect(node_1_1._uiProps.opacityDirty).toStrictEqual(true);
        expect(node_1_2_1._uiProps.opacityDirty).toStrictEqual(true);
        expect(node_2_2._uiProps.opacityDirty).toStrictEqual(false);
    });

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
        const nodeCB = jest.fn(() => {});
        node.on(NodeEventType.HIERARCHY_CHANGED, nodeCB);
        const childNodeCB = jest.fn(() => {});
        childNode.on(NodeEventType.HIERARCHY_CHANGED, childNodeCB);
        // scene -|
        //        |-node-|
        //               |-childNode                    
        // insert node, node and child node hierarchy changed
        scene.addChild(node);
        expect(nodeCB).toBeCalledTimes(1);
        expect(childNodeCB).toBeCalledTimes(1);

        const node1CB = jest.fn(() => {});
        const node1 = new Node();
        node1.on(NodeEventType.HIERARCHY_CHANGED, node1CB);
        // scene -|
        //        |- node -|
        //                 |-childNode
        //        |- node1
        // insert node1, node1 hierarchy changed, node and child node hierarchy remained
        scene.addChild(node1);
        expect(nodeCB).toBeCalledTimes(1);
        expect(childNodeCB).toBeCalledTimes(1);
        expect(node1CB).toBeCalledTimes(1);

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        // change node1 sibling index, every node hierarchy changed
        node.setSiblingIndex(1);
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(2);
        expect(node1CB).toBeCalledTimes(2);

        const childNode2 = new Node();
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        //                 |-childNode2
        // insert childNode2, every node hierarchy remained
        node.addChild(childNode2);
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(2);
        expect(node1CB).toBeCalledTimes(2);

        const childNode2CB = jest.fn(() => {});
        childNode2.on(NodeEventType.HIERARCHY_CHANGED, childNode2CB);
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        // change childNode2 sibling, childNode2 and childNode hierarchy changed
        childNode2.setSiblingIndex(0);
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(3);
        expect(node1CB).toBeCalledTimes(2);
        expect(childNode2CB).toBeCalledTimes(1);

        const childNode3 = new Node();
        const childNode3CB = jest.fn(() => {});
        childNode3.on(NodeEventType.HIERARCHY_CHANGED, childNode3CB);
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        //                 |-childNode3
        // insert childNode3, childNode3 hierarchy changed
        node.addChild(childNode3);
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(3);
        expect(node1CB).toBeCalledTimes(2);
        expect(childNode2CB).toBeCalledTimes(1);
        expect(childNode3CB).toBeCalledTimes(1);

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode3
        //                 |-childNode
        // change childNode3 sibling, childNode, childNode3 hierarchy changed
        childNode3.setSiblingIndex(1);
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(4);
        expect(node1CB).toBeCalledTimes(2);
        expect(childNode2CB).toBeCalledTimes(1);
        expect(childNode3CB).toBeCalledTimes(2);

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        // remove childNode3, childNode, childNode3 hierarchy changed
        childNode3.removeFromParent();
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(5);
        expect(node1CB).toBeCalledTimes(2);
        expect(childNode2CB).toBeCalledTimes(1);
        expect(childNode3CB).toBeCalledTimes(3);
        
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        // remove childNode2, childNode, childNode2 hierarchy changed
        childNode2.removeFromParent();
        expect(nodeCB).toBeCalledTimes(2);
        expect(childNodeCB).toBeCalledTimes(6);
        expect(node1CB).toBeCalledTimes(2);
        expect(childNode2CB).toBeCalledTimes(2);
        expect(childNode3CB).toBeCalledTimes(3);

        // scene -|
        //        |- node -|
        //                 |-childNode
        // remove node1, node, node1, childNode hierarchy changed
        node1.removeFromParent();
        expect(nodeCB).toBeCalledTimes(3);
        expect(childNodeCB).toBeCalledTimes(7);
        expect(node1CB).toBeCalledTimes(3);
        expect(childNode2CB).toBeCalledTimes(2);
        expect(childNode3CB).toBeCalledTimes(3);

        // scene -|
        // remove node, node, childNode hierarchy changed
        node.removeFromParent();
        expect(nodeCB).toBeCalledTimes(4);
        expect(childNodeCB).toBeCalledTimes(8);
        expect(node1CB).toBeCalledTimes(3);
        expect(childNode2CB).toBeCalledTimes(2);
        expect(childNode3CB).toBeCalledTimes(3);
    });
});
