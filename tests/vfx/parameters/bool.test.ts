import { VFXParameterType } from "../../../cocos/vfx/define";
import { BoolArrayParameter } from "../../../cocos/vfx/parameters/bool";

describe('BoolArrayParameter', () => {
    const boolParameter = new BoolArrayParameter();
    test('basic', () => {
        expect(boolParameter.type).toBe(VFXParameterType.BOOL);
        expect(boolParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(boolParameter.capacity).toBe(16);
        expect(boolParameter.data).toBeTruthy();
        expect(boolParameter.data.length).toBe(16 * boolParameter.stride);
        boolParameter.reserve(32);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32 * boolParameter.stride);
        boolParameter.reserve(16);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32 * boolParameter.stride);
    });
});