if (TestEditorExtends) {

    largeModule('Node serialization');

    function getRandomInt() {
        return Math.floor(Math.random() * 1000);
    }

    function getSpecRandomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function getRandomDouble() {
        return Math.random(0, 1000);
    }

    function getRandomBool() {
        var temp = getRandomInt(0, 1000);
        return (temp >= 500);
    }

    var compareKeys = [
        '_localZOrder',
        '_globalZOrder',
        '_scale',
        '_position',
        '_skewX',
        '_skewY',
        '_anchorPoint',
        '_contentSize',
        '_name',
        '_opacity',
        '_color',
        '_active',
        '__type__'
    ];

    function createNodeData(nodeName) {
        var trs = new Float32Array(10);
        for (var i = 0; i < trs.length; i++) {
            trs[i] = getRandomDouble();
        }
        return {
            '_localZOrder' : getRandomInt(),
            '_globalZOrder' : getRandomInt(),
            '_trs' : trs,
            '_skewX' : getRandomDouble(),
            '_skewY' : getRandomDouble(),
            '_active' : getRandomBool(),
            '_anchorPoint' : cc.v2(getRandomDouble(), getRandomDouble()),
            '_contentSize' : cc.size(getRandomDouble(), getRandomDouble()),
            '_name' : nodeName,
            '_opacity' : getSpecRandomInt(0, 256),
            '_color' : cc.color(getSpecRandomInt(0, 256), getSpecRandomInt(0, 256), getSpecRandomInt(0, 256), getSpecRandomInt(0, 256)),
            '__type__' : 'cc.Node'
        };
    }

    function createNode(nodeName) {
        var ret = new cc.Node();

        ret._localZOrder = getRandomInt();
        ret._globalZOrder = getRandomInt();
        ret.quat = cc.quat(getRandomDouble(), getRandomDouble(), getRandomDouble(), 1);
        ret.scale = cc.v3(getRandomDouble(), getRandomDouble(), getRandomDouble())
        ret.position = cc.v3(getRandomDouble(), getRandomDouble(), getRandomDouble());
        ret._skewX = getRandomDouble();
        ret._skewY = getRandomDouble();
        ret._active = getRandomBool();
        ret._anchorPoint = cc.v2(getRandomDouble(), getRandomDouble());
        ret._contentSize = cc.size(getRandomDouble(), getRandomDouble());
        ret._name = nodeName;
        ret._opacity = getSpecRandomInt(0, 256);
        ret._color = cc.color(getSpecRandomInt(0, 256), getSpecRandomInt(0, 256), getSpecRandomInt(0, 256), getSpecRandomInt(0, 256));
        ret.__type__ = 'cc.Node';

        return ret;
    }

    function checkNodeData(originData, node) {
        for (var prop in originData) {
            if (originData.hasOwnProperty(prop))
                equal(node.prop, originData.prop, '"' + prop + '" should be equal between serialize data & node data.');
        }
    }

    function compare2Nodes(node1, node2) {
        for (var i in compareKeys) {
            var key = compareKeys[i];
            equal(node1.key, node2.key, '"' + key + '" should be equal between two nodes.');
        }

        equal(node1.getChildrenCount(), node2.getChildrenCount(), 'The children count should be equal between two nodes.');
        if (node1.getChildrenCount() > 0) {
            var children = node1.getChildren();
            for (var j = 0; j < children.length; ++j) {
                compare2Nodes(children[j], node2.getChildren()[j], 'The children content should be equal between two nodes.');
            }
        }
    }

    test('basic test deserialize', function () {
        var nodeData = createNodeData('rootNode');
        var rootNode = cc.deserialize(nodeData);
        checkNodeData(nodeData, rootNode);
    });

    test('basic test serialize', function() {
        var node = createNode('rootNode');
        var json = JSON.parse(Editor.serialize(node));
        checkNodeData(json, node);
    });

    test('test the node tree serialize & deserialize', function() {
        var rootNode = createNode('rootNode');
        var child1 = createNode('child1');
        var child2 = createNode('child2');
        var child11 = createNode('child11');
        var child12 = createNode('child12');
        var child13 = createNode('child13');

        rootNode.addChild(child1);
        rootNode.addChild(child2);
        child1.addChild(child11);
        child1.addChild(child12);
        child1.addChild(child13);

        var json = Editor.serialize(rootNode);
        var newNode = cc.deserialize(json);
        compare2Nodes(rootNode, newNode);
    });
}
