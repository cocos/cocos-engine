import { js } from "../../cocos/core";

test('test', function() {
    const Asset = function () {};
    js.setClassName('Asset', Asset);

    const MyAsset = (function () {
        var _super = Asset;

        function MyAsset () {
            _super.call(this);
        }
        js.extend(MyAsset, _super);
        js.setClassName('Foo', MyAsset);

        return MyAsset;
    })();
    const myAsset = new MyAsset();

    expect(js.getClassName(myAsset)).toBe('Foo');

    delete MyAsset.prototype.__classname__;  // hack, remove class name
    expect(js.getClassName(myAsset)).toBeTruthy();
    // (constructor's name may renamed by uglify, so we do not test the value exactly)

    var asset = new Asset();
    expect(js.getClassName(myAsset)).not.toBe(js.getClassName(asset));

    js.unregisterClass(Asset, MyAsset);

    expect(js.getClassName(function () {})).toBe('');
});

test('formatStr', function() {
    var a = '0';
    var b = 1;
    var SEP = ' ';
    expect(js.formatStr("a: %s, b: %d", a, b)).toBe('a: 0, b: 1');
    expect(js.formatStr('a:', null)).toBe('a:' + SEP + 'null');
    expect(js.formatStr("a: %s, b: ", a, b)).toBe('a: 0, b: ' + SEP + '1');
    expect(js.formatStr(null)).toBe('null');
});