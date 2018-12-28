import {
  enums,
  attrTypeBytes,
  glFilter,
  glTextureFmt,
} from './enums';

import VertexFormat from './vertex-format';
import IndexBuffer from './index-buffer';
import VertexBuffer from './vertex-buffer';
import Program from './program';
import Texture from './texture';
import Texture2D from './texture-2d';
import TextureCube from './texture-cube';
import RenderBuffer from './render-buffer';
import FrameBuffer from './frame-buffer';
import Device from './device';

import { GFXDevice } from './gfx-device';
import { GFXBuffer } from './gfx-buffer';
import { GFXTexture } from './gfx-texture';
import { GFXTextureView } from './gfx-texture-view';
import { GFXSampler } from './gfx-sampler';
import { GFXShader } from './gfx-shader';
import { GFXInputAssembler } from './gfx-input-assembler';
import { GFXRenderPass } from './gfx-render-pass';
import { GFXFramebuffer } from './gfx-framebuffer';
import { GFXPipelineLayout } from './gfx-pipeline-layout';
import { GFXPipelineState } from './gfx-pipeline-state';
import { GFXCommandBuffer } from './gfx-command-buffer';
import { GFXQueue } from './gfx-queue';
import { WebGLGFXDevice } from './webgl/webgl-gfx-device';

let gfx = {
  // classes
  VertexFormat,
  IndexBuffer,
  VertexBuffer,
  Program,
  Texture,
  Texture2D,
  TextureCube,
  RenderBuffer,
  FrameBuffer,
  Device,

  // functions
  attrTypeBytes,
  glFilter,
  glTextureFmt,
};
Object.assign(gfx, enums);

export default gfx;
cc.gfx = gfx;

cc.GFXDevice = GFXDevice;
cc.GFXBuffer = GFXBuffer;
cc.GFXTexture = GFXTexture;
cc.GFXTextureView = GFXTextureView;
cc.GFXSampler = GFXSampler;
cc.GFXShader = GFXShader;
cc.GFXInputAssembler = GFXInputAssembler;
cc.GFXRenderPass = GFXRenderPass;
cc.GFXFramebuffer = GFXFramebuffer;
cc.GFXPipelineLayout = GFXPipelineLayout;
cc.GFXPipelineState = GFXPipelineState;
cc.GFXCommandBuffer = GFXCommandBuffer;
cc.GFXQueue = GFXQueue;
cc.WebGLGFXDevice = WebGLGFXDevice;
