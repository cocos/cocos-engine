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
});
