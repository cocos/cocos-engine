import { BillboardComponent } from './billboard-component';
import { LineComponent } from './line-component';
import { ParticleSystemComponent } from './particle-system-component';
import { ParticleUtils } from './particle-utils';

export {
    BillboardComponent,
    LineComponent,
    ParticleSystemComponent,
    ParticleUtils
};

cc.ParticleSystemComponent = ParticleSystemComponent;
cc.BillboardComponent = BillboardComponent;
cc.LineComponent = LineComponent;

cc.ParticleUtils = ParticleUtils;