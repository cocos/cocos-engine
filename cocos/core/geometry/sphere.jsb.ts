import { legacyCC } from "../global-exports";
import { Vec3 } from "../math";

declare const ns: any;

export const Sphere = ns.Sphere;
// @ts-ignore
export type Sphere = ns.Sphere;
legacyCC.Sphere = Sphere;

Sphere.prototype.getBoundary = function (minPos: Vec3, maxPos: Vec3) {
    Vec3.set(minPos, this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
    Vec3.set(maxPos, this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
}
