/**
 * @packageDocumentation
 * @module gfx
 */

import { polyfillCC } from './polyfill-legacy-cc';
import { legacyCC } from '../global-exports';
import './deprecated-3.0.0';

export * from './descriptor-set';
export * from './buffer';
export * from './command-buffer';
export * from './define';
export * from './define-class';
export * from './device';
export * from './framebuffer';
export * from './input-assembler';
export * from './descriptor-set-layout';
export * from './pipeline-layout';
export * from './pipeline-state';
export * from './fence';
export * from './queue';
export * from './render-pass';
export * from './sampler';
export * from './shader';
export * from './texture';

legacyCC.gfx = polyfillCC;
