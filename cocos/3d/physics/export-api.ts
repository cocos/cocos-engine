import { Node } from '../../scene-graph/node';

export interface ICollisionEvent {
    source: Node;
    target: Node;
}

export type CollisionEventType = 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';

export type CollisionCallback = (type: CollisionEventType, event: ICollisionEvent) => void;
