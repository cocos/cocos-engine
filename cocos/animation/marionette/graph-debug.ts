import { EDITOR } from 'internal:constants';
import { editorExtrasTag } from '../../core';

import { AnimationBlend } from './animation-blend';
import { ClipMotion } from './clip-motion';

export const RUNTIME_ID_ENABLED = EDITOR;

export type RuntimeID = number;

export function getMotionRuntimeID (motion: ClipMotion | AnimationBlend) {
    return (motion[editorExtrasTag] as undefined | { id?: RuntimeID })?.id;
}

export const GRAPH_DEBUG_ENABLED = false;
