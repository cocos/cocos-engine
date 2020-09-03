/**
 * @category particle
 */

import { removeProperty } from '../core/utils/deprecated';
import Burst from './burst';
import { ParticleSystem } from './particle-system';
import { Billboard } from './billboard';
import { Line } from './line';
import { js } from '../core/utils/js';

removeProperty(Burst.prototype, 'Burst.prototype', [
    {
        'name': 'minCount'
    },
    {
        'name': 'maxCount',
    }
]);

/**
 * Alias of [[ParticleSystem]]
 * @deprecated Since v1.2
 */
export { ParticleSystem as ParticleSystemComponent };
js.setClassAlias(ParticleSystem, 'cc.ParticleSystemComponent');
/**
 * Alias of [[Billboard]]
 * @deprecated Since v1.2
 */
export { Billboard as BillboardComponent };
js.setClassAlias(Billboard, 'cc.BillboardComponent');
/**
 * Alias of [[Line]]
 * @deprecated Since v1.2
 */
export { Line as LineComponent };
js.setClassAlias(Line, 'cc.LineComponent');
