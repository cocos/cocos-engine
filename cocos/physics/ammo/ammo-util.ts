import Ammo from './ammo-instantiated';
import { IVec3Like, IQuatLike } from '../../core/math/type-define';

export function cocos2AmmoVec3 (out: Ammo.btVector3, v: IVec3Like): Ammo.btVector3 {
    out.setValue(v.x, v.y, v.z);
    return out;
}

export function ammo2CocosVec3<T extends IVec3Like> (out: T, v: Ammo.btVector3): T {
    out.x = v.x();
    out.y = v.y();
    out.z = v.z();
    return out;
}

export function cocos2AmmoQuat (out: Ammo.btQuaternion, q: IQuatLike): Ammo.btQuaternion {
    out.setValue(q.x, q.y, q.z, q.w);
    return out;
}

export function ammo2CocosQuat<T extends IQuatLike> (out: T, q: Ammo.btQuaternion): T {
    out.x = q.x();
    out.y = q.y();
    out.z = q.z();
    out.w = q.w();
    return out;
}

export function ammoDeletePtr (obj: Ammo.Type, klass: Constructor<Ammo.Type>): void {    
    delete (klass as any).xi[(obj as any).vi];
}
// TODO : Ammo['deletePtr'] = deletePtr;
