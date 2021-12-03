import { Node, Scene } from "../../cocos/core/scene-graph"
import { Vec3 } from "../../cocos/core/math"
import { CCObject, director, game } from "../../cocos/core";
import { NodeEventType } from "../../cocos/core/scene-graph/node-event";
import { NodeUIProperties } from "../../cocos/core/scene-graph/node-ui-properties";
import { Batcher2D } from "../../cocos/2d/renderer/batcher-2d";

director.root!._batcher = new Batcher2D(director.root);

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

    test('get-current-path',() => {
        let scene = new Scene('tempScene');
        
        let node1: Node = new Node();
        node1.name = 'node1';
        node1.setParent(scene);
        
        let node2: Node = new Node();
        node2.name = 'node2';
        node2.setParent(node1);

        let node3: Node = new Node();
        node3.name = 'node3';
        node3.setParent(node2);

        let node3Bro: Node = new Node();
        node3Bro.name = 'node3Bro';
        node3Bro.setParent(node2);

        let path1 = node1.getPathInHierarchy();
        expect(path1).toStrictEqual('node1');

        let path2 = node2.getPathInHierarchy();
        expect(path2).toStrictEqual('node1/node2');

        let path3 = node3.getPathInHierarchy();
        expect(path3).toStrictEqual('node1/node2/node3');

        let path3Bro = node3Bro.getPathInHierarchy();
        expect(path3Bro).toStrictEqual('node1/node2/node3Bro');
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

    test('active-undefined', () => {
        let scene = new Scene('temp');
        let node = new Node();
        node.parent = scene;
        
        node.active = true;
        node.active = undefined;
        expect(node.active).toBe(false);

        node.active = true;
        node.active = null;
        expect(node.active).toBe(false);

        // @ts-expect-error
        node.active = '' as boolean;
        // @ts-expect-error
        node.active = 0 as boolean;

        node.active = true;
        expect(node.active).toBe(true);
    });

    test('hierarchy-changed', () => {
        const scene = new Scene('');
        director.runSceneImmediate(scene);
        const node = new Node();
        const childNode = new Node();
        node.addChild(childNode);
        expect(node.hasChildTreeUpdated()).toBeTruthy();

        game.step();
        expect(node.hasChildTreeUpdated()).toBeFalsy();

        // scene -|
        //        |-node-|
        //               |-childNode
        // insert node, scene will be notify
        scene.addChild(node);
        expect(node.hasChildTreeUpdated()).toBeFalsy();
        expect(childNode.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();

        game.step();

        const node1 = new Node();
        // scene -|
        //        |- node -|
        //                 |-childNode
        //        |- node1
        // insert node1, scene will be notify
        scene.addChild(node1);
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(node.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        // change node sibling index, scene will be notify
        node.setSiblingIndex(1);
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(node.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();

        game.step();

        const childNode2 = new Node();
        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        //                 |-childNode2
        // insert childNode2, node and scene will be notify
        node.addChild(childNode2);
        expect(node.hasChildTreeUpdated()).toBeTruthy();
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        // change childNode2 sibling, node and scene will be notify
        childNode2.setSiblingIndex(0);
        expect(node.hasChildTreeUpdated()).toBeTruthy();
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();
        expect(childNode2.hasChildTreeUpdated()).toBeFalsy();
        expect(childNode.hasChildTreeUpdated()).toBeFalsy();

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
        expect(node.hasChildTreeUpdated()).toBeTruthy();
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();
        expect(childNode2.hasChildTreeUpdated()).toBeFalsy();
        expect(childNode.hasChildTreeUpdated()).toBeFalsy();
        expect(childNode3.hasChildTreeUpdated()).toBeFalsy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode2
        //                 |-childNode
        // remove childNode3, node and scene will be notify
        childNode3.removeFromParent();
        expect(node.hasChildTreeUpdated()).toBeTruthy();
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();
        expect(childNode2.hasChildTreeUpdated()).toBeFalsy();
        expect(childNode.hasChildTreeUpdated()).toBeFalsy();
        expect(childNode3.hasChildTreeUpdated()).toBeFalsy();

        game.step();

        // scene -|
        //        |- node1
        //        |- node -|
        //                 |-childNode
        // destroy childNode2, node and scene will be notify
        childNode2.destroy();
        CCObject._deferredDestroy();
        expect(node.hasChildTreeUpdated()).toBeTruthy();
        expect(node1.hasChildTreeUpdated()).toBeFalsy();
        expect(scene.hasChildTreeUpdated()).toBeTruthy();
        expect(childNode.hasChildTreeUpdated()).toBeFalsy();
    });
});
