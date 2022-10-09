import { createCustomPipeline, addCustomBuiltinPipelines } from '../cocos/rendering/custom';
import { legacyCC } from '../cocos/core/global-exports';
import { PipelineBuilder } from '../cocos/rendering/custom/pipeline';

import * as rendering from '../cocos/rendering/custom/public';

legacyCC.internal.createCustomPipeline = createCustomPipeline;
legacyCC.internal.customPipelineBuilderMap = new Map<string, PipelineBuilder>();
addCustomBuiltinPipelines(legacyCC.internal.customPipelineBuilderMap);

legacyCC.rendering = rendering;
export { rendering };
