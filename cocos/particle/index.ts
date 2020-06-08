/**
 * @hidden
 */

import { BillboardComponent } from './billboard-component';
import { LineComponent } from './line-component';
import { ParticleSystemComponent } from './particle-system-component';
import { ParticleUtils } from './particle-utils';
import './deprecated';
import CurveRange from './animator/curve-range';


export {
    BillboardComponent,
    LineComponent,
    ParticleSystemComponent,
    ParticleUtils,
    CurveRange
};

cc.ParticleSystemComponent = ParticleSystemComponent;
cc.BillboardComponent = BillboardComponent;
cc.LineComponent = LineComponent;

cc.ParticleUtils = ParticleUtils;