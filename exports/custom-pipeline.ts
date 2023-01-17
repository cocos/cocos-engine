import { legacyCC } from '../cocos/core/global-exports';
import * as rendering from '../cocos/rendering/custom';
import { macro } from './base';

export { rendering };

if (macro.CUSTOM_PIPELINE_NAME !== '') {
    legacyCC.rendering = rendering;
}
