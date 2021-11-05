import { director } from "../../cocos/core/director";
import { find, Node, Scene } from "../../cocos/core/scene-graph";

test('cc.find', function () {
    const scene = new Scene('');
    director.runSceneImmediate(scene);

    const node = new Node('test');
    scene.addChild(node);

    expect(find('/test')).toBe(node);
    expect(find('test')).toBe(node);

    const node2 = new Node('.赞');
    scene.addChild(node2);
    expect(find('/.赞')).toBe(node2);
    expect(find('.赞')).toBe(node2);

    // const nodenode = new Node('');
    // node.addChild(nodenode);
    // expect(find('//')).toBe(nodenode);
    // expect(find('/', node)).toBe(nodenode);

    const node2node2 = new Node('Jare Guo');
    node2.addChild(node2node2);
    expect(find('/.赞/Jare Guo')).toBe(node2node2);
    expect(find('.赞/Jare Guo')).toBe(node2node2);
    expect(find('Jare Guo', node2)).toBe(node2node2);

    const ent2ent2ent2 = new Node('FOO');
    node2node2.addChild(ent2ent2ent2);
    expect(find('Jare Guo/FOO', node2)).toBe(ent2ent2ent2);
});
