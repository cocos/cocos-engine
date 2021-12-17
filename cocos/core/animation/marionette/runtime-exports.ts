import './animation-graph';
import './clip-motion';
import './animation-blend-1d';
import './animation-blend-2d';
import './animation-blend-direct';

import type { MotionStateStatus } from './animation-controller';

export type { AnimationGraphRunTime } from './animation-graph';
export { AnimationController } from './animation-controller';
export type { ClipStatus, TransitionStatus, MotionStateStatus } from './animation-controller';
export { VariableType } from './parametric';
export { StateMachineComponent } from './state-machine-component';

/**
 * @deprecated Since v3.4-preview-2. Use `MotionStateStatus` instead.
 */
export type StateStatus = MotionStateStatus;
