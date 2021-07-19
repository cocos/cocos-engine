
import { deserializeTag, SerializationInput, SerializationOutput, serializeTag } from '../../cocos/core';
import type { RealCurve } from '../../cocos/core/curves/curve';
import type { QuaternionCurve } from '../../cocos/core/curves/quat-curve';

export function serializeAndDeserialize<T extends RealCurve | QuaternionCurve> (curve: T, CurveConstructor: new () => T) {
    class CurveOutput implements SerializationOutput, SerializationInput {
        public readProperty(name: string): unknown {
            return this._properties[name];
        }

        public writeProperty (name: string, value: unknown) {
            this._properties[name] = value;
        }

        public readThis(): void {
            throw new Error('Method not implemented.');
        }

        public readSuper(): void {
            throw new Error('Method not implemented.');
        }

        public writeThis(): void {
            throw new Error('Method not implemented.');
        }

        public writeSuper(): void {
            throw new Error('Method not implemented.');
        }

        private _properties: Record<string, unknown> = {};
    }
    const curveOutput = new CurveOutput();
    curve[serializeTag](curveOutput, { root: curve, toCCON: true, customArguments: {} });
    const newCurve = new CurveConstructor();
    newCurve[deserializeTag](curveOutput, { fromCCON: true });
    return newCurve;
}
