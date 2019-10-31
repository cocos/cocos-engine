import { IVec3Like } from '../../core/math/type-define';

interface IShape extends ILifecycle {
    // material: 
    isTrigger: boolean;
    center: IVec3Like;
}


interface IBoxShape extends IShape {
    size: IVec3Like;
}

interface ISphereShape extends IShape {
    radius: number;
}

