import { color4, pseudoRandom } from '../../../../core/vmath';
import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';

const COLOR_OVERTIME_RAND_OFFSET = 91041;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule {

    @property
    enable = false;

    @property({ type: cc.Color })
    color = null;

    animate(particle) {
        if (this.enable) {
            color4.multiply(particle.color, particle.startColor01, this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
        }
    }
}

// CCClass.fastDefine('cc.ColorOvertimeModule', ColorOvertimeModule, {
//     enable: false,
//     color: null
// });
