// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { GFXBindingLayoutInfo } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXPrimitiveMode } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState, GFXInputState,
  GFXPipelineState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXColorAttachment, GFXDepthStencilAttachment } from '../../gfx/render-pass';
import { GFXSampler } from '../../gfx/sampler';
import { PassStage } from './constants';

export interface PassInfo {
  device: GFXDevice;
  program: string;
  primitive?: GFXPrimitiveMode;
  stage?: PassStage;
  inputState?: GFXInputState;
  rasterizerState?: GFXRasterizerState;
  depthStencilState?: GFXDepthStencilState;
  blendState?: GFXBlendState;
  blendTarget?: GFXBlendTarget;
  bindingLayoutInfo?: GFXBindingLayoutInfo;
  colorAttachment?: GFXColorAttachment;
  depthStencilAttachment?: GFXDepthStencilAttachment;
}

export class Pass {
  public static create(info: PassInfo) {
    const pass = new Pass();
    const device = pass._device = info.device;
    pass._programName = info.program;
    pass._stage = info.stage || PassStage.DEFAULT;

    // pipeline state
    const shader = device.createShader({ name: info.program, stages: [] });
    if (!shader) { console.error('create shader failed'); return; }
    const bindingLayout = device.createBindingLayout(info.bindingLayoutInfo || { bindings: [] });
    if (!bindingLayout) { console.error('create binding layout failed'); return; }
    const layout = device.createPipelineLayout({ layouts: [bindingLayout] });
    if (!layout) { console.error('create pipeline layout failed'); return; }
    const renderPass = device.createRenderPass({
      colorAttachments: [Object.assign(new GFXColorAttachment(), info.colorAttachment)],
      depthStencilAttachment: Object.assign(new GFXDepthStencilAttachment(), info.depthStencilAttachment),
    });
    if (!renderPass) { console.error('create render pass failed'); return; }
    const bs = Object.assign(new GFXBlendState(), info.blendState);
    Object.assign(bs.targets[0], info.blendTarget);

    pass._pipelineState = device.createPipelineState({
      primitive: info.primitive || GFXPrimitiveMode.TRIANGLE_LIST,
      is: Object.assign(new GFXInputState(), info.inputState),
      rs: Object.assign(new GFXRasterizerState(), info.rasterizerState),
      dss: Object.assign(new GFXDepthStencilState(), info.depthStencilState),
      bs, shader, layout, renderPass,
    });
  }

  protected _device: GFXDevice | null = null;
  protected _programName: string = '';
  protected _stage: PassStage = PassStage.DEFAULT;
  protected _pipelineState: GFXPipelineState | null = null;
  protected _buffers: GFXBuffer[] = [];
  protected _samplers: GFXSampler[] = [];
}
