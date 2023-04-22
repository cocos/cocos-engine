import { Vec3Expression } from './vec3';

export abstract class NoiseExpression extends Vec3Expression {
    public samplePosition: Vec3Expression = new BindingVec3Expression();
}
