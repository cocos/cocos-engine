import Ammo from 'ammo.js';
import { Vec3 } from "../../core";

export function Cocos2AmmoVec3 (out: Ammo.btVector3, v: Vec3): Ammo.btVector3 {
    out.setX(v.x);
    out.setY(v.y);
    out.setZ(v.z);
    return out;
}

export function Ammo2CocosVec3 (out: Vec3, v: Ammo.btVector3): Vec3 {
    out.x = v.x();
    out.y = v.y();
    out.z = v.z();
    return out;
}