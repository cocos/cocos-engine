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
import { WebGLGFXDevice } from '../../../dist/webgl/webgl-gfx-device';

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
  WebGLGFXDevice,

  // functions
  attrTypeBytes,
  glFilter,
  glTextureFmt,
};
Object.assign(gfx, enums);

export default gfx;
cc.gfx = gfx;
