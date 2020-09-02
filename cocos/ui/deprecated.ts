/**
 * @category ui
 */

import { warnID } from '../core/platform/debug';
import { ccclass } from '../core/data/class-decorator';
import { Button, EditBox, Layout, Mask, Label, LabelOutline, ProgressBar, RichText, ScrollView, ScrollBar, Slider, Sprite, Toggle, ToggleContainer, UIMeshRenderer, Widget, Graphics, PageView, PageViewIndicator, UIStaticBatch, UIOpacity, SafeArea, UICoordinateTracker } from './components';
import { js } from '../core/utils/js';

/**
 * @deprecated Since v1.2
 */
@ccclass('cc.UIReorderComponent')
export class UIReorderComponent {
    constructor () {
        warnID(1408, 'UIReorderComponent');
    }
}

/**
 * Alias of [[Button]]
 * @deprecated Since v1.2
 */
export { Button as ButtonComponent };
js.setClassAlias(Button, 'cc.ButtonComponent');
/**
 * Alias of [[EditBox]]
 * @deprecated Since v1.2
 */
export { EditBox as EditBoxComponent };
js.setClassAlias(EditBox, 'cc.EditBoxComponent');
/**
 * Alias of [[Layout]]
 * @deprecated Since v1.2
 */
export { Layout as LayoutComponent };
js.setClassAlias(Layout, 'cc.LayoutComponent');
/**
 * Alias of [[Mask]]
 * @deprecated Since v1.2
 */
export { Mask as MaskComponent };
js.setClassAlias(Mask, 'cc.MaskComponent');
/**
 * Alias of [[Label]]
 * @deprecated Since v1.2
 */
export { Label as LabelComponent };
js.setClassAlias(Label, 'cc.LabelComponent');
/**
 * Alias of [[LabelOutline]]
 * @deprecated Since v1.2
 */
export { LabelOutline as LabelOutlineComponent };
js.setClassAlias(LabelOutline, 'cc.LabelOutlineComponent');
/**
 * Alias of [[ProgressBar]]
 * @deprecated Since v1.2
 */
export { ProgressBar as ProgressBarComponent };
js.setClassAlias(ProgressBar, 'cc.ProgressBarComponent');
/**
 * Alias of [[RichText]]
 * @deprecated Since v1.2
 */
export { RichText as RichTextComponent };
js.setClassAlias(RichText, 'cc.RichTextComponent');
/**
 * Alias of [[ScrollView]]
 * @deprecated Since v1.2
 */
export { ScrollView as ScrollViewComponent };
js.setClassAlias(ScrollView, 'cc.ScrollViewComponent');
/**
 * Alias of [[ScrollBar]]
 * @deprecated Since v1.2
 */
export { ScrollBar as ScrollBarComponent };
js.setClassAlias(ScrollBar, 'cc.ScrollBarComponent');
/**
 * Alias of [[Slider]]
 * @deprecated Since v1.2
 */
export { Slider as SliderComponent };
js.setClassAlias(Slider, 'cc.SliderComponent');
/**
 * Alias of [[Sprite]]
 * @deprecated Since v1.2
 */
export { Sprite as SpriteComponent };
js.setClassAlias(Sprite, 'cc.SpriteComponent');
/**
 * Alias of [[Toggle]]
 * @deprecated Since v1.2
 */
export { Toggle as ToggleComponent };
js.setClassAlias(Toggle, 'cc.ToggleComponent');
/**
 * Alias of [[ToggleContainer]]
 * @deprecated Since v1.2
 */
export { ToggleContainer as ToggleContainerComponent };
js.setClassAlias(ToggleContainer, 'cc.ToggleContainerComponent');
/**
 * Alias of [[UIMeshRenderer]]
 * @deprecated Since v1.2
 */
export { UIMeshRenderer as UIModelComponent };
js.setClassAlias(UIMeshRenderer, 'cc.UIModelComponent');
/**
 * Alias of [[Widget]]
 * @deprecated Since v1.2
 */
export { Widget as WidgetComponent };
js.setClassAlias(Widget, 'cc.WidgetComponent');
/**
 * Alias of [[Graphics]]
 * @deprecated Since v1.2
 */
export { Graphics as GraphicsComponent };
js.setClassAlias(Graphics, 'cc.GraphicsComponent');
/**
 * Alias of [[PageView]]
 * @deprecated Since v1.2
 */
export { PageView as PageViewComponent };
js.setClassAlias(PageView, 'cc.PageViewComponent');
/**
 * Alias of [[PageViewIndicator]]
 * @deprecated Since v1.2
 */
export { PageViewIndicator as PageViewIndicatorComponent };
js.setClassAlias(PageViewIndicator, 'cc.PageViewIndicatorComponent');
/**
 * Alias of [[UIStaticBatch]]
 * @deprecated Since v1.2
 */
export { UIStaticBatch as UIStaticBatchComponent };
js.setClassAlias(UIStaticBatch, 'cc.UIStaticBatchComponent');
/**
 * Alias of [[UIOpacity]]
 * @deprecated Since v1.2
 */
export { UIOpacity as UIOpacityComponent };
js.setClassAlias(UIOpacity, 'cc.UIOpacityComponent');
/**
 * Alias of [[SafeArea]]
 * @deprecated Since v1.2
 */
export { SafeArea as SafeAreaComponent };
js.setClassAlias(SafeArea, 'cc.SafeAreaComponent');
/**
 * Alias of [[UICoordinateTracker]]
 * @deprecated Since v1.2
 */
export { UICoordinateTracker as UICoordinateTrackerComponent };
js.setClassAlias(UICoordinateTracker, 'cc.UICoordinateTrackerComponent');
