import { director } from '../../cocos/game';
import { ccclass, requireComponent } from '../../cocos/core/data/decorators';
import { Node, Scene, Component } from '../../cocos/scene-graph';


describe('require component', () => {
    @ccclass('CompA')
    class CompA extends Component {}

    @ccclass('CompB')
    @requireComponent(CompA)
    class CompB extends Component {}

    @ccclass('CompC')
    @requireComponent(CompB)
    class CompC extends Component {}

    @ccclass('CompD')
    @requireComponent(CompB)
    class CompD extends Component {}

    @ccclass('CompE')
    class CompE extends Component {}

    @ccclass('CompF')
    @requireComponent([CompE, CompB])
    class CompF extends Component {}

    @ccclass('CompG')
    @requireComponent([])
    class CompG extends Component {}

    @ccclass('CompH')
    @requireComponent(null)
    class CompH extends Component {}

    @ccclass('CompI')
    @requireComponent([CompA, null, undefined])
    class CompI extends Component {}

    const scene = new Scene('');
    director.runSceneImmediate(scene);

    test('require component', () => {
        const node = new Node();
        scene.addChild(node);
        node.addComponent(CompB);
        expect(node.getComponents(CompA).length).toBe(1);
        const node1 = new Node();
        scene.addChild(node1);
        node1.addComponent(CompC);
        expect(node1.getComponents(CompB).length).toBe(1);
        expect(node1.getComponents(CompA).length).toBe(1);
        const node2 = new Node();
        scene.addChild(node2);
        node2.addComponent(CompC);
        node2.addComponent(CompD);
        expect(node2.getComponents(CompB).length).toBe(1);
        expect(node2.getComponents(CompA).length).toBe(1);
        const node3 = new Node();
        scene.addChild(node3);
        node3.addComponent(CompH);
        expect(node3.getComponents(Component).length).toBe(1);
    });

    test('multi require component', () => {
        const node = new Node();
        scene.addChild(node);
        node.addComponent(CompF);
        expect(node.getComponents(CompE).length).toBe(1);
        expect(node.getComponents(CompB).length).toBe(1);
        expect(node.getComponents(CompA).length).toBe(1);
        const node1 = new Node();
        scene.addChild(node1);
        node1.addComponent(CompG);
        expect(node1.getComponents(Component).length).toBe(1);
        const node2 = new Node();
        scene.addChild(node2);
        node2.addComponent(CompI);
        expect(node2.getComponents(Component).length).toBe(2);
    });

    test('dependant component', () => {
        const node = new Node();
        scene.addChild(node);
        node.addComponent(CompF);
        node.addComponent(CompC);
        // @ts-expect-error
        expect(node._getDependComponent(node.getComponent(CompB)).length).toBe(2);
        // @ts-expect-error
        expect(node._getDependComponent(node.getComponent(CompE)).length).toBe(1);
    });
});