import { ILifecycle } from './ILifecycle'
import { IVec3Like } from '../../core/math/type-define';

export interface IBaseShape extends ILifecycle {
    material: any;
    isTrigger: boolean;
    center: IVec3Like;
}


export interface IBoxShape extends IBaseShape {
    size: IVec3Like;
}

export interface ISphereShape extends IBaseShape {
    radius: number;
}

