/**
 * @packageDocumentation
 * @hidden
 */

import { Billboard } from './billboard';
import { Line } from './line';
import { ParticleSystem } from './particle-system';
import { ParticleUtils } from './particle-utils';
import CurveRange from './animator/curve-range';
import { legacyCC } from '../core/global-exports';
import { ParticleSystem2D } from './2d/particle-system-2d';
import { MotionStreak } from './2d/motion-streak-2d';
import { MotionStreakAssemblerManager } from './2d/motion-streak-2d-assembler';
import { ParticleSystem2DAssembler } from './2d/particle-system-2d-assembler';

export {
    Billboard,
    Line,
    ParticleSystem,
    ParticleUtils,
    CurveRange,
    ParticleSystem2D,
    MotionStreak,
    MotionStreakAssemblerManager,
    ParticleSystem2DAssembler,
};

export * from './deprecated';

legacyCC.ParticleUtils = ParticleUtils;
