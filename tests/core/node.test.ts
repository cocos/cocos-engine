import { find, Node, Scene, Component } from "../../cocos/scene-graph"
import { Mat4, Vec3 } from "../../cocos/core/math"
import { CCObject } from "../../cocos/core";
import { NodeEventType } from "../../cocos/scene-graph/node-event";
import { ccclass } from "../../cocos/core/data/decorators";
import {director, game } from '../../cocos/game';

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

    test('set parent and keep world transform', () => {
        let scene = new Scene('temp');
        let node = new Node();
        node.parent = scene;
        node.position = new Vec3(10, 3.5, -2.4);
        node.eulerAngles = new Vec3(47.5, 23, -3);
        node.scale = new Vec3(2, 0.5, 1);

        let node2 = new Node();
        node2.position = new Vec3(5, -10, 3);
        node2.eulerAngles = new Vec3(0, 90, 45);
        node2.scale = new Vec3(1, 1, 2);
        node2.parent = scene;
        const globalPosition = node2.worldPosition.clone();

        node2.setParent(node, true);
        node2.updateWorldTransform();
        expect(node2.worldPosition.equals(globalPosition)).toBeTruthy();
        expect(Vec3.transformMat4(new Vec3(), new Vec3(0, 0, 0), node2.worldMatrix).equals(new Vec3(5, -10, 3))).toBeTruthy();
        expect(Mat4.multiply(new Mat4, Mat4.invert(new Mat4, node.worldMatrix), node2.worldMatrix).equals(Mat4.fromRTS(new Mat4(), node2.rotation, node2.position, node2.scale))).toBeTruthy();

        node2.setParent(scene, true);
        node2.updateWorldTransform();
        expect(node2.worldPosition.equals(globalPosition)).toBeTruthy();
        expect(Vec3.transformMat4(new Vec3(), new Vec3(0, 0, 0), node2.worldMatrix).equals(new Vec3(5, -10, 3))).toBeTruthy();
        expect(node2.worldMatrix.equals(Mat4.fromRTS(new Mat4(), node2.rotation, node2.position, node2.scale))).toBeTruthy();
        const rot = node2.rotation.clone();
        const scale = node2.scale.clone();
        const pos = node2.position.clone();
        const worldMat = node2.worldMatrix.clone();

        // set parent's scale to zero
        node.scale = new Vec3(0, 2, 1);
        node2.setParent(node, true);
        node2.updateWorldTransform();
        expect(node2.position.equals(pos)).toBeTruthy();
        expect(node2.rotation.equals(rot)).toBeTruthy();
        expect(node2.scale.equals(scale)).toBeTruthy();
        expect(node2.worldPosition.equals(globalPosition)).toBeFalsy();
        expect(node2.worldMatrix.equals(worldMat)).toBeFalsy();
        expect(Mat4.determinant(node2.worldMatrix)).toBeCloseTo(0, 6);
    });
    
    test('component event', () => {
        let onLoadCalled = false;
        let onDestroyCalled = false;
        @ccclass('TestComponent')
        class TestComponent extends Component {
            onLoad () {
                onLoadCalled = true;
            }

            onDestroy () {
                onDestroyCalled = true;
            }
        }

        const scene = new Scene('');
        director.runSceneImmediate(scene);
        const node = new Node();
        let compParam;
        const addCb = jest.fn((tempComp) => { compParam = tempComp; expect(onLoadCalled).toBeFalsy(); });
        const removeCb = jest.fn((tempComp) => { 
            compParam = tempComp; 
            if (onLoadCalled) { 
                expect(onDestroyCalled).toBeTruthy(); 
            } else {
                expect(onDestroyCalled).toBeFalsy(); 
            }
        });
        node.on(NodeEventType.COMPONENT_ADDED, addCb);
        node.on(NodeEventType.COMPONENT_REMOVED, removeCb)
        let comp = node.addComponent(TestComponent);
        expect(addCb).toBeCalledTimes(1);
        expect(comp).toBe(compParam);
        expect(onLoadCalled).toBeFalsy();
        node.removeComponent(comp);
        game.step();
        expect(removeCb).toBeCalledTimes(1);
        expect(comp).toBe(compParam);
        expect(onDestroyCalled).toBeFalsy();
        scene.addChild(node);
        comp = node.addComponent(TestComponent);
        expect(addCb).toBeCalledTimes(2);
        expect(comp).toBe(compParam);
        expect(onLoadCalled).toBeTruthy();
        comp.destroy();
        game.step();
        expect(removeCb).toBeCalledTimes(2);
        expect(comp).toBe(compParam);
        expect(onDestroyCalled).toBeTruthy();

        onLoadCalled = onDestroyCalled = false;
        comp = node.addComponent(TestComponent);
        expect(addCb).toBeCalledTimes(3);
        expect(comp).toBe(compParam);
        expect(onLoadCalled).toBeTruthy();
        comp._destroyImmediate();
        expect(removeCb).toBeCalledTimes(3);
        expect(comp).toBe(compParam);
        expect(onDestroyCalled).toBeTruthy();
    });

    test('query component with abstracted class', () => {
        abstract class BaseComponent extends Component {
            abstract testMethod ();
        }

        @ccclass('abc')
        class TestComponent extends BaseComponent {
            testMethod () {
                console.log('test');
            }
        }

        const node = new Node('test');
        const scene = new Scene('test-scene');
        director.runScene(scene);
        scene.addChild(node);
        const testComp = node.addComponent(TestComponent);
        expect(node.getComponent(BaseComponent)).toBe(testComp);
    });

    test('persist node', () => {
        const sceneA = new Scene('A');
        director.runSceneImmediate(sceneA);
        const nodeA = new Node('test a');
        sceneA.addChild(nodeA);
        game.addPersistRootNode(nodeA);
        const sceneB = new Scene('B');
        director.runSceneImmediate(sceneB);
        expect(find('test a')).toBe(nodeA);
        expect(nodeA._persistNode).toBeTruthy();
        expect(nodeA.hideFlags & CCObject.Flags.DontSave).toBeTruthy();

        const nodeB = new Node('test b');
        game.addPersistRootNode(nodeB);
        expect(nodeB._persistNode).toBeTruthy();
        expect(find('test b')).toBeTruthy();

        const sceneC = new Scene('C');
        // @ts-expect-error access priority
        sceneC._id = sceneA.uuid;
        const nodeC = new Node('test c');
        // @ts-expect-error access priority
        nodeC._id = nodeA.uuid;
        sceneC.addChild(nodeC);
        director.runSceneImmediate(sceneC);
        expect(find('test c')).toBeFalsy();
        expect(find('test a')).toBe(nodeA);
        expect(nodeA.hideFlags & CCObject.Flags.DontSave).toBeFalsy();
    });

    test('flagChangedVersion', () => {
        const node = new Node();
        const val1 = node.flagChangedVersion;
        expect(val1).toBe(0);
        node.position = new Vec3(1, 2, 3);
        const val2 = node.flagChangedVersion;
        expect(val2).not.toBe(val1);
        node.position = new Vec3(1, 2, 3);
        node.scale = new Vec3(1, 2, 3);
        node.eulerAngles = new Vec3(1, 2, 3);
        expect(node.flagChangedVersion).toBe(val2);
        Node.resetHasChangedFlags();
        node.scale = new Vec3(3, 2, 1);
        const val3 = node.flagChangedVersion;
        expect(val3).not.toBe(val2);
        expect(val3).not.toBe(val1);
        node.scale = new Vec3(1, 2, 3);
        expect(node.flagChangedVersion).toBe(val3);
        Node.resetHasChangedFlags();
        node.eulerAngles = new Vec3(3, 2, 1);
        const val4 = node.flagChangedVersion;
        expect(val4).not.toBe(val3);
        expect(val4).not.toBe(val2);
        expect(val4).not.toBe(val1);
        node.eulerAngles = new Vec3(1, 2, 3);
        expect(node.flagChangedVersion).toBe(val4);
    });
});
