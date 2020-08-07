import { UIRenderable } from '../core/components/ui-base/ui-renderable';
import { warnID } from '../core';

export class RenderComponent extends UIRenderable {
    constructor () {
        super();
        warnID(5400, 'RenderComponent', 'UIRenderable');
    }
}
