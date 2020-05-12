/**
 * @hidden
 */

import { BillboardComponent } from './billboard-component';
import { LineComponent } from './line-component';
import { ParticleSystemComponent } from './particle-system-component';
import { ParticleUtils } from './particle-utils';
import './deprecated';
import { legacyGlobalExports } from '../core/global-exports';

export {
    BillboardComponent,
    LineComponent,
    ParticleSystemComponent,
    ParticleUtils
};

legacyGlobalExports.ParticleSystemComponent = ParticleSystemComponent;
legacyGlobalExports.BillboardComponent = BillboardComponent;
legacyGlobalExports.LineComponent = LineComponent;

legacyGlobalExports.ParticleUtils = ParticleUtils;