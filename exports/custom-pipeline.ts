import { legacyCC } from '../cocos/core/global-exports';
import * as rendering from '../cocos/rendering/custom';

export { rendering };

export * from '../cocos/rendering/post-process';

legacyCC.rendering = rendering;
