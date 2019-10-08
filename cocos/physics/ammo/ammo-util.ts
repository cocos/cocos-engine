import Ammo from 'ammo.js';
import { Vec3, Quat } from "../../core";

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

export function Cocos2AmmoQuat (out: Ammo.btQuaternion, q: Quat): Ammo.btQuaternion {
    out.setX(q.x);
    out.setY(q.x);
    out.setZ(q.x);
    out.setW(q.x);
    return out;
}

export function Ammo2CocosQuat (out: Quat, q: Ammo.btQuaternion): Quat {
    out.x = q.x();
    out.y = q.y();
    out.z = q.z();
    out.w = q.w();
    return out;
}