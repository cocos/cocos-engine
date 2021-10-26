import { director } from "../../cocos/core/director";
import { find, Node, Scene } from "../../cocos/core/scene-graph";

test('cc.find', function () {
    const scene = new Scene('myScene');
    director.runSceneImmediate(scene);

    const nodeFirst = new Node('test');
    scene.addChild(nodeFirst);
    expect(find('/test')).toBe(nodeFirst);
    expect(find('test')).toBe(nodeFirst);

    const nodeSecond = new Node('');
    nodeFirst.addChild(nodeSecond);
    expect(find('/test/')).toBe(nodeSecond);
    expect(find('/', nodeFirst)).toBe(nodeSecond);

    const nodeThird = new Node('');
    nodeSecond.addChild(nodeThird);
    expect(find('//',nodeFirst)).toBe(nodeThird);
    expect(find('/',nodeSecond)).toBe(nodeThird);

    const node2 = new Node('.赞');
    scene.addChild(node2);
    expect(find('/.赞')).toBe(node2);
    expect(find('.赞')).toBe(node2);

    const node2node2 = new Node('Jare Guo');
    node2.addChild(node2node2);
    expect(find('/.赞/Jare Guo')).toBe(node2node2);
    expect(find('.赞/Jare Guo')).toBe(node2node2);
    expect(find('Jare Guo', node2)).toBe(node2node2);

    const ent2ent2ent2 = new Node('FOO');
    node2node2.addChild(ent2ent2ent2);
    expect(find('Jare Guo/FOO', node2)).toBe(ent2ent2ent2);
});
