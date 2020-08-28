/**
 * @hidden
 */

import { Billboard } from './billboard-component';
import { Line } from './line-component';
import { ParticleSystem } from './particle-system-component';
import { ParticleUtils } from './particle-utils';
import './deprecated';
import CurveRange from './animator/curve-range';
import { legacyCC } from '../core/global-exports';

export {
    Billboard,
    Line,
    ParticleSystem,
    ParticleUtils,
    CurveRange
};

legacyCC.ParticleSystem = ParticleSystem;
legacyCC.Billboard = Billboard;
legacyCC.Line = Line;

legacyCC.ParticleUtils = ParticleUtils;
