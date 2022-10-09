import { legacyCC } from '../cocos/core/global-exports';
import * as rendering from '../cocos/rendering/custom';

legacyCC.rendering = rendering;
legacyCC.rendering.customPipelineBuilderMap = new Map<string, rendering.PipelineBuilder>();
rendering.addCustomBuiltinPipelines(legacyCC.rendering.customPipelineBuilderMap);

export { rendering };
