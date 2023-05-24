import { instantiate } from "../../cocos/serialization";
import { CurveRange } from "../../cocos/particle";
import { Mode } from "../../cocos/particle/animator/curve-range";

test('Bugfix cocos/3d-tasks#12248; Instantiate a property of fast defined type', () => {
    const curveRange = new CurveRange();
    curveRange.mode = Mode.Curve;
    const curveRange2 = instantiate(curveRange);
    expect(curveRange.spline).not.toBe(curveRange2.spline);
    expect(curveRange.curve._internalCurve).not.toBe(curveRange2.curve._internalCurve);
});
