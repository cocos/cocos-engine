import { CurveValueAdapter } from '../animation-curve';
import { property, ccclass } from '../../core/data/class-decorator';

@ccclass('cc.ArrayCurveValueAdapter')
export class ArrayCurveValueAdapter extends CurveValueAdapter {
    @property
    index: number = -1;

    @property
    elementAdapater: CurveValueAdapter | null = null;

    constructor() {
        super();
    }

    public forTarget(target: any) {
        if (!Array.isArray(target) ||
            this.index < 0 ||
            this.index >= target.length) {
            return super.forTarget(target);
        } else if (this.elementAdapater !== null) {
            return this.elementAdapater.forTarget(target[this.index]);
        } else {
            return {
                set: (value: any) => {
                    target[this.index] = value; 
                },
            };
        }
    }
}

cc.ArrayCurveValueAdapter = ArrayCurveValueAdapter;
