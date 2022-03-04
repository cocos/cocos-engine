import { Node, Scene } from "../../cocos/core/scene-graph"
import { Vec3 } from "../../cocos/core/math"
import { director } from "../../cocos/core";
import { NodeEventType } from "../../cocos/core/scene-graph/node-event";
import { NodeUIProperties } from "../../cocos/core/scene-graph/node-ui-properties";

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
});
