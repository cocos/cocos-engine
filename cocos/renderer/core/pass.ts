// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { PassStage } from './constants';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXSampler } from '../../gfx/sampler';
import { GFXDevice } from '../../gfx/device';
import { GFXDepthStencilAttachment, GFXColorAttachment } from '../../gfx/render-pass';
import { GFXPipelineState, GFXRasterizerState, GFXDepthStencilState, GFXBlendState, GFXInputState } from '../../gfx/pipeline-state';
import { GFXBindingLayoutInfo } from '../../gfx/binding-layout';
import { GFXPrimitiveMode } from '../../gfx/gfx-define';

interface PassInfo {
  programName?: string;
  primitive?: GFXPrimitiveMode;
  stage?: PassStage;
  inputState?: GFXInputState;
  rasterizerState?: GFXRasterizerState;
  depthStencilState?: GFXDepthStencilState;
  blendState?: GFXBlendState;
  bindingLayoutInfo?: GFXBindingLayoutInfo;
}

export default class Pass {
  static create(info: PassInfo) {
    let pass = new Pass();
    let device = pass._device = cc.game._renderContext;
    pass._programName = info.programName || '';
    pass._stage = info.stage || PassStage.DEFAULT;
    // pipeline state
    pass._pipelineState = device.createPipelineState({
      primitive: info.primitive || GFXPrimitiveMode.TRIANGLE_LIST,
      shader: null,
      is: Object.assign(new GFXInputState, info.inputState),
      rs: Object.assign(new GFXRasterizerState, info.rasterizerState),
      dss: Object.assign(new GFXDepthStencilState, info.depthStencilState),
      bs: Object.assign(new GFXBlendState, info.blendState),
      layout: device.createPipelineLayout({
        layouts: [device.createBindingLayout(info.bindingLayoutInfo || { bindings: [] })]
      }),
      renderPass: device.createRenderPass({
        colorAttachments: [new GFXColorAttachment],
        depthStencilAttachment: new GFXDepthStencilAttachment
      })
    });
  }

  protected _device: GFXDevice | null = null;
  protected _programName: string = '';
  protected _stage: PassStage = PassStage.DEFAULT;
  protected _pipelineState: GFXPipelineState | null = null;
  protected _buffers: GFXBuffer[] = [];
  protected _samplers: GFXSampler[] = [];
}
