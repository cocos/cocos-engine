import { legacyCC } from '../cocos/core/global-exports';
import { macro } from '../cocos/core/platform';
import * as rendering from '../cocos/rendering/custom';
import * as postProcess from '../cocos/rendering/post-process';

export { rendering };
export { postProcess };

macro.CUSTOM_PIPELINE_NAME = 'Forward';

legacyCC.rendering = rendering;
