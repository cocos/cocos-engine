import { Vec2, IVec2Like, isValid } from "../../cocos/core";
import * as physics2d from "../../exports/physics-2d-framework";

/**
 * This function is used to test physics2d utils
 */
export default function () {
    let inPolygon = [new Vec2(417, -312), new Vec2(600, -312), new Vec2(600, 200), new Vec2(554.25, 208.20101039203263), new Vec2(508.5, 228), new Vec2(462.75, 247.79898960796737), new Vec2(417, 256)];
    let expectationConvexPolygons = [[new Vec2(554.25, 208.20101039203263), new Vec2(462.75, 247.79898960796737), new Vec2(417, 256),new Vec2(417, -312), new Vec2(600, -312)], [new Vec2(554.25, 208.20101039203263), new Vec2(600, -312), new Vec2(600, 200)]];

    let resultConvexPolygons = physics2d.Physics2DUtils.PolygonPartition.ConvexPartition(inPolygon);
    expect(isValid(resultConvexPolygons)).toBe(true);
    expect(ComparePolygonVector(expectationConvexPolygons, resultConvexPolygons!)).toBe(true);
}

function ComparePolygonVector(polygons0:IVec2Like[][], polygons1:IVec2Like[][]) : boolean {
    if (polygons0.length != polygons1.length) {
        return false;
    }

    if (polygons0.length === 0) {
        return true;
    }

    for (let p = 0; p != polygons0.length; p++) {
        if (polygons0[p].length != polygons1[p].length) {
            return false;
        }
        for (let i = 0; i != polygons0[p].length; i++) {
            if (polygons0[p][i] != polygons0[p][i]) {
                return false;
            }
        }
    }

    return true;
}
