import { deviceManager, RenderType } from "../../../cocos/gfx"

test('determineRenderType', () => {
    // @ts-expect-error
    let renderType = deviceManager._determineRenderType(-1);
    expect(renderType).toBe(RenderType.WEBGL);
    // @ts-expect-error
    renderType = deviceManager._determineRenderType(0);
    expect(renderType).toBe(RenderType.WEBGL);
    // @ts-expect-error
    renderType = deviceManager._determineRenderType(1);
    expect(renderType).toBe(RenderType.CANVAS);
    // @ts-expect-error
    renderType = deviceManager._determineRenderType(2);
    expect(renderType).toBe(RenderType.WEBGL);
    // @ts-expect-error
    renderType = deviceManager._determineRenderType(3);
    expect(renderType).toBe(RenderType.HEADLESS);
    // @ts-expect-error
    renderType = deviceManager._determineRenderType(4);
    expect(renderType).toBe(RenderType.WEBGL);
})