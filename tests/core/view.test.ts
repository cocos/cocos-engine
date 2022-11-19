import { screenAdapter } from 'pal/screen-adapter';
import { Rect, screen, Size, sys, Vec2 } from '../../cocos/core';
import { view, ResolutionPolicy } from '../../cocos/ui/view';

describe('cc.view', () => {
    // init environment
    view.init();
    const ContainerStrategy = ResolutionPolicy.ContainerStrategy;
    const ContentStrategy = ResolutionPolicy.ContentStrategy;
    const tmpVec2 = new Vec2(), tmpX = 10, tmpY = -10;
    // JSDOM uses 1024 * 768 as the window size.
    const windowSize = screenAdapter.windowSize;
    const relatedPos = { left: 0, top: 0, width: windowSize.width, height: windowSize.height };

    test('test window interface', () => {
        // legacy interface
        expect(sys.windowPixelResolution.width).toBe(1024);
        expect(sys.windowPixelResolution.height).toBe(768);
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getDevicePixelRatio()).toBe(1);

        // new interface
        // screen.resolutionScale = 2;
        // expect(screen.resolutionScale).toBe(2);
        // expect(screen.windowSize).toEqual(new Size(1024, 768));
        // expect(screen.resolution).toEqual(new Size(2048, 1536));

        // screen.resolutionScale = 1;
        // expect(screen.resolutionScale).toBe(1);
        expect(screen.windowSize).toEqual(new Size(1024, 768));
        expect(screen.resolution).toEqual(new Size(1024, 768));
    });

    test('test view SHOW_ALL', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.SHOW_ALL)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 80, 1024, 608));
        expect(view.getVisibleSize()).toEqual(new Size(1280, 760));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 608));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(0.8);
        expect(view.getScaleY()).toBe(0.8);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(12.5, -112.5));

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(284, 0, 456, 768));
        expect(view.getVisibleSize()).toEqual(new Size(760, 1280));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(456, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(0.6);
        expect(view.getScaleY()).toBe(0.6);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(-456.667);
        expect(tmpVec2.y).toBeCloseTo(-16.667);
    });

    test('test view FIXED_WIDTH', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.FIXED_WIDTH)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(1280, 960));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(0.8);
        expect(view.getScaleY()).toBe(0.8);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(12.5, -12.5));

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(760, 570));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBeCloseTo(1.347);
        expect(view.getScaleY()).toBeCloseTo(1.347);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(7.422);
        expect(tmpVec2.y).toBeCloseTo(-7.422);
    });

    test('test view FIXED_HEIGHT', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.FIXED_HEIGHT)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize().x).toBeCloseTo(1013.333);
        expect(view.getVisibleSize().y).toBe(760);
        expect(view.getVisibleSizeInPixel().x).toBeCloseTo(1023.999);
        expect(view.getVisibleSizeInPixel().y).toBe(768);
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBeCloseTo(1.011);
        expect(view.getScaleY()).toBeCloseTo(1.011);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(9.896);
        expect(tmpVec2.y).toBeCloseTo(-9.896);

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize().x).toBeCloseTo(1706.667);
        expect(view.getVisibleSize().y).toBe(1280);
        expect(view.getVisibleSizeInPixel().x).toBeCloseTo(1023.999);
        expect(view.getVisibleSizeInPixel().y).toBe(768);
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(0.6);
        expect(view.getScaleY()).toBe(0.6);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(16.667);
        expect(tmpVec2.y).toBeCloseTo(-16.667);
    });

    test('test view NO_BORDER', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.NO_BORDER)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect().x).toBe(-135);
        expect(view.getViewportRect().y).toBe(0);
        expect(view.getViewportRect().width).toBeCloseTo(1293.474);
        expect(view.getViewportRect().height).toBe(768);
        expect(view.getVisibleSize()).toEqual(new Size(1280, 760));
        expect(view.getVisibleSizeInPixel().x).toBeCloseTo(1293.474);
        expect(view.getVisibleSizeInPixel().y).toBe(768);
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBeCloseTo(1.011);
        expect(view.getScaleY()).toBeCloseTo(1.011);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(143.489);
        expect(tmpVec2.y).toBeCloseTo(-9.896);

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect().x).toBe(0);
        expect(view.getViewportRect().y).toBe(-478);
        expect(view.getViewportRect().width).toBe(1024);
        expect(view.getViewportRect().height).toBeCloseTo(1724.632);
        expect(view.getVisibleSize()).toEqual(new Size(760, 1280));
        expect(view.getVisibleSizeInPixel().x).toBe(1024);  
        expect(view.getVisibleSizeInPixel().y).toBeCloseTo(1724.632);  
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBeCloseTo(1.347);
        expect(view.getScaleY()).toBeCloseTo(1.347);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(7.422);
        expect(tmpVec2.y).toBeCloseTo(347.344);
    });

    test('test view EXACT_FIT', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.EXACT_FIT)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(1280, 760));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(0.8);
        expect(view.getScaleY()).toBeCloseTo(1.011);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBe(12.5);
        expect(tmpVec2.y).toBeCloseTo(-9.896);

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(760, 1280));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBeCloseTo(1.347);
        expect(view.getScaleY()).toBe(0.6);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertToUISpace(tmpVec2);
        expect(tmpVec2.x).toBeCloseTo(7.422);
        expect(tmpVec2.y).toBeCloseTo(-16.667);
    });
});
