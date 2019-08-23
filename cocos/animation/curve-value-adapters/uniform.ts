import { CurveValueAdapter } from '../animation-curve';
import { Material } from '../../3d';
import { property, ccclass } from '../../core/data/class-decorator';

@ccclass('cc.UniformCurveValueAdapter')
export class UniformCurveValueAdapter implements CurveValueAdapter {
    @property
    public passIndex: number = 0;

    @property
    public uniformName: string = '';

    public forTarget (target: Material) {
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

    public equals (other: this) {
        return this.passIndex === other.passIndex &&
            this.uniformName === other.uniformName;
    }

    public toString () {
        return `${this.uniformName}(Pass ${this.passIndex})`;
    }
}

cc.UniformCurveValueAdapter = UniformCurveValueAdapter;
