import { CurveValueAdapter } from '../animation-curve';
import { property, ccclass } from '../../core/data/class-decorator';

@ccclass('cc.ArrayCurveValueAdapter')
export class ArrayCurveValueAdapter extends CurveValueAdapter {
    @property
    index: number = -1;

    @property
    elementAdapter: CurveValueAdapter | null = null;

    constructor() {
        super();
    }

    public forTarget(target: any) {
        if (!Array.isArray(target) ||
            this.index < 0 ||
            this.index >= target.length) {
            throw new Error(`Target array outof bounds.`);
        } else if (this.elementAdapter !== null) {
            return this.elementAdapter.forTarget(target[this.index]);
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
