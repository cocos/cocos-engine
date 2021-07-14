module('Attribute');

test('base', function () {
    var MyCompBase = function () {
        this.baseVal = [];
    };

    cc.Class.Attr.setClassAttr(MyCompBase, 'baseVal', 'data', 'waha');

    strictEqual(cc.Class.attr(MyCompBase, 'baseVal').data, 'waha', 'can get attribute');

    cc.Class.Attr.setClassAttr(MyCompBase, 'baseVal', 'cool', 'nice');
    var attr = cc.Class.attr(MyCompBase, 'baseVal');
    ok(attr.data && attr.cool, 'can have multi attribute');

    cc.Class.Attr.setClassAttr(MyCompBase, 'baseVal', 'data', false);
    attr = cc.Class.attr(MyCompBase, 'baseVal');
    strictEqual(attr.data, false, 'can change attribute');
});

test('inherit', function () {
    function MyCompBase () { }
    function MyComp1 () { }
    cc.js.extend(MyComp1, MyCompBase);
    function MyComp2 () { }
    cc.js.extend(MyComp2, MyCompBase);

    cc.Class.Attr.setClassAttr(MyCompBase, 'baseVal', 'cool', 'nice');
    strictEqual(cc.Class.attr(MyComp1, 'baseVal').cool, 'nice', 'can get inherited attribute');

    cc.Class.Attr.setClassAttr(MyComp1, 'baseVal', 'cool', 'good');
    strictEqual(cc.Class.attr(MyComp1, 'baseVal').cool, 'good', 'can override inherited attribute');
    strictEqual(cc.Class.attr(MyCompBase, 'baseVal').cool, 'nice', 'Sub prop of base class should not be pulluted!');

    cc.Class.Attr.setClassAttr(MyComp1, 'subVal', 'cool', 'very nice');
    strictEqual(cc.Class.attr(MyComp1, 'subVal').cool, 'very nice', 'can have own attribute');

    strictEqual(cc.Class.attr(MyCompBase, 'subVal').cool, undefined, 'main prop of base class not pulluted');
    strictEqual(cc.Class.attr(MyComp2, 'subVal').cool, undefined, 'sibling class not pulluted');
});

test('dynamic attribute for instance', function () {
    var MyCompBase = function () {};
    var comp = new MyCompBase();

    cc.Class.Attr.setClassAttr(MyCompBase, 'subVal', 'value', false);
    cc.Class.Attr.setClassAttr(comp, 'subVal', 'value', true);
    strictEqual(cc.Class.attr(MyCompBase, 'subVal').value, false, 'class attr should set to false');
    strictEqual(cc.Class.attr(comp, 'subVal').value, true, 'instance attr should set to true');

    cc.Class.Attr.setClassAttr(MyCompBase, 'baseVal', 'value', 123);
    strictEqual(cc.Class.attr(comp, 'baseVal').value, 123, 'instance attr should inherited from base');


    cc.Class.Attr.setClassAttr(MyCompBase, 'readonly', 'a', false);
    cc.Class.Attr.setClassAttr(comp, 'readonly', 'b', true);
    deepEqual(cc.Class.attr(comp, 'readonly'), {a: false, b: true}, 'object attrs should merged');

    cc.Class.Attr.setClassAttr(MyCompBase, 'readonly', 'b', false);
    deepEqual(cc.Class.attr(comp, 'readonly'), {a: false, b: true}, 'instance attr should override base');

    cc.Class.Attr.setClassAttr(MyCompBase, 'readonly', 'b', false);
    deepEqual(cc.Class.attr(MyCompBase, 'readonly'), {a: false, b: false}, 'class attrs should not changed');
});