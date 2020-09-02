/**
 * @hidden
 */

import { removeProperty } from '../core/utils/deprecated';
import Burst from './burst';
import { ccclass } from '../core/data/class-decorator';
import { warnID } from '../core/platform/debug';
import { ParticleSystem } from './particle-system';
import { Billboard } from './billboard';
import { Line } from './line';

removeProperty(Burst.prototype, 'Burst.prototype', [
    {
        'name': 'minCount'
    },
    {
        'name': 'maxCount',
    }
]);

@ccclass('cc.ParticleSystemComponent')
export class ParticleSystemComponent extends ParticleSystem {
    constructor () {
        warnID(5400, 'ParticleSystemComponent', 'ParticleSystem');
        super();
    }
}
@ccclass('cc.BillboardComponent')
export class BillboardComponent extends Billboard {
    constructor () {
        warnID(5400, 'BillboardComponent', 'Billboard');
        super();
    }
}
@ccclass('cc.LineComponent')
export class LineComponent extends Line {
    constructor () {
        warnID(5400, 'LineComponent', 'Line');
        super();
    }
}
