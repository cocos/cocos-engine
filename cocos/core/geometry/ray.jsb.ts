import { legacyCC } from "../global-exports";
import { Vec3 } from "../math";
import { IVec3Like } from '../math/type-define';

declare const ns: any;

export const Ray = ns.Ray;
// @ts-ignore
export type Ray = ns.Ray;
legacyCC.Ray = Ray;

Ray.prototype.computeHit = function (out: IVec3Like, distance: number) {
    Vec3.normalize(out, this.d);
    Vec3.scaleAndAdd(out, this.o, out, distance);
}
