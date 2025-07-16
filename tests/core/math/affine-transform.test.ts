import { log } from '../../test.log';
import { AffineTransform } from '../../../cocos/core/math/affine-transform';
import { Vec2 } from '../../../cocos/core/math/vec2';
import { Size } from '../../../cocos/core/math/size';
import { Rect } from '../../../cocos/core/math/rect';

// test Vec2
describe('Test AffineTransform', () => {
    test('concat', () => {
        const t1 = new AffineTransform(2, 0, 0, 3, 0, 0);
        const t2 = new AffineTransform(1, 0, 0, 1, 5, 7);
        const t12 = AffineTransform.identity();
        AffineTransform.concat(t12, t1, t2);
        log('concat: ', t12);
        expect(t12.a).toBeCloseTo(2);
        expect(t12.b).toBeCloseTo(0);
        expect(t12.c).toBeCloseTo(0);
        expect(t12.d).toBeCloseTo(3);
        expect(t12.tx).toBeCloseTo(5);
        expect(t12.ty).toBeCloseTo(7);
    });

    test('invert', () => {
        const t1 = new AffineTransform(2, 0, 0, 3, 5, 7);
        const t2 = AffineTransform.identity();
        const t12 = AffineTransform.identity();
        AffineTransform.invert(t2, t1);
        AffineTransform.concat(t12, t1, t2);
        console.log('invert: ', t12);
        expect(t12.a).toBeCloseTo(1);
        expect(t12.b).toBeCloseTo(0);
        expect(t12.c).toBeCloseTo(0);
        expect(t12.d).toBeCloseTo(1);
        expect(t12.tx).toBeCloseTo(0);
        expect(t12.ty).toBeCloseTo(0);
    });

    test('transformVec2', () => {
        const t1 = new AffineTransform(2, 0, 0, 3, 5, 7);
        const v0 = new Vec2(1, 2);
        const expect0 = new Vec2(7, 13);
        AffineTransform.transformVec2(v0, v0, t1);
        log('transformVec2: ', v0);
        expect(Vec2.equals(v0, expect0)).toBe(true);
    });

    test('transformSize', () => {
        const t1 = new AffineTransform(2, 0, 0, 3, 5, 7);
        const s0 = new Size(1, 2);
        const expect0 = new Size(2, 6);
        AffineTransform.transformSize(s0, s0, t1);
        log('transformSize: ', s0);
        expect(Vec2.equals(s0, expect0)).toBe(true);
    });

    test('transformRect', () => {
        const t1 = new AffineTransform(2, 0, 0, 3, 5, 7);
        const r0 = new Rect(1, 2, 3, 4);
        const expect0 = new Rect(7, 13, 6, 12);
        AffineTransform.transformRect(r0, r0, t1);
        log('transformRect: ', r0);
        expect(Vec2.equals(r0, expect0)).toBe(true);
    });

    test('transformObb', () => {
        const t1 = new AffineTransform(2, 0, 0, 3, 5, 7);
        const r0 = new Rect(1, 2, 3, 4);
        const bl = new Vec2();
        const tl = new Vec2();
        const tr = new Vec2();
        const br = new Vec2();
        const expect0 = new Vec2(7, 13);
        const expect1 = new Vec2(7, 25);
        const expect2 = new Vec2(13, 25);
        const expect3 = new Vec2(13, 13);
        AffineTransform.transformObb(bl, tl, tr, br, r0, t1, false);
        log('transformObb 0: ', bl);
        log('transformObb 1: ', tl);
        log('transformObb 2: ', tr);
        log('transformObb 3: ', br);
        expect(Vec2.equals(bl, expect0)).toBe(true);
        expect(Vec2.equals(tl, expect1)).toBe(true);
        expect(Vec2.equals(tr, expect2)).toBe(true);
        expect(Vec2.equals(br, expect3)).toBe(true);
    });
});