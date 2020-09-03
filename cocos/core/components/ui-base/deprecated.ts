/**
 * @category ui
 */

import { removeProperty } from '../../utils';
import { UIComponent } from './ui-component';
import { UITransform } from './ui-transform';
import { UIRenderable } from './ui-renderable';
import { Canvas } from './canvas';
import { js } from '../../utils/js';
import { legacyCC } from '../../global-exports';

removeProperty(UIComponent.prototype, 'UIComponent',[
    {
        name: '_visibility',
    },
    {
        name: 'setVisibility',
    },
]);

/**
 * Alias of [[UITransform]]
 * @deprecated Since v1.2
 */
export { UITransform as UITransformComponent };
legacyCC.UITransformComponent = UITransform;
js.setClassAlias(UITransform, 'cc.UITransformComponent');

/**
 * Alias of [[UIRenderable]]
 * @deprecated Since v1.2
 */
export { UIRenderable as RenderComponent };
js.setClassAlias(UIRenderable, 'cc.RenderComponent');

/**
 * Alias of [[Canvas]]
 * @deprecated Since v1.2
 */
export { Canvas as CanvasComponent };
legacyCC.CanvasComponent = Canvas;
js.setClassAlias(Canvas, 'cc.CanvasComponent');
