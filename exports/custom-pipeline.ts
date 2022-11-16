import { legacyCC } from '../cocos/core/global-exports';
import * as rendering from '../cocos/rendering/custom';
import { LayoutGraphData } from '../cocos/rendering/custom/layout-graph';

export { rendering };

legacyCC.rendering = rendering;
legacyCC.rendering.defaultLayoutGraph = new LayoutGraphData();
