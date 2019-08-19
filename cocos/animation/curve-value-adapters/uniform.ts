/**
 * @hidden
 */

import { CurveValueAdapter } from '../animation-curve';
import { Material } from '../../core/assets/material';
import { property, ccclass } from '../../core/data/class-decorator';

@ccclass('cc.UniformCurveValueAdapter')
export class UniformCurveValueAdapter extends CurveValueAdapter {
    @property
    passIndex: number = 0;

    @property
    uniformName: string = '';

    constructor() {
        super();
    }

    public forTarget(target: Material) {
        const pass = target.passes[this.passIndex];
        const uniformHandle = pass.getHandle(this.uniformName);
        if (uniformHandle === undefined) {
            throw new Error(`Material "${target.name}" has no uniform "${this.uniformName}"`);
        }
        return {
            set: (value: any) => {
                pass.setUniform(uniformHandle, value);
            },
        };
    }
}

cc.UniformCurveValueAdapter = UniformCurveValueAdapter;
