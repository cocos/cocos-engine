/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import './deprecated-1.2.0';
import { UICoordinateTracker } from './ui-coordinate-tracker';
import { BlockInputEvents } from './block-input-events';
import { Button } from './button';
import { EditBox } from './editbox/edit-box';
import { Layout } from './layout';
import { ProgressBar } from './progress-bar';
import { ScrollView } from './scroll-view';
import { ScrollBar } from './scroll-bar';
import { Slider } from './slider';
import { Toggle } from './toggle';
import { ToggleContainer } from './toggle-container';
import { Widget } from './widget';
import { PageView } from './page-view';
import { PageViewIndicator } from './page-view-indicator';
import { SafeArea } from './safe-area';
import { warnID } from '../core/platform/debug';
import { ccclass } from '../core/data/class-decorator';
import { js, removeProperty, markAsWarning } from '../core';
import { legacyCC } from '../core/global-exports';
import { View } from './view';

/**
 * @deprecated Since v1.2
 */
@ccclass('cc.UIReorderComponent')
export class UIReorderComponent {
    constructor () {
        warnID(1408, 'UIReorderComponent');
    }
}
legacyCC.UIReorderComponent = UIReorderComponent;

/**
 * Alias of [[Button]]
 * @deprecated Since v1.2
 */
export { Button as ButtonComponent };
legacyCC.ButtonComponent = Button;
js.setClassAlias(Button, 'cc.ButtonComponent');
/**
 * Alias of [[EditBox]]
 * @deprecated Since v1.2
 */
export { EditBox as EditBoxComponent };
legacyCC.EditBoxComponent = EditBox;
js.setClassAlias(EditBox, 'cc.EditBoxComponent');
/**
 * Alias of [[Layout]]
 * @deprecated Since v1.2
 */
export { Layout as LayoutComponent };
legacyCC.LayoutComponent = Layout;
js.setClassAlias(Layout, 'cc.LayoutComponent');
/**
 * Alias of [[ProgressBar]]
 * @deprecated Since v1.2
 */
export { ProgressBar as ProgressBarComponent };
legacyCC.ProgressBarComponent = ProgressBar;
js.setClassAlias(ProgressBar, 'cc.ProgressBarComponent');
/**
 * Alias of [[ScrollView]]
 * @deprecated Since v1.2
 */
export { ScrollView as ScrollViewComponent };
legacyCC.ScrollViewComponent = ScrollView;
js.setClassAlias(ScrollView, 'cc.ScrollViewComponent');
/**
 * Alias of [[ScrollBar]]
 * @deprecated Since v1.2
 */
export { ScrollBar as ScrollBarComponent };
legacyCC.ScrollBarComponent = ScrollBar;
js.setClassAlias(ScrollBar, 'cc.ScrollBarComponent');
/**
 * Alias of [[Slider]]
 * @deprecated Since v1.2
 */
export { Slider as SliderComponent };
legacyCC.SliderComponent = Slider;
js.setClassAlias(Slider, 'cc.SliderComponent');
/**
 * Alias of [[Toggle]]
 * @deprecated Since v1.2
 */
export { Toggle as ToggleComponent };
legacyCC.ToggleComponent = Toggle;
js.setClassAlias(Toggle, 'cc.ToggleComponent');
/**
 * Alias of [[ToggleContainer]]
 * @deprecated Since v1.2
 */
export { ToggleContainer as ToggleContainerComponent };
legacyCC.ToggleContainerComponent = ToggleContainer;
js.setClassAlias(ToggleContainer, 'cc.ToggleContainerComponent');
/**
 * Alias of [[Widget]]
 * @deprecated Since v1.2
 */
export { Widget as WidgetComponent };
legacyCC.WidgetComponent = Widget;
js.setClassAlias(Widget, 'cc.WidgetComponent');
/**
 * Alias of [[PageView]]
 * @deprecated Since v1.2
 */
export { PageView as PageViewComponent };
legacyCC.PageViewComponent = PageView;
js.setClassAlias(PageView, 'cc.PageViewComponent');
/**
 * Alias of [[PageViewIndicator]]
 * @deprecated Since v1.2
 */
export { PageViewIndicator as PageViewIndicatorComponent };
legacyCC.PageViewIndicatorComponent = PageViewIndicator;
js.setClassAlias(PageViewIndicator, 'cc.PageViewIndicatorComponent');
/**
 * Alias of [[SafeArea]]
 * @deprecated Since v1.2
 */
export { SafeArea as SafeAreaComponent };
legacyCC.SafeAreaComponent = SafeArea;
js.setClassAlias(SafeArea, 'cc.SafeAreaComponent');
/**
 * Alias of [[UICoordinateTracker]]
 * @deprecated Since v1.2
 */
export { UICoordinateTracker as UICoordinateTrackerComponent };
js.setClassAlias(UICoordinateTracker, 'cc.UICoordinateTrackerComponent');
/**
 * Alias of [[BlockInputEvents]]
 * @deprecated Since v1.2
 */
export { BlockInputEvents as BlockInputEventsComponent };
legacyCC.BlockInputEventsComponent = BlockInputEvents;
js.setClassAlias(BlockInputEvents, 'cc.BlockInputEventsComponent');

// #region deprecation on view
removeProperty(View.prototype, 'View.prototype', [
    {
        name: 'isAntiAliasEnabled',
        suggest: 'The API of Texture2d have been largely modified, no alternative',
    },
    {
        name: 'enableAntiAlias',
        suggest: 'The API of Texture2d have been largely modified, no alternative',
    },
]);
markAsWarning(View.prototype, 'View.prototype', [
    {
        name: 'adjustViewportMeta',
    },
    {
        name: 'enableAutoFullScreen',
        suggest: 'use screen.requestFullScreen() instead.',
    },
    {
        name: 'isAutoFullScreenEnabled',
    },
    {
        name: 'setCanvasSize',
        suggest: 'setting size in CSS pixels is not recommended, please use screen.windowSize instead.',
    },
    {
        name: 'getCanvasSize',
        suggest: 'please use screen.windowSize instead.',
    },
    {
        name: 'getFrameSize',
        suggest: 'getting size in CSS pixels is not recommended, please use screen.windowSize instead.',
    },
    {
        name: 'setFrameSize',
        suggest: 'setting size in CSS pixels is not recommended, please use screen.windowSize instead.',
    },
    {
        name: 'getDevicePixelRatio',
        suggest: 'use screen.devicePixelRatio instead.',
    },
    {
        name: 'convertToLocationInView',
    },
    {
        name: 'enableRetina',
    },
    {
        name: 'isRetinaEnabled',
    },
    {
        name: 'setRealPixelResolution',
    },
]);
