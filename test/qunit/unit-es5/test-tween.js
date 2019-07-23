largeModule('Tween', SetupEngine);

var tween = cc.tween;
// init a new node
function initNode(name) {
    var node = new cc.Node();
    node.name = name;
    node.position = cc.v2(0, 0);
    node.scale = 1;
    node.anchorX = 0.5;
    node.anchorY = 0.5;
    node.width = 100;
    node.height = 100;
    node.rotation = 0;
    return node;
}

asyncTest('basic test', function () {
    cc.game.resume();
    var node1 = initNode('node1');
    tween(node1)
        .to(1, { scale: 2 })
        .call(function () {
            strictEqual(node1.scale, 2, 'tween to scale');
        })
        .by(1, { scale: 2 })
        .call(function () {
            strictEqual(node1.scale, 4, 'tween by scale');
            start();
        })
        .start();

    var obj = { a: 0 };
    tween(obj)
        .to(0.5, { a: 100 })
        .call(function () {
            strictEqual(obj.a, 100, 'Object propertype test');
        })
        .start();

    var node2 = initNode('node2');
    var node3 = initNode('node3');
    var count = 0;
    function check() {
        if (node2.scale !== 1 && node3.scale !== 1) {
            count++;
            if (count === 2) {
                strictEqual(node2.scale, 2, 'run tween on different target: node2');
                strictEqual(node3.scale, 2, 'run tween on different target: node3');
            }
        }
    }
    var tmpTween = tween().to(0.5, { scale: 2 }).call(check);
    // run tween on different target
    tmpTween.clone(node2).start();
    tmpTween.clone(node3).start();
});

function actionUpdate(action, node, t) {
    if (action._actions.length <= 0) return;
    var actions = action._actions;
    for (var i = 0; i < actions.length; i++) {
        actions[i].startWithTarget(node);
        // The range of t is 0 ~ 1
        actions[i].update(t);
    }
}

test('ease test', function () {
    cc.game.resume();
    // builtin easing
    var node = initNode('easeNode');
    var action = tween(node).to(0.1, { scale: 2 }, { easing: 'sineOutIn' });
    actionUpdate(action, node, 0.5);
    close(node.scale, 1.5, 0.0001, 'easing can set value');

    // custom easing
    node.scale = 1;
    action = tween(node).to(0.1, { scale: 2 }, { easing: function (t) { return t * t; } });
    actionUpdate(action, node, 0.9);
    close(node.scale, 1.81, 0.0001, 'easing can set calculation equation.');

    // easing to single property
    node.scale = 1;
    action = tween(node)
        .to(0.5, {
            scale: 2,
            position: {
                value: cc.v2(100, 100),
                easing: 'sineOutIn'
            }
        });
    actionUpdate(action, node, 1 / 6.0);
    deepClose(node.scale, 1 + (1 / 6.0), 0.001, 'easing can set multiple value: scale');
    deepClose(cc.v2(node.position), cc.v2(25, 25), 0.001, 'easing can set multiple value: position');

});

asyncTest('progress test', function () {
    cc.game.resume();
    var node = initNode('progressNode');
    // custom property progress 
    tween(node)
        .to(0.1, { scale: 2 }, {
            progress: function (start, end, current, t) {
                return start + (end - start) * t;
            }
        })
        .call(function () { strictEqual(node.scale, 2, 'tween can set progress property'); })
        .start();
    // custom property progress to single property
    node.scale = 1;
    tween(node)
        .to(0.5, {
            scale: 2,
            position: {
                value: cc.v2(100, 100),
                progress: function (start, end, current, t) {
                    return start.lerp(end, t, current);
                }
            }
        })
        .call(function () {
            strictEqual(node.scale, 2, 'custom property progress: scale not setting');
            deepEqual(cc.v2(node.position), cc.v2(100, 100), 'custom property progress to single property: position');
            start();
        })
        .start();
});

asyncTest('reuse test', function () {
    cc.game.resume();
    var scale = tween().to(0.5, { scale: 2 });
    var angle = tween().to(0.5, { rotation: 90 });
    var position = tween().to(0.5, { position: cc.v2(100, 100) });

    var node = initNode('reuseNode');
    tween(node)
        .then(scale)
        .then(angle)
        .then(position)
        .call(function () {
            strictEqual(node.scale, 2, 'reuse check: scale');
            strictEqual(node.rotation, 90, 'reuse check: rotation');
            deepEqual(cc.v2(node.position), cc.v2(100, 100), 'reuse check: postion');
            start();
        })
        .start();
});