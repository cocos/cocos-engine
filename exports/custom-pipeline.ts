import { EDITOR } from 'internal:constants';
import { legacyCC } from '../cocos/core/global-exports';
import * as rendering from '../cocos/rendering/custom';

export { rendering };

if (!EDITOR) {
    legacyCC.rendering = rendering;
}
