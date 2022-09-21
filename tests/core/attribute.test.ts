import { CCClass } from "../../cocos/core/data/class";
import { js } from "../../cocos/core/utils/js";

describe('Attribute', function () {
    test('base', function () {
        class MyCompBase {
            baseVal = [];
        };
    
        CCClass.Attr.setClassAttr(MyCompBase, 'baseVal', 'data', 'waha');
    
        expect(CCClass.attr(MyCompBase, 'baseVal').data).toBe('waha');
    
        CCClass.Attr.setClassAttr(MyCompBase, 'baseVal', 'cool', 'nice');
        let attr = CCClass.attr(MyCompBase, 'baseVal');
        expect(attr.data && attr.cool).toBeTruthy();
    
        CCClass.Attr.setClassAttr(MyCompBase, 'baseVal', 'data', false);
        attr = CCClass.attr(MyCompBase, 'baseVal');
        expect(attr.data).toBeFalsy();
    });
    
    test('inherit', function () {
        function MyCompBase () { }
        function MyComp1 () { }
        js.extend(MyComp1, MyCompBase);
        function MyComp2 () { }
        js.extend(MyComp2, MyCompBase);
    
        CCClass.Attr.setClassAttr(MyCompBase, 'baseVal', 'cool', 'nice');
        expect(CCClass.attr(MyComp1, 'baseVal').cool).toBe('nice');
    
        CCClass.Attr.setClassAttr(MyComp1, 'baseVal', 'cool', 'good');
        expect(CCClass.attr(MyComp1, 'baseVal').cool).toBe('good');
        expect(CCClass.attr(MyCompBase, 'baseVal').cool).toBe('nice');
    
        CCClass.Attr.setClassAttr(MyComp1, 'subVal', 'cool', 'very nice');
        expect(CCClass.attr(MyComp1, 'subVal').cool).toBe('very nice');
    
        expect(CCClass.attr(MyCompBase, 'subVal').cool).toBe(undefined);
        expect(CCClass.attr(MyComp2, 'subVal').cool).toBe(undefined);
    });
    
    test('dynamic attribute for instance', function () {
        class MyCompBase {};
        const comp = new MyCompBase();
    
        CCClass.Attr.setClassAttr(MyCompBase, 'subVal', 'value', false);
        CCClass.Attr.setClassAttr(comp, 'subVal', 'value', true);
        expect(CCClass.attr(MyCompBase, 'subVal').value).toBeFalsy();
        expect(CCClass.attr(comp, 'subVal').value).toBeTruthy();
    
        CCClass.Attr.setClassAttr(MyCompBase, 'baseVal', 'value', 123);
        expect(CCClass.attr(comp, 'baseVal').value).toBe(123);
    
    
        CCClass.Attr.setClassAttr(MyCompBase, 'readonly', 'a', false);
        CCClass.Attr.setClassAttr(comp, 'readonly', 'b', true);
        expect(CCClass.attr(comp, 'readonly')).toMatchObject({a: false, b: true});
    
        CCClass.Attr.setClassAttr(MyCompBase, 'readonly', 'b', false);
        expect(CCClass.attr(comp, 'readonly')).toMatchObject({a: false, b: true});
    
        CCClass.Attr.setClassAttr(MyCompBase, 'readonly', 'b', false);
        expect(CCClass.attr(MyCompBase, 'readonly')).toMatchObject({a: false, b: false});
    });
});
