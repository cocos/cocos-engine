module('cc.find', SetupEngine);

test('test', function () {
    var scene = cc.director.getScene();

    var node = new cc.Node('');
    scene.addChild(node);

    ok(cc.find('/') === node, 'should found, empty name, path starts with sep');
    ok(cc.find('') === node, 'should found, empty name');

    var node2 = new cc.Node('.赞');
    scene.addChild(node2);
    ok(cc.find('/.赞') === node2, 'should found, Chinese name, path starts with sep');
    ok(cc.find('.赞') === node2, 'should found, Chinese name');

    var nodenode = new cc.Node('');
    node.addChild(nodenode);
    ok(cc.find('//') === nodenode, 'should found, empty name * 2');
    ok(cc.find('/', node) === nodenode, 'should found by reference node, empty name * 2');

    var node2node2 = new cc.Node('Jare Guo');
    node2.addChild(node2node2);
    ok(cc.find('/.赞/Jare Guo') === node2node2, 'should found, name contains space, path starts with sep');
    ok(cc.find('.赞/Jare Guo') === node2node2, 'should found, name contains space');
    ok(cc.find('Jare Guo', node2) === node2node2, 'should found by reference node, name contains space');

    var ent2ent2ent2 = new cc.Node('FOO');
    node2node2.addChild(ent2ent2ent2);
    ok(cc.find('Jare Guo/FOO', node2) === ent2ent2ent2, 'should found by reference node');
});
