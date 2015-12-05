module('Attribute');

test('base', function () {
    var MyCompBase = function () {
        this.baseVal = [];
    };

    cc.Class.attr(MyCompBase, 'baseVal', {
        data: 'waha'
    });

    strictEqual(cc.Class.attr(MyCompBase, 'baseVal').data, 'waha', 'can get attribute');

    cc.Class.attr(MyCompBase, 'baseVal').foo = { bar: 524 };
    strictEqual(cc.Class.attr(MyCompBase, 'baseVal').foo.bar, 524, 'can assign directly');

    var attr = cc.Class.attr(MyCompBase, 'baseVal', {
        cool: 'nice'
    });
    ok(attr.data && attr.cool && attr.foo, 'can merge multi attribute');

    cc.Class.attr(MyCompBase, 'baseVal', {
        data: false
    });
    strictEqual(attr.data, false, 'can change attribute');

    // inherit

    var MyComp1 = function () { };
    cc.js.extend(MyComp1, MyCompBase);
    var MyComp2 = function () { };
    cc.js.extend(MyComp2, MyCompBase);

    strictEqual(cc.Class.attr(MyComp1, 'baseVal').cool, 'nice', 'can get inherited attribute');
    cc.Class.attr(MyComp1, 'baseVal', {cool: 'good'});
    strictEqual(cc.Class.attr(MyComp1, 'baseVal').cool, 'good', 'can override inherited attribute');

    // yes, current implement of attr is not based on real javascript prototype
    strictEqual(cc.Class.attr(MyCompBase, 'baseVal').cool, 'good', 'Oh yes, sub prop of base class will be pulluted!');

    cc.Class.attr(MyComp1, 'subVal', {}).cool = 'very nice';
    strictEqual(cc.Class.attr(MyComp1, 'subVal').cool, 'very nice', 'can have own attribute');

    strictEqual(cc.Class.attr(MyCompBase, 'subVal'), undefined, 'main prop of base class not pulluted');
    strictEqual(cc.Class.attr(MyComp2, 'subVal'), undefined, 'sibling class not pulluted');
});

test('not object type', function () {
    var MyCompBase = function () {};
    cc.Class.attr(MyCompBase, 'subVal', false);
    strictEqual(cc.Class.attr(MyCompBase, 'subVal'), false, 'attr should set to false');
    cc.Class.attr(MyCompBase, 'subVal', true);
    strictEqual(cc.Class.attr(MyCompBase, 'subVal'), true, 'attr should set to true');
});

test('dynamic attribute for instance', function () {
    var MyCompBase = function () {};
    var comp = new MyCompBase();

    cc.Class.attr(MyCompBase, 'subVal', false);
    cc.Class.attr(comp, 'subVal', true);
    strictEqual(cc.Class.attr(MyCompBase, 'subVal'), false, 'class attr should set to false');
    strictEqual(cc.Class.attr(comp, 'subVal'), true, 'instance attr should set to true');

    cc.Class.attr(MyCompBase, 'baseVal', 123);
    strictEqual(cc.Class.attr(comp, 'baseVal'), 123, 'instance attr should inherited from base');


    cc.Class.attr(MyCompBase, 'readonly', {a: false});
    cc.Class.attr(comp, 'readonly', {b: true});
    deepEqual(cc.Class.attr(comp, 'readonly'), {a: false, b: true}, 'object attrs should merged');

    cc.Class.attr(MyCompBase, 'readonly', {b: false});
    deepEqual(cc.Class.attr(comp, 'readonly'), {a: false, b: true}, 'instance attr should override base');

    cc.Class.attr(MyCompBase, 'readonly', {b: false});
    deepEqual(cc.Class.attr(MyCompBase, 'readonly'), {a: false, b: false}, 'class attrs should not changed');
});
