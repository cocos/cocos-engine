import { EDITOR } from 'internal:constants';
import { editorExtrasTag } from '../../data';

import { debug } from '../../platform/debug';
import { AnimationBlend } from './animation-blend';
import { ClipMotion } from './clip-motion';

export const RUNTIME_ID_ENABLED = EDITOR;

export type RuntimeID = number;

export function getMotionRuntimeID (motion: ClipMotion | AnimationBlend) {
    return (motion[editorExtrasTag] as undefined | { id?: RuntimeID })?.id;
}

export const GRAPH_DEBUG_ENABLED = false;

export const graphDebug = GRAPH_DEBUG_ENABLED
    ? debug
    : EMPTY as typeof debug;

export const graphDebugGroup = GRAPH_DEBUG_ENABLED
    ? console.group
    : EMPTY as typeof debug;

export const graphDebugGroupEnd = GRAPH_DEBUG_ENABLED
    ? console.groupEnd
    : EMPTY as typeof debug;

function EMPTY (...args: unknown[]) { }

const weightsStats: [string, number][] = [];

export function pushWeight (name: string, weight: number) {
    weightsStats.push([name, weight]);
}

export function getWeightsStats () {
    return `[${weightsStats.map(([name, weight]) => `[${name}: ${weight}]`).join('  ')}]`;
}

export function clearWeightsStats () {
    weightsStats.length = 0;
}
