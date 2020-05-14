/**
 * @hidden
 */

import { BillboardComponent } from './billboard-component';
import { LineComponent } from './line-component';
import { ParticleSystemComponent } from './particle-system-component';
import { ParticleUtils } from './particle-utils';
import './deprecated';
import { legacyCC } from '../core/global-exports';

export {
    BillboardComponent,
    LineComponent,
    ParticleSystemComponent,
    ParticleUtils
};

legacyCC.ParticleSystemComponent = ParticleSystemComponent;
legacyCC.BillboardComponent = BillboardComponent;
legacyCC.LineComponent = LineComponent;

legacyCC.ParticleUtils = ParticleUtils;