import enums from './enums';
import { createIA } from './utils';
import config from './config';

import { RenderQueue, PassStage } from './core/constants';
import Pass from './core/pass';
import Technique from './core/technique';
import Effect from './core/effect';
import InputAssembler from './core/input-assembler';
import View from './core/view';

import Light from './scene/light';
import Camera from './scene/camera';
import Model from './scene/model';
import Scene from './scene/scene';

import LineBatchModel from './models/line-batch-model';
import SpriteBatchModel from './models/sprite-batch-model';
import ParticleBatchModel from './models/particle-batch-model';
import SkinningModel from './models/skinning-model';

import ForwardRenderer from './renderers/forward-renderer';

let renderer = {
  // config
  addStage: config.addStage,

  // utils
  createIA,

  // core
  RenderQueue,
  PassStage,
  Pass,
  Technique,
  Effect,
  InputAssembler,
  View,

  // scene
  Light,
  Camera,
  Model,
  Scene,

  // models
  LineBatchModel,
  SpriteBatchModel,
  ParticleBatchModel,
  SkinningModel,

  // renderers
  ForwardRenderer,
};
Object.assign(renderer, enums);

export { renderer };
cc.renderer = renderer;
