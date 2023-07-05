import { VFXValueType } from "../../../cocos/vfx/define";
import { Uint32ArrayParameter } from "../../../cocos/vfx/parameters/uint32";

describe('Uint32ArrayParameter', () => {
    const uint32Parameter = new Uint32ArrayParameter();
    test('basic', () => {
        expect(uint32Parameter.type).toBe(VFXValueType.UINT32);
        expect(uint32Parameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(uint32Parameter.capacity).toBe(16);
        expect(uint32Parameter.data).toBeTruthy();
        expect(uint32Parameter.data.length).toBe(16 * uint32Parameter.stride);
        uint32Parameter.reserve(32);
        expect(uint32Parameter.capacity).toBe(32);
        expect(uint32Parameter.data.length).toBe(32 * uint32Parameter.stride);
        uint32Parameter.reserve(16);
        expect(uint32Parameter.capacity).toBe(32);
        expect(uint32Parameter.data.length).toBe(32 * uint32Parameter.stride);
    });
});