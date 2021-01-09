import { IVec2Like, Rect, Vec2 } from '../../core';
import { ERaycast2DType, RaycastResult2D, Collider2D } from '../framework';

export interface IPhysicsWorld {
    readonly impl: any;
    debugDrawFlags: number;
    setGravity: (v: IVec2Like) => void;
    setAllowSleep: (v: boolean) => void;
    // setDefaultMaterial: (v: PhysicMaterial) => void;
    step (deltaTime: number, velocityIterations?: number, positionIterations?: number): void;
    syncPhysicsToScene (): void;
    syncSceneToPhysics (): void;
    raycast (p1: IVec2Like, p2: IVec2Like, type: ERaycast2DType, mask: number): RaycastResult2D[];
    testPoint (p: Vec2): readonly Collider2D[];
    testAABB (rect: Rect): readonly Collider2D[];
    drawDebug (): void;
}
