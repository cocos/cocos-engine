import { instantiate } from "../../cocos/core";
import { CurveRange } from "../../cocos/vfx";

test('Bugfix cocos/3d-tasks#12248; Instantiate a property of fast defined type', () => {
    const curveRange = new CurveRange();
    const curveRange2 = instantiate(curveRange);
    expect(curveRange.spline).not.toBe(curveRange2.spline);
});
