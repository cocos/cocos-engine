export { createIA } from './utils';
import config from './config';

const addStage = config.addStage;
export { addStage };

export * from './core/texture-buffer-pool';
export { RenderQueue, PassStage } from './core/constants';
export { Pass } from './core/pass';
export { programLib } from './core/program-lib';
import { samplerLib } from './core/sampler-lib';
cc.samplerLib = samplerLib;
export { samplerLib };

export { Light } from './scene/light';
export { Camera } from './scene/camera';
export { Model } from './scene/model';

export { SkinningModel } from './models/skinning-model';
export * from './models/joints-texture-utils';

import './scene/deprecated';
import './ui/render-data';
