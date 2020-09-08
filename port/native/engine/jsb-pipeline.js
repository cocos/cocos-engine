/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You
 shall not use Cocos Creator software for developing other software or tools
 that's used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to
 you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

(function() {
if (cc.ForwardPipeline) return;

const typeToClass = {
  ForwardPipeline: nr.ForwardPipeline,
}

class ForwardPipeline extends nr.ForwardPipeline {
  constructor() {
    super();
    this._tag = 0;
    this._flows = [];
    this.renderTextures = [];
    this.materials = [];
  }

  init() {
    this.fog = new cc.Fog();
    this.ambient = new cc.Ambient();
    this.skybox = new cc.Skybox();
    this.shadows = new cc.Shadows();
    for (let i = 0; i < this._flows.length; i++) {
      this._flows[i].init();
    }
    let info = new nr.RenderPipelineInfo(this._tag, this._flows);
    this.initialize(info);
  }
}

class ForwardFlow extends nr.ForwardFlow {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
  }
  init() {
    for (let i = 0; i < this._stages.length; i++) {
      this._stages[i].init();
    }
    let info = new nr.RenderFlowInfo(
        this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
  }
}

class ShadowFlow extends nr.ShadowFlow {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
  }
  init() {
    for (let i = 0; i < this._stages.length; i++) {
      this._stages[i].init();
    }
    let info = new nr.RenderFlowInfo(
        this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
  }
}

class UIFlow extends nr.UIFlow {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
  }
  init() {
    for (let i = 0; i < this._stages.length; i++) {
      this._stages[i].init();
    }
    let info = new nr.RenderFlowInfo(
        this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
  }
}

class ForwardStage extends nr.ForwardStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
  }
  init() {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
      queues.push(this.renderQueues[i].init());
    }
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
  }
}

class ShadowStage extends nr.ShadowStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
  }
  init() {
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, []);
    this.initialize(info);
  }
}

class UIStage extends nr.UIStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
  }
  init() {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
      queues.push(this.renderQueues[i].init());
    }
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
  }
}

class RenderQueueDesc {
  constructor() {
    this.isTransparent = false;
    this.sortMode = 0;
    this.stages = [];
  }

  init() {
    let desc =
        new nr.RenderQueueDesc(this.isTransparent, this.sortMode, this.stages);
    return desc;
  }
}

cc.js.setClassName('ForwardPipeline', ForwardPipeline);
cc.js.setClassName('ForwardFlow', ForwardFlow);
cc.js.setClassName('ShadowFlow', ShadowFlow);
cc.js.setClassName('UIFlow', UIFlow);
cc.js.setClassName('ForwardStage', ForwardStage);
cc.js.setClassName('ShadowStage', ShadowStage);
cc.js.setClassName('UIStage', UIStage);
cc.js.setClassName('RenderQueueDesc', RenderQueueDesc);

const deserializeProto = cc.deserialize._Deserializer.prototype;
const _deserialize = deserializeProto.deserialize;

Object.assign(deserializeProto, {
  deserialize(jsonObj) {
    const kkclass = typeToClass[jsonObj.__type__];
    if (kkclass) {
      const data = _deserialize.call(this, jsonObj);
      data.init();
      return data;
    } else {
      return _deserialize.call(this, jsonObj);
    }
  },
})

const RootProto = cc.Root.prototype;

Object.assign(RootProto, {
  createView(info) {
    const view = new nr.RenderView();
    let jsbInfo = {
      cameraID: info.camera.handle,
      name: info.name,
      priority: info.priority,
      flows: info.flows
    };
    view.initialize(new nr.RenderViewInfo(jsbInfo));
    return view;
  },

  createDefaultPipeline() {
    const pipeline = new nr.ForwardPipeline();
    const info = new nr.RenderPipelineInfo(0, []);
    pipeline.initialize(info);
    return pipeline;
  },
})
})();