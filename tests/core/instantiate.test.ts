import { instantiate } from "../../cocos/serialization";
import { CurveRange } from "../../cocos/particle";

test('Bugfix cocos/3d-tasks#12248; Instantiate a property of fast defined type', () => {
    const curveRange = new CurveRange();
    const curveRange2 = instantiate(curveRange);
    expect(curveRange.spline).not.toBe(curveRange2.spline);
    expect(curveRange.curve._internalCurve).not.toBe(curveRange2.curve._internalCurve);
});
