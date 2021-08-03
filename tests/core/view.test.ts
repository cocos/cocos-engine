import { screenAdapter } from 'pal/screen-adapter';
import { Rect, Size, Vec2 } from '../../cocos/core';
import { view, ResolutionPolicy } from '../../cocos/core/platform/view';

describe('cc.view', () => {
    // init environment
    view.init();
    const ContainerStrategy = ResolutionPolicy.ContainerStrategy;
    const ContentStrategy = ResolutionPolicy.ContentStrategy;
    const tmpVec2 = new Vec2(), tmpX = 10, tmpY = -10;
    // JSDOM uses 1024 * 768 as the window size.
    const windowSize = screenAdapter.windowSize;
    const relatedPos = { left: 0, top: 0, width: windowSize.width, height: windowSize.height };

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
        view._convertPointWithScale(tmpVec2);
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
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(-456.6666564941406, -16.66666603088379));
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
        view._convertPointWithScale(tmpVec2);
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
        expect(view.getScaleX()).toBe(1.3473684210526315);
        expect(view.getScaleY()).toBe(1.3473684210526315);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(7.421875, -7.421875));
    });

    test('test view FIXED_HEIGHT', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.FIXED_HEIGHT)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(1013.3333129882812, 760));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1023.9999794407895, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(1.0105263157894737);
        expect(view.getScaleY()).toBe(1.0105263157894737);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(9.895833015441895, -9.895833015441895));

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(1706.6666259765625, 1280));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1023.9999755859375, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(0.6);
        expect(view.getScaleY()).toBe(0.6);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(16.66666603088379, -16.66666603088379));
    });

    test('test view NO_BORDER', () => {
        const resolutionPolicy = new ResolutionPolicy(ContainerStrategy.EQUAL_TO_FRAME, ContentStrategy.NO_BORDER)
        view.setDesignResolutionSize(1280, 760, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(1280, 760));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(-135, 0, 1293.4736328125, 768));
        expect(view.getVisibleSize()).toEqual(new Size(1280, 760));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1293.4736842105262, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(1.0105263157894737);
        expect(view.getScaleY()).toBe(1.0105263157894737);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(143.4895782470703, -9.895833015441895));

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, -478, 1024, 1724.631591796875));
        expect(view.getVisibleSize()).toEqual(new Size(760, 1280));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 1724.6315789473683));  
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(1.3473684210526315);
        expect(view.getScaleY()).toBe(1.3473684210526315);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(7.421875, 347.34375));
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
        expect(view.getScaleY()).toBe(1.0105263157894737);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(12.5, -9.895833015441895));

        view.setDesignResolutionSize(760, 1280, resolutionPolicy);
        expect(view.getDesignResolutionSize()).toEqual(new Size(760, 1280));
        expect(view.getCanvasSize()).toEqual(new Size(1024, 768));
        expect(view.getFrameSize()).toEqual(new Size(1024, 768));
        expect(view.getViewportRect()).toEqual(new Rect(0, 0, 1024, 768));
        expect(view.getVisibleSize()).toEqual(new Size(760, 1280));
        expect(view.getVisibleSizeInPixel()).toEqual(new Size(1024, 768));
        expect(view.getVisibleOrigin()).toEqual(new Vec2(0, 0));
        expect(view.getVisibleOriginInPixel()).toEqual(new Vec2(0, 0));
        expect(view.getScaleX()).toBe(1.3473684210526315);
        expect(view.getScaleY()).toBe(0.6);
        view.convertToLocationInView(tmpX, tmpY, relatedPos, tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(10, 778));
        tmpVec2.x = tmpX; tmpVec2.y = tmpY;
        // @ts-expect-error private method
        view._convertPointWithScale(tmpVec2);
        expect(tmpVec2).toEqual(new Vec2(7.421875, -16.66666603088379));
    });
});
