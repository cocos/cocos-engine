/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXCommandBuffer } from './command-buffer';
import * as GFXDefines from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXInputAssembler } from './input-assembler';
import { GFXPipelineLayout } from './pipeline-layout';
import { GFXPipelineState } from './pipeline-state';
import { GFXQueue } from './queue';
import { GFXRenderPass } from './render-pass';
import { GFXSampler } from './sampler';
import { GFXShader } from './shader';
import { GFXTexture } from './texture';
import { GFXTextureView } from './texture-view';

export * from './define';

cc.GFXDevice = GFXDevice; export { GFXDevice };
cc.GFXBuffer = GFXBuffer; export { GFXBuffer };
cc.GFXTexture = GFXTexture; export { GFXTexture };
cc.GFXTextureView = GFXTextureView; export { GFXTextureView };
cc.GFXSampler = GFXSampler; export { GFXSampler };
cc.GFXShader = GFXShader; export { GFXShader };
cc.GFXInputAssembler = GFXInputAssembler; export { GFXInputAssembler };
cc.GFXRenderPass = GFXRenderPass; export { GFXRenderPass };
cc.GFXFramebuffer = GFXFramebuffer; export { GFXFramebuffer };
cc.GFXPipelineLayout = GFXPipelineLayout; export { GFXPipelineLayout };
cc.GFXPipelineState = GFXPipelineState; export { GFXPipelineState };
cc.GFXCommandBuffer = GFXCommandBuffer; export { GFXCommandBuffer };
cc.GFXQueue = GFXQueue; export { GFXQueue };

Object.assign(cc, GFXDefines);
