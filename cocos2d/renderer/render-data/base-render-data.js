// Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.  

/**
 * BaseRenderData is a core data abstraction for renderer, this is a abstract class.
 * An inherited render data type should define raw vertex datas.
 * User should also define the effect, vertex count and index count.
 */
export default class BaseRenderData {
  constructor () {
      this.material = null;
      this.vertexCount = 0;
      this.indiceCount = 0;
  }
}