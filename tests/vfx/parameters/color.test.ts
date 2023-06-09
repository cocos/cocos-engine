import { VFXValueType } from "../../../cocos/vfx/define";
import { ColorArrayParameter } from "../../../cocos/vfx/parameters/color";

describe('ColorArrayParameter', () => {
    const colorParameter = new ColorArrayParameter();
    test('basic', () => {
        expect(colorParameter.type).toBe(VFXValueType.COLOR);
        expect(colorParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(colorParameter.capacity).toBe(16);
        expect(colorParameter.data).toBeTruthy();
        expect(colorParameter.data.length).toBe(16 * colorParameter.stride);
        colorParameter.reserve(32);
        expect(colorParameter.capacity).toBe(32);
        expect(colorParameter.data.length).toBe(32 * colorParameter.stride);
        colorParameter.reserve(16);
        expect(colorParameter.capacity).toBe(32);
        expect(colorParameter.data.length).toBe(32 * colorParameter.stride);
    });
});