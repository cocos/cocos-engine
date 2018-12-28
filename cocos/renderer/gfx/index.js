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

import { GFXDevice } from '../../../dist/cocos/renderer/gfx/gfx-device';
import { GFXBuffer } from '../../../dist/cocos/renderer/gfx/gfx-buffer';
import { GFXTexture } from '../../../dist/cocos/renderer/gfx/gfx-texture';
import { GFXTextureView } from '../../../dist/cocos/renderer/gfx/gfx-texture-view';
import { GFXSampler } from '../../../dist/cocos/renderer/gfx/gfx-sampler';
import { GFXShader } from '../../../dist/cocos/renderer/gfx/gfx-shader';
import { GFXInputAssembler } from '../../../dist/cocos/renderer/gfx/gfx-input-assembler';
import { GFXRenderPass } from '../../../dist/cocos/renderer/gfx/gfx-render-pass';
import { GFXFramebuffer } from '../../../dist/cocos/renderer/gfx/gfx-framebuffer';
import { GFXPipelineLayout } from '../../../dist/cocos/renderer/gfx/gfx-pipeline-layout';
import { GFXPipelineState } from '../../../dist/cocos/renderer/gfx/gfx-pipeline-state';
import { GFXCommandBuffer } from '../../../dist/cocos/renderer/gfx/gfx-command-buffer';
import { GFXQueue } from '../../../dist/cocos/renderer/gfx/gfx-queue';
import { WebGLGFXDevice } from '../../../dist/cocos/renderer/gfx/webgl/webgl-gfx-device';

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
