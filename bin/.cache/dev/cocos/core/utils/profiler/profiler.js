(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../3d/framework/mesh-renderer.js", "../../3d/framework/camera-component.js", "../../3d/misc/utils.js", "../../assets/material.js", "../../gfx/define.js", "../../gfx/texture.js", "../../math/index.js", "../../scene-graph/index.js", "../../scene-graph/node.js", "./perf-counter.js", "../../default-constants.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../3d/framework/mesh-renderer.js"), require("../../3d/framework/camera-component.js"), require("../../3d/misc/utils.js"), require("../../assets/material.js"), require("../../gfx/define.js"), require("../../gfx/texture.js"), require("../../math/index.js"), require("../../scene-graph/index.js"), require("../../scene-graph/node.js"), require("./perf-counter.js"), require("../../default-constants.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.meshRenderer, global.cameraComponent, global.utils, global.material, global.define, global.texture, global.index, global.index, global.node, global.perfCounter, global.defaultConstants, global.globalExports);
    global.profiler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _meshRenderer, _cameraComponent, _utils, _material2, _define, _texture, _index, _index2, _node, _perfCounter, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.profiler = _exports.Profiler = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _characters = '0123456789. ';
  var _string2offset = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '.': 10
  };
  var _profileInfo = {
    frame: {
      desc: 'Frame time (ms)',
      min: 0,
      max: 50,
      average: 500
    },
    fps: {
      desc: 'Framerate (FPS)',
      below: 30,
      average: 500,
      isInteger: true
    },
    draws: {
      desc: 'Draw call',
      isInteger: true
    },
    instances: {
      desc: 'Instance Count',
      isInteger: true
    },
    tricount: {
      desc: 'Triangle',
      isInteger: true
    },
    logic: {
      desc: 'Game Logic (ms)',
      min: 0,
      max: 50,
      average: 500,
      color: '#080'
    },
    physics: {
      desc: 'Physics (ms)',
      min: 0,
      max: 50,
      average: 500
    },
    render: {
      desc: 'Renderer (ms)',
      min: 0,
      max: 50,
      average: 500,
      color: '#f90'
    },
    textureMemory: {
      desc: 'GFX Texture Mem(M)'
    },
    bufferMemory: {
      desc: 'GFX Buffer Mem(M)'
    }
  };
  var _constants = {
    fontSize: 23,
    quadHeight: 0.4,
    segmentsPerLine: 8,
    textureWidth: 256,
    textureHeight: 256
  };

  var Profiler = /*#__PURE__*/function () {
    // total lines to display
    // update use time
    function Profiler() {
      _classCallCheck(this, Profiler);

      this._stats = null;
      this.id = '__Profiler__';
      this._showFPS = false;
      this._rootNode = null;
      this._device = null;
      this._canvas = null;
      this._ctx = null;
      this._texture = null;
      this._region = new _define.GFXBufferTextureCopy();
      this._canvasArr = [];
      this._regionArr = [this._region];
      this.digitsData = null;
      this.pass = null;
      this._canvasDone = false;
      this._statsDone = false;
      this._inited = false;
      this._lineHeight = _constants.textureHeight / (Object.keys(_profileInfo).length + 1);
      this._wordHeight = 0;
      this._eachNumWidth = 0;
      this._totalLines = 0;
      this.lastTime = 0;

      if (!_defaultConstants.TEST) {
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');

        this._canvasArr.push(this._canvas);
      }
    }

    _createClass(Profiler, [{
      key: "isShowingStats",
      value: function isShowingStats() {
        return this._showFPS;
      }
    }, {
      key: "hideStats",
      value: function hideStats() {
        if (this._showFPS) {
          if (this._rootNode) {
            this._rootNode.active = false;
          }

          _globalExports.legacyCC.game.off(_globalExports.legacyCC.Game.EVENT_RESTART, this.generateNode, this);

          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);

          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);

          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);

          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);

          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);

          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_AFTER_DRAW, this.afterDraw, this);

          this._showFPS = false;
        }
      }
    }, {
      key: "showStats",
      value: function showStats() {
        if (!this._showFPS) {
          if (!this._device) {
            this._device = _globalExports.legacyCC.director.root.device;
          }

          this.generateCanvas();
          this.generateStats();

          _globalExports.legacyCC.game.once(_globalExports.legacyCC.Game.EVENT_ENGINE_INITED, this.generateNode, this);

          _globalExports.legacyCC.game.on(_globalExports.legacyCC.Game.EVENT_RESTART, this.generateNode, this);

          if (this._rootNode) {
            this._rootNode.active = true;
          }

          _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);

          _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);

          _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_BEFORE_PHYSICS, this.beforePhysics, this);

          _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_AFTER_PHYSICS, this.afterPhysics, this);

          _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);

          _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_AFTER_DRAW, this.afterDraw, this);

          this._showFPS = true;
          this._canvasDone = true;
          this._statsDone = true;
        }
      }
    }, {
      key: "generateCanvas",
      value: function generateCanvas() {
        if (this._canvasDone) {
          return;
        }

        var textureWidth = _constants.textureWidth,
            textureHeight = _constants.textureHeight;

        if (!this._ctx || !this._canvas) {
          return;
        }

        this._canvas.width = textureWidth;
        this._canvas.height = textureHeight;
        this._canvas.style.width = "".concat(this._canvas.width);
        this._canvas.style.height = "".concat(this._canvas.height);
        this._ctx.font = "".concat(_constants.fontSize, "px Arial");
        this._ctx.textBaseline = 'top';
        this._ctx.fillStyle = '#fff';
        this._texture = this._device.createTexture(new _texture.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.SAMPLED | _define.GFXTextureUsageBit.TRANSFER_DST, _define.GFXFormat.RGBA8, textureWidth, textureHeight));
        this._region.texExtent.width = textureWidth;
        this._region.texExtent.height = textureHeight;
      }
    }, {
      key: "generateStats",
      value: function generateStats() {
        if (this._statsDone || !this._ctx || !this._canvas) {
          return;
        }

        this._stats = null;
        var now = performance.now();
        this._ctx.textAlign = 'left';
        var i = 0;

        for (var id in _profileInfo) {
          var element = _profileInfo[id];

          this._ctx.fillText(element.desc, 0, i * this._lineHeight);

          element.counter = new _perfCounter.PerfCounter(id, element, now);
          i++;
        }

        this._totalLines = i;
        this._wordHeight = this._totalLines * this._lineHeight / this._canvas.height;

        for (var j = 0; j < _characters.length; ++j) {
          var offset = this._ctx.measureText(_characters[j]).width;

          this._eachNumWidth = Math.max(this._eachNumWidth, offset);
        }

        for (var _j = 0; _j < _characters.length; ++_j) {
          this._ctx.fillText(_characters[_j], _j * this._eachNumWidth, this._totalLines * this._lineHeight);
        }

        this._eachNumWidth /= this._canvas.width;
        this._stats = _profileInfo;
        this._canvasArr[0] = this._canvas;

        this._device.copyTexImagesToTexture(this._canvasArr, this._texture, this._regionArr);
      }
    }, {
      key: "generateNode",
      value: function generateNode() {
        if (this._rootNode && this._rootNode.isValid) {
          return;
        }

        this._rootNode = new _node.Node('PROFILER_NODE');

        _globalExports.legacyCC.game.addPersistRootNode(this._rootNode);

        var cameraNode = new _node.Node('Profiler_Camera');
        cameraNode.setPosition(0, 0, 1.5);
        cameraNode.parent = this._rootNode;
        var camera = cameraNode.addComponent('cc.Camera');
        camera.projection = _cameraComponent.Camera.ProjectionType.ORTHO;
        camera.near = 1;
        camera.far = 2;
        camera.orthoHeight = this._device.height;
        camera.visibility = _index2.Layers.BitMask.PROFILER;
        camera.clearFlags = _define.GFXClearFlag.NONE;
        camera.priority = 0xffffffff; // after everything else

        camera.flows = ['UIFlow'];
        var managerNode = new _node.Node('Profiler_Root');
        managerNode.parent = this._rootNode;
        var height = _constants.quadHeight;
        var rowHeight = height / this._totalLines;
        var lWidth = height / this._wordHeight;
        var scale = rowHeight / _constants.fontSize;
        var columnWidth = this._eachNumWidth * this._canvas.width * scale;
        var vertexPos = [0, height, 0, // top-left
        lWidth, height, 0, // top-right
        lWidth, 0, 0, // bottom-right
        0, 0, 0 // bottom-left
        ];
        var vertexindices = [0, 2, 1, 0, 3, 2];
        var vertexUV = [0, 0, -1, 0, 1, 0, -1, 0, 1, this._wordHeight, -1, 0, 0, this._wordHeight, -1, 0];
        var offset = 0;

        for (var i = 0; i < this._totalLines; i++) {
          for (var j = 0; j < _constants.segmentsPerLine; j++) {
            vertexPos.push(lWidth + j * columnWidth, height - i * rowHeight, 0); // tl

            vertexPos.push(lWidth + (j + 1) * columnWidth, height - i * rowHeight, 0); // tr

            vertexPos.push(lWidth + (j + 1) * columnWidth, height - (i + 1) * rowHeight, 0); // br

            vertexPos.push(lWidth + j * columnWidth, height - (i + 1) * rowHeight, 0); // bl

            offset = (i * _constants.segmentsPerLine + j + 1) * 4;
            vertexindices.push(0 + offset, 2 + offset, 1 + offset, 0 + offset, 3 + offset, 2 + offset);
            var idx = i * _constants.segmentsPerLine + j;
            var z = Math.floor(idx / 4);
            var w = idx - z * 4;
            vertexUV.push(0, this._wordHeight, z, w); // tl

            vertexUV.push(this._eachNumWidth, this._wordHeight, z, w); // tr

            vertexUV.push(this._eachNumWidth, 1, z, w); // br

            vertexUV.push(0, 1, z, w); // bl
          }
        } // device NDC correction


        var ySign = this._device.screenSpaceSignY;

        for (var _i = 1; _i < vertexPos.length; _i += 3) {
          vertexPos[_i] *= ySign;
        }

        var modelCom = managerNode.addComponent(_meshRenderer.MeshRenderer);
        modelCom.mesh = (0, _utils.createMesh)({
          positions: vertexPos,
          indices: vertexindices,
          colors: vertexUV // pack all the necessary info in a_color: { x: u, y: v, z: id.x, w: id.y }

        });

        var _material = new _material2.Material();

        _material.initialize({
          effectName: 'util/profiler'
        });

        _material.setProperty('offset', new _index.Vec4(-0.9, -0.9 * ySign, this._eachNumWidth, 0));

        var pass = this.pass = _material.passes[0];
        var handle = pass.getBinding('mainTexture');
        var binding = pass.getBinding('digits');
        pass.bindTexture(handle, this._texture);
        this.digitsData = pass.blocks[binding];
        modelCom.material = _material;
        modelCom.node.layer = _index2.Layers.Enum.PROFILER;
        this._inited = true;
      }
    }, {
      key: "beforeUpdate",
      value: function beforeUpdate() {
        if (!this._stats) {
          return;
        }

        var now = performance.now();

        this._stats.frame.counter.end(now);

        this._stats.frame.counter.start(now);

        this._stats.logic.counter.start(now);
      }
    }, {
      key: "afterUpdate",
      value: function afterUpdate() {
        if (!this._stats) {
          return;
        }

        var now = performance.now();

        if (_globalExports.legacyCC.director.isPaused()) {
          this._stats.frame.counter.start(now);
        } else {
          this._stats.logic.counter.end(now);
        }
      }
    }, {
      key: "beforePhysics",
      value: function beforePhysics() {
        if (!this._stats) {
          return;
        }

        var now = performance.now();

        this._stats.physics.counter.start(now);
      }
    }, {
      key: "afterPhysics",
      value: function afterPhysics() {
        if (!this._stats) {
          return;
        }

        var now = performance.now();

        this._stats.physics.counter.end(now);
      }
    }, {
      key: "beforeDraw",
      value: function beforeDraw() {
        if (!this._stats) {
          return;
        }

        var now = performance.now();

        this._stats.render.counter.start(now);
      }
    }, {
      key: "afterDraw",
      value: function afterDraw() {
        if (!this._stats || !this._inited) {
          return;
        }

        var now = performance.now();

        this._stats.fps.counter.frame(now);

        this._stats.render.counter.end(now);

        if (now - this.lastTime < 500) {
          return;
        }

        this.lastTime = now;
        var device = this._device;
        this._stats.draws.counter.value = device.numDrawCalls;
        this._stats.instances.counter.value = device.numInstances;
        this._stats.bufferMemory.counter.value = device.memoryStatus.bufferSize / (1024 * 1024);
        this._stats.textureMemory.counter.value = device.memoryStatus.textureSize / (1024 * 1024);
        this._stats.tricount.counter.value = device.numTris;
        var i = 0;
        var view = this.digitsData;

        for (var id in this._stats) {
          var stat = this._stats[id];
          stat.counter.sample(now);
          var result = stat.counter.human().toString();

          for (var j = _constants.segmentsPerLine - 1; j >= 0; j--) {
            var index = i * _constants.segmentsPerLine + j;
            var character = result[result.length - (_constants.segmentsPerLine - j)];
            var offset = _string2offset[character];

            if (offset === undefined) {
              offset = 11;
            }

            view[index] = offset;
          }

          i++;
        } // @ts-ignore


        this.pass._rootBufferDirty = true;
      }
    }]);

    return Profiler;
  }();

  _exports.Profiler = Profiler;
  var profiler = new Profiler();
  _exports.profiler = profiler;
  _globalExports.legacyCC.profiler = profiler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvcHJvZmlsZXIvcHJvZmlsZXIudHMiXSwibmFtZXMiOlsiX2NoYXJhY3RlcnMiLCJfc3RyaW5nMm9mZnNldCIsIl9wcm9maWxlSW5mbyIsImZyYW1lIiwiZGVzYyIsIm1pbiIsIm1heCIsImF2ZXJhZ2UiLCJmcHMiLCJiZWxvdyIsImlzSW50ZWdlciIsImRyYXdzIiwiaW5zdGFuY2VzIiwidHJpY291bnQiLCJsb2dpYyIsImNvbG9yIiwicGh5c2ljcyIsInJlbmRlciIsInRleHR1cmVNZW1vcnkiLCJidWZmZXJNZW1vcnkiLCJfY29uc3RhbnRzIiwiZm9udFNpemUiLCJxdWFkSGVpZ2h0Iiwic2VnbWVudHNQZXJMaW5lIiwidGV4dHVyZVdpZHRoIiwidGV4dHVyZUhlaWdodCIsIlByb2ZpbGVyIiwiX3N0YXRzIiwiaWQiLCJfc2hvd0ZQUyIsIl9yb290Tm9kZSIsIl9kZXZpY2UiLCJfY2FudmFzIiwiX2N0eCIsIl90ZXh0dXJlIiwiX3JlZ2lvbiIsIkdGWEJ1ZmZlclRleHR1cmVDb3B5IiwiX2NhbnZhc0FyciIsIl9yZWdpb25BcnIiLCJkaWdpdHNEYXRhIiwicGFzcyIsIl9jYW52YXNEb25lIiwiX3N0YXRzRG9uZSIsIl9pbml0ZWQiLCJfbGluZUhlaWdodCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJfd29yZEhlaWdodCIsIl9lYWNoTnVtV2lkdGgiLCJfdG90YWxMaW5lcyIsImxhc3RUaW1lIiwiVEVTVCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImdldENvbnRleHQiLCJwdXNoIiwiYWN0aXZlIiwibGVnYWN5Q0MiLCJnYW1lIiwib2ZmIiwiR2FtZSIsIkVWRU5UX1JFU1RBUlQiLCJnZW5lcmF0ZU5vZGUiLCJkaXJlY3RvciIsIkRpcmVjdG9yIiwiRVZFTlRfQkVGT1JFX1VQREFURSIsImJlZm9yZVVwZGF0ZSIsIkVWRU5UX0FGVEVSX1VQREFURSIsImFmdGVyVXBkYXRlIiwiRVZFTlRfQkVGT1JFX1BIWVNJQ1MiLCJiZWZvcmVQaHlzaWNzIiwiRVZFTlRfQUZURVJfUEhZU0lDUyIsImFmdGVyUGh5c2ljcyIsIkVWRU5UX0JFRk9SRV9EUkFXIiwiYmVmb3JlRHJhdyIsIkVWRU5UX0FGVEVSX0RSQVciLCJhZnRlckRyYXciLCJyb290IiwiZGV2aWNlIiwiZ2VuZXJhdGVDYW52YXMiLCJnZW5lcmF0ZVN0YXRzIiwib25jZSIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJvbiIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJmb250IiwidGV4dEJhc2VsaW5lIiwiZmlsbFN0eWxlIiwiY3JlYXRlVGV4dHVyZSIsIkdGWFRleHR1cmVJbmZvIiwiR0ZYVGV4dHVyZVR5cGUiLCJURVgyRCIsIkdGWFRleHR1cmVVc2FnZUJpdCIsIlNBTVBMRUQiLCJUUkFOU0ZFUl9EU1QiLCJHRlhGb3JtYXQiLCJSR0JBOCIsInRleEV4dGVudCIsIm5vdyIsInBlcmZvcm1hbmNlIiwidGV4dEFsaWduIiwiaSIsImVsZW1lbnQiLCJmaWxsVGV4dCIsImNvdW50ZXIiLCJQZXJmQ291bnRlciIsImoiLCJvZmZzZXQiLCJtZWFzdXJlVGV4dCIsIk1hdGgiLCJjb3B5VGV4SW1hZ2VzVG9UZXh0dXJlIiwiaXNWYWxpZCIsIk5vZGUiLCJhZGRQZXJzaXN0Um9vdE5vZGUiLCJjYW1lcmFOb2RlIiwic2V0UG9zaXRpb24iLCJwYXJlbnQiLCJjYW1lcmEiLCJhZGRDb21wb25lbnQiLCJwcm9qZWN0aW9uIiwiQ2FtZXJhIiwiUHJvamVjdGlvblR5cGUiLCJPUlRITyIsIm5lYXIiLCJmYXIiLCJvcnRob0hlaWdodCIsInZpc2liaWxpdHkiLCJMYXllcnMiLCJCaXRNYXNrIiwiUFJPRklMRVIiLCJjbGVhckZsYWdzIiwiR0ZYQ2xlYXJGbGFnIiwiTk9ORSIsInByaW9yaXR5IiwiZmxvd3MiLCJtYW5hZ2VyTm9kZSIsInJvd0hlaWdodCIsImxXaWR0aCIsInNjYWxlIiwiY29sdW1uV2lkdGgiLCJ2ZXJ0ZXhQb3MiLCJ2ZXJ0ZXhpbmRpY2VzIiwidmVydGV4VVYiLCJpZHgiLCJ6IiwiZmxvb3IiLCJ3IiwieVNpZ24iLCJzY3JlZW5TcGFjZVNpZ25ZIiwibW9kZWxDb20iLCJNZXNoUmVuZGVyZXIiLCJtZXNoIiwicG9zaXRpb25zIiwiaW5kaWNlcyIsImNvbG9ycyIsIl9tYXRlcmlhbCIsIk1hdGVyaWFsIiwiaW5pdGlhbGl6ZSIsImVmZmVjdE5hbWUiLCJzZXRQcm9wZXJ0eSIsIlZlYzQiLCJwYXNzZXMiLCJoYW5kbGUiLCJnZXRCaW5kaW5nIiwiYmluZGluZyIsImJpbmRUZXh0dXJlIiwiYmxvY2tzIiwibWF0ZXJpYWwiLCJub2RlIiwibGF5ZXIiLCJFbnVtIiwiZW5kIiwic3RhcnQiLCJpc1BhdXNlZCIsInZhbHVlIiwibnVtRHJhd0NhbGxzIiwibnVtSW5zdGFuY2VzIiwibWVtb3J5U3RhdHVzIiwiYnVmZmVyU2l6ZSIsInRleHR1cmVTaXplIiwibnVtVHJpcyIsInZpZXciLCJzdGF0Iiwic2FtcGxlIiwicmVzdWx0IiwiaHVtYW4iLCJ0b1N0cmluZyIsImluZGV4IiwiY2hhcmFjdGVyIiwidW5kZWZpbmVkIiwiX3Jvb3RCdWZmZXJEaXJ0eSIsInByb2ZpbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBDQSxNQUFNQSxXQUFXLEdBQUcsY0FBcEI7QUFFQSxNQUFNQyxjQUFjLEdBQUc7QUFDbkIsU0FBSyxDQURjO0FBRW5CLFNBQUssQ0FGYztBQUduQixTQUFLLENBSGM7QUFJbkIsU0FBSyxDQUpjO0FBS25CLFNBQUssQ0FMYztBQU1uQixTQUFLLENBTmM7QUFPbkIsU0FBSyxDQVBjO0FBUW5CLFNBQUssQ0FSYztBQVNuQixTQUFLLENBVGM7QUFVbkIsU0FBSyxDQVZjO0FBV25CLFNBQUs7QUFYYyxHQUF2QjtBQTJCQSxNQUFNQyxZQUFZLEdBQUc7QUFDakJDLElBQUFBLEtBQUssRUFBRTtBQUFFQyxNQUFBQSxJQUFJLEVBQUUsaUJBQVI7QUFBMkJDLE1BQUFBLEdBQUcs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QU0sS0FBS2tGLFNBQWYsRUFBMEI7QUFBRWxGLGNBQUFBLE1BQU0sR0FBRyxFQUFUO0FBQWM7O0FBQzFDMEUsWUFBQUEsSUFBSSxDQUFDTSxLQUFELENBQUosR0FBY2hGLE1BQWQ7QUFDSDs7QUFDRE4sVUFBQUEsQ0FBQztBQUNKLFNBbkNlLENBcUNoQjs7O0FBQ0EsYUFBS2hFLElBQUwsQ0FBVXlKLGdCQUFWLEdBQTZCLElBQTdCO0FBQ0g7Ozs7Ozs7QUFHRSxNQUFNQyxRQUFRLEdBQUcsSUFBSXhLLFFBQUosRUFBakI7O0FBQ1BnQywwQkFBU3dJLFFBQVQsR0FBb0JBLFFBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgTWVzaFJlbmRlcmVyIH0gZnJvbSAnLi4vLi4vM2QvZnJhbWV3b3JrL21lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tICcuLi8uLi8zZC9mcmFtZXdvcmsvY2FtZXJhLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNyZWF0ZU1lc2ggfSBmcm9tICcuLi8uLi8zZC9taXNjL3V0aWxzJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXJUZXh0dXJlQ29weSwgR0ZYQ2xlYXJGbGFnLCBHRlhGb3JtYXQsIEdGWFRleHR1cmVUeXBlLCBHRlhUZXh0dXJlVXNhZ2VCaXQgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUsIEdGWFRleHR1cmVJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4L3RleHR1cmUnO1xyXG5pbXBvcnQgeyBWZWM0IH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IExheWVycyB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL25vZGUnO1xyXG5pbXBvcnQgeyBJQ291bnRlck9wdGlvbiB9IGZyb20gJy4vY291bnRlcic7XHJcbmltcG9ydCB7IFBlcmZDb3VudGVyIH0gZnJvbSAnLi9wZXJmLWNvdW50ZXInO1xyXG5pbXBvcnQgeyBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi8uLi9yZW5kZXJlcic7XHJcblxyXG5jb25zdCBfY2hhcmFjdGVycyA9ICcwMTIzNDU2Nzg5LiAnO1xyXG5cclxuY29uc3QgX3N0cmluZzJvZmZzZXQgPSB7XHJcbiAgICAnMCc6IDAsXHJcbiAgICAnMSc6IDEsXHJcbiAgICAnMic6IDIsXHJcbiAgICAnMyc6IDMsXHJcbiAgICAnNCc6IDQsXHJcbiAgICAnNSc6IDUsXHJcbiAgICAnNic6IDYsXHJcbiAgICAnNyc6IDcsXHJcbiAgICAnOCc6IDgsXHJcbiAgICAnOSc6IDksXHJcbiAgICAnLic6IDEwLFxyXG59O1xyXG5cclxuaW50ZXJmYWNlIElQcm9maWxlclN0YXRlIHtcclxuICAgIGZyYW1lOiBJQ291bnRlck9wdGlvbjtcclxuICAgIGZwczogSUNvdW50ZXJPcHRpb247XHJcbiAgICBkcmF3czogSUNvdW50ZXJPcHRpb247XHJcbiAgICBpbnN0YW5jZXM6IElDb3VudGVyT3B0aW9uO1xyXG4gICAgdHJpY291bnQ6IElDb3VudGVyT3B0aW9uO1xyXG4gICAgbG9naWM6IElDb3VudGVyT3B0aW9uO1xyXG4gICAgcGh5c2ljczogSUNvdW50ZXJPcHRpb247XHJcbiAgICByZW5kZXI6IElDb3VudGVyT3B0aW9uO1xyXG4gICAgdGV4dHVyZU1lbW9yeTogSUNvdW50ZXJPcHRpb247XHJcbiAgICBidWZmZXJNZW1vcnk6IElDb3VudGVyT3B0aW9uO1xyXG59XHJcblxyXG5jb25zdCBfcHJvZmlsZUluZm8gPSB7XHJcbiAgICBmcmFtZTogeyBkZXNjOiAnRnJhbWUgdGltZSAobXMpJywgbWluOiAwLCBtYXg6IDUwLCBhdmVyYWdlOiA1MDAgfSxcclxuICAgIGZwczogeyBkZXNjOiAnRnJhbWVyYXRlIChGUFMpJywgYmVsb3c6IDMwLCBhdmVyYWdlOiA1MDAsIGlzSW50ZWdlcjogdHJ1ZSB9LFxyXG4gICAgZHJhd3M6IHsgZGVzYzogJ0RyYXcgY2FsbCcsIGlzSW50ZWdlcjogdHJ1ZSB9LFxyXG4gICAgaW5zdGFuY2VzOiB7IGRlc2M6ICdJbnN0YW5jZSBDb3VudCcsIGlzSW50ZWdlcjogdHJ1ZSB9LFxyXG4gICAgdHJpY291bnQ6IHsgZGVzYzogJ1RyaWFuZ2xlJywgaXNJbnRlZ2VyOiB0cnVlIH0sXHJcbiAgICBsb2dpYzogeyBkZXNjOiAnR2FtZSBMb2dpYyAobXMpJywgbWluOiAwLCBtYXg6IDUwLCBhdmVyYWdlOiA1MDAsIGNvbG9yOiAnIzA4MCcgfSxcclxuICAgIHBoeXNpY3M6IHsgZGVzYzogJ1BoeXNpY3MgKG1zKScsIG1pbjogMCwgbWF4OiA1MCwgYXZlcmFnZTogNTAwIH0sXHJcbiAgICByZW5kZXI6IHsgZGVzYzogJ1JlbmRlcmVyIChtcyknLCBtaW46IDAsIG1heDogNTAsIGF2ZXJhZ2U6IDUwMCwgY29sb3I6ICcjZjkwJyB9LFxyXG4gICAgdGV4dHVyZU1lbW9yeTogeyBkZXNjOiAnR0ZYIFRleHR1cmUgTWVtKE0pJyB9LFxyXG4gICAgYnVmZmVyTWVtb3J5OiB7IGRlc2M6ICdHRlggQnVmZmVyIE1lbShNKSd9LFxyXG59O1xyXG5cclxuY29uc3QgX2NvbnN0YW50cyA9IHtcclxuICAgIGZvbnRTaXplOiAyMyxcclxuICAgIHF1YWRIZWlnaHQ6IDAuNCxcclxuICAgIHNlZ21lbnRzUGVyTGluZTogOCxcclxuICAgIHRleHR1cmVXaWR0aDogMjU2LFxyXG4gICAgdGV4dHVyZUhlaWdodDogMjU2LFxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2ZpbGVyIHtcclxuXHJcbiAgICBwdWJsaWMgX3N0YXRzOiBJUHJvZmlsZXJTdGF0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGlkID0gJ19fUHJvZmlsZXJfXyc7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd0ZQUyA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX3Jvb3ROb2RlOiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9kZXZpY2U6IEdGWERldmljZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RleHR1cmU6IEdGWFRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlZ2lvbjogR0ZYQnVmZmVyVGV4dHVyZUNvcHkgPSBuZXcgR0ZYQnVmZmVyVGV4dHVyZUNvcHkoKTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NhbnZhc0FycjogSFRNTENhbnZhc0VsZW1lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVnaW9uQXJyID0gW3RoaXMuX3JlZ2lvbl07XHJcbiAgICBwcml2YXRlIGRpZ2l0c0RhdGE6IEZsb2F0MzJBcnJheSA9IG51bGwhO1xyXG4gICAgcHJpdmF0ZSBwYXNzOiBQYXNzID0gbnVsbCE7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FudmFzRG9uZSA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfc3RhdHNEb25lID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9pbml0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9saW5lSGVpZ2h0ID0gX2NvbnN0YW50cy50ZXh0dXJlSGVpZ2h0IC8gKE9iamVjdC5rZXlzKF9wcm9maWxlSW5mbykubGVuZ3RoICsgMSk7XHJcbiAgICBwcml2YXRlIF93b3JkSGVpZ2h0ID0gMDtcclxuICAgIHByaXZhdGUgX2VhY2hOdW1XaWR0aCA9IDA7XHJcbiAgICBwcml2YXRlIF90b3RhbExpbmVzID0gMDsgLy8gdG90YWwgbGluZXMgdG8gZGlzcGxheVxyXG5cclxuICAgIHByaXZhdGUgbGFzdFRpbWUgPSAwOyAgIC8vIHVwZGF0ZSB1c2UgdGltZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBpZiAoIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2N0eCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcclxuICAgICAgICAgICAgdGhpcy5fY2FudmFzQXJyLnB1c2godGhpcy5fY2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzU2hvd2luZ1N0YXRzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hvd0ZQUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZVN0YXRzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fc2hvd0ZQUykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3ROb2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLm9mZihsZWdhY3lDQy5HYW1lLkVWRU5UX1JFU1RBUlQsIHRoaXMuZ2VuZXJhdGVOb2RlLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub2ZmKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEUsIHRoaXMuYmVmb3JlVXBkYXRlLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub2ZmKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy5hZnRlclVwZGF0ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLm9mZihsZWdhY3lDQy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfUEhZU0lDUywgdGhpcy5iZWZvcmVQaHlzaWNzLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub2ZmKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1BIWVNJQ1MsIHRoaXMuYWZ0ZXJQaHlzaWNzLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub2ZmKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLmJlZm9yZURyYXcsIHRoaXMpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5vZmYobGVnYWN5Q0MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVywgdGhpcy5hZnRlckRyYXcsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaG93RlBTID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93U3RhdHMgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc2hvd0ZQUykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RldmljZSkgeyB0aGlzLl9kZXZpY2UgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRldmljZTsgfVxyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ2FudmFzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVTdGF0cygpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLm9uY2UobGVnYWN5Q0MuR2FtZS5FVkVOVF9FTkdJTkVfSU5JVEVELCB0aGlzLmdlbmVyYXRlTm9kZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUub24obGVnYWN5Q0MuR2FtZS5FVkVOVF9SRVNUQVJULCB0aGlzLmdlbmVyYXRlTm9kZSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fcm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3ROb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLm9uKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEUsIHRoaXMuYmVmb3JlVXBkYXRlLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub24obGVnYWN5Q0MuRGlyZWN0b3IuRVZFTlRfQUZURVJfVVBEQVRFLCB0aGlzLmFmdGVyVXBkYXRlLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub24obGVnYWN5Q0MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1BIWVNJQ1MsIHRoaXMuYmVmb3JlUGh5c2ljcywgdGhpcyk7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLm9uKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1BIWVNJQ1MsIHRoaXMuYWZ0ZXJQaHlzaWNzLCB0aGlzKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub24obGVnYWN5Q0MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVcsIHRoaXMuYmVmb3JlRHJhdywgdGhpcyk7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLm9uKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsIHRoaXMuYWZ0ZXJEcmF3LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Nob3dGUFMgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW52YXNEb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHNEb25lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdlbmVyYXRlQ2FudmFzICgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbnZhc0RvbmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgeyB0ZXh0dXJlV2lkdGgsIHRleHR1cmVIZWlnaHQgfSA9IF9jb25zdGFudHM7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY3R4IHx8ICF0aGlzLl9jYW52YXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FudmFzLndpZHRoID0gdGV4dHVyZVdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5oZWlnaHQgPSB0ZXh0dXJlSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS53aWR0aCA9IGAke3RoaXMuX2NhbnZhcy53aWR0aH1gO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLl9jYW52YXMuaGVpZ2h0fWA7XHJcblxyXG4gICAgICAgIHRoaXMuX2N0eC5mb250ID0gYCR7X2NvbnN0YW50cy5mb250U2l6ZX1weCBBcmlhbGA7XHJcbiAgICAgICAgdGhpcy5fY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xyXG4gICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcblxyXG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSB0aGlzLl9kZXZpY2UhLmNyZWF0ZVRleHR1cmUobmV3IEdGWFRleHR1cmVJbmZvKFxyXG4gICAgICAgICAgICBHRlhUZXh0dXJlVHlwZS5URVgyRCxcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZVVzYWdlQml0LlNBTVBMRUQgfCBHRlhUZXh0dXJlVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhGb3JtYXQuUkdCQTgsXHJcbiAgICAgICAgICAgIHRleHR1cmVXaWR0aCxcclxuICAgICAgICAgICAgdGV4dHVyZUhlaWdodCxcclxuICAgICAgICApKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVnaW9uLnRleEV4dGVudC53aWR0aCA9IHRleHR1cmVXaWR0aDtcclxuICAgICAgICB0aGlzLl9yZWdpb24udGV4RXh0ZW50LmhlaWdodCA9IHRleHR1cmVIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdlbmVyYXRlU3RhdHMgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0c0RvbmUgfHwgIXRoaXMuX2N0eCB8fCAhdGhpcy5fY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3N0YXRzID0gbnVsbDtcclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBpbiBfcHJvZmlsZUluZm8pIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IF9wcm9maWxlSW5mb1tpZF07XHJcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsVGV4dChlbGVtZW50LmRlc2MsIDAsIGkgKiB0aGlzLl9saW5lSGVpZ2h0KTtcclxuICAgICAgICAgICAgZWxlbWVudC5jb3VudGVyID0gbmV3IFBlcmZDb3VudGVyKGlkLCBlbGVtZW50LCBub3cpO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RvdGFsTGluZXMgPSBpO1xyXG4gICAgICAgIHRoaXMuX3dvcmRIZWlnaHQgPSB0aGlzLl90b3RhbExpbmVzICogdGhpcy5fbGluZUhlaWdodCAvIHRoaXMuX2NhbnZhcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgX2NoYXJhY3RlcnMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5fY3R4Lm1lYXN1cmVUZXh0KF9jaGFyYWN0ZXJzW2pdKS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fZWFjaE51bVdpZHRoID0gTWF0aC5tYXgodGhpcy5fZWFjaE51bVdpZHRoLCBvZmZzZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IF9jaGFyYWN0ZXJzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsVGV4dChfY2hhcmFjdGVyc1tqXSwgaiAqIHRoaXMuX2VhY2hOdW1XaWR0aCwgdGhpcy5fdG90YWxMaW5lcyAqIHRoaXMuX2xpbmVIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9lYWNoTnVtV2lkdGggLz0gdGhpcy5fY2FudmFzLndpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLl9zdGF0cyA9IF9wcm9maWxlSW5mbyBhcyBJUHJvZmlsZXJTdGF0ZTtcclxuICAgICAgICB0aGlzLl9jYW52YXNBcnJbMF0gPSB0aGlzLl9jYW52YXM7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlIS5jb3B5VGV4SW1hZ2VzVG9UZXh0dXJlKHRoaXMuX2NhbnZhc0FyciwgdGhpcy5fdGV4dHVyZSEsIHRoaXMuX3JlZ2lvbkFycik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdlbmVyYXRlTm9kZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jvb3ROb2RlICYmIHRoaXMuX3Jvb3ROb2RlLmlzVmFsaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcm9vdE5vZGUgPSBuZXcgTm9kZSgnUFJPRklMRVJfTk9ERScpO1xyXG4gICAgICAgIGxlZ2FjeUNDLmdhbWUuYWRkUGVyc2lzdFJvb3ROb2RlKHRoaXMuX3Jvb3ROb2RlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhTm9kZSA9IG5ldyBOb2RlKCdQcm9maWxlcl9DYW1lcmEnKTtcclxuICAgICAgICBjYW1lcmFOb2RlLnNldFBvc2l0aW9uKDAsIDAsIDEuNSk7XHJcbiAgICAgICAgY2FtZXJhTm9kZS5wYXJlbnQgPSB0aGlzLl9yb290Tm9kZTtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBjYW1lcmFOb2RlLmFkZENvbXBvbmVudCgnY2MuQ2FtZXJhJykgYXMgQ2FtZXJhO1xyXG4gICAgICAgIGNhbWVyYS5wcm9qZWN0aW9uID0gQ2FtZXJhLlByb2plY3Rpb25UeXBlLk9SVEhPO1xyXG4gICAgICAgIGNhbWVyYS5uZWFyID0gMTtcclxuICAgICAgICBjYW1lcmEuZmFyID0gMjtcclxuICAgICAgICBjYW1lcmEub3J0aG9IZWlnaHQgPSB0aGlzLl9kZXZpY2UhLmhlaWdodDtcclxuICAgICAgICBjYW1lcmEudmlzaWJpbGl0eSA9IExheWVycy5CaXRNYXNrLlBST0ZJTEVSO1xyXG4gICAgICAgIGNhbWVyYS5jbGVhckZsYWdzID0gR0ZYQ2xlYXJGbGFnLk5PTkU7XHJcbiAgICAgICAgY2FtZXJhLnByaW9yaXR5ID0gMHhmZmZmZmZmZjsgLy8gYWZ0ZXIgZXZlcnl0aGluZyBlbHNlXHJcbiAgICAgICAgY2FtZXJhLmZsb3dzID0gWydVSUZsb3cnXTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFuYWdlck5vZGUgPSBuZXcgTm9kZSgnUHJvZmlsZXJfUm9vdCcpO1xyXG4gICAgICAgIG1hbmFnZXJOb2RlLnBhcmVudCA9IHRoaXMuX3Jvb3ROb2RlO1xyXG5cclxuICAgICAgICBjb25zdCBoZWlnaHQgPSBfY29uc3RhbnRzLnF1YWRIZWlnaHQ7XHJcbiAgICAgICAgY29uc3Qgcm93SGVpZ2h0ID0gaGVpZ2h0IC8gdGhpcy5fdG90YWxMaW5lcztcclxuICAgICAgICBjb25zdCBsV2lkdGggPSBoZWlnaHQgLyB0aGlzLl93b3JkSGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IHNjYWxlID0gcm93SGVpZ2h0IC8gX2NvbnN0YW50cy5mb250U2l6ZTtcclxuICAgICAgICBjb25zdCBjb2x1bW5XaWR0aCA9IHRoaXMuX2VhY2hOdW1XaWR0aCAqIHRoaXMuX2NhbnZhcyEud2lkdGggKiBzY2FsZTtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhQb3M6IG51bWJlcltdID0gW1xyXG4gICAgICAgICAgICAwLCBoZWlnaHQsIDAsIC8vIHRvcC1sZWZ0XHJcbiAgICAgICAgICAgIGxXaWR0aCwgaGVpZ2h0LCAwLCAvLyB0b3AtcmlnaHRcclxuICAgICAgICAgICAgbFdpZHRoLCAgIDAsIDAsIC8vIGJvdHRvbS1yaWdodFxyXG4gICAgICAgICAgICAwLCAgIDAsIDAsIC8vIGJvdHRvbS1sZWZ0XHJcbiAgICAgICAgXTtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhpbmRpY2VzOiBudW1iZXJbXSA9IFtcclxuICAgICAgICAgICAgMCwgMiwgMSxcclxuICAgICAgICAgICAgMCwgMywgMixcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNvbnN0IHZlcnRleFVWOiBudW1iZXJbXSA9IFtcclxuICAgICAgICAgICAgMCwgMCwgLTEsIDAsXHJcbiAgICAgICAgICAgIDEsIDAsIC0xLCAwLFxyXG4gICAgICAgICAgICAxLCB0aGlzLl93b3JkSGVpZ2h0LCAtMSwgMCxcclxuICAgICAgICAgICAgMCwgdGhpcy5fd29yZEhlaWdodCwgLTEsIDAsXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RvdGFsTGluZXM7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IF9jb25zdGFudHMuc2VnbWVudHNQZXJMaW5lOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleFBvcy5wdXNoKGxXaWR0aCArIGogKiBjb2x1bW5XaWR0aCwgaGVpZ2h0IC0gaSAqIHJvd0hlaWdodCwgMCApOyAvLyB0bFxyXG4gICAgICAgICAgICAgICAgdmVydGV4UG9zLnB1c2gobFdpZHRoICsgKGogKyAxKSAqIGNvbHVtbldpZHRoLCBoZWlnaHQgLSBpICogcm93SGVpZ2h0LCAwKTsgLy8gdHJcclxuICAgICAgICAgICAgICAgIHZlcnRleFBvcy5wdXNoKGxXaWR0aCArIChqICsgMSkgKiBjb2x1bW5XaWR0aCwgaGVpZ2h0IC0gKGkgKyAxKSAqIHJvd0hlaWdodCwgMCk7IC8vIGJyXHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhQb3MucHVzaChsV2lkdGggKyBqICogY29sdW1uV2lkdGgsIGhlaWdodCAtIChpICsgMSkgKiByb3dIZWlnaHQsIDApOyAvLyBibFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gKGkgKiBfY29uc3RhbnRzLnNlZ21lbnRzUGVyTGluZSArIGogKyAxKSAqIDQ7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhpbmRpY2VzLnB1c2goMCArIG9mZnNldCwgMiArIG9mZnNldCwgMSArIG9mZnNldCwgMCArIG9mZnNldCwgMyArIG9mZnNldCwgMiArIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBpICogX2NvbnN0YW50cy5zZWdtZW50c1BlckxpbmUgKyBqO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeiA9IE1hdGguZmxvb3IoaWR4IC8gNCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3ID0gaWR4IC0geiAqIDQ7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhVVi5wdXNoKDAsIHRoaXMuX3dvcmRIZWlnaHQsIHosIHcgKTsgLy8gdGxcclxuICAgICAgICAgICAgICAgIHZlcnRleFVWLnB1c2godGhpcy5fZWFjaE51bVdpZHRoLCB0aGlzLl93b3JkSGVpZ2h0LCB6LCB3ICk7IC8vIHRyXHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhVVi5wdXNoKHRoaXMuX2VhY2hOdW1XaWR0aCwgMSwgeiwgdyApOyAvLyBiclxyXG4gICAgICAgICAgICAgICAgdmVydGV4VVYucHVzaCgwLCAxLCB6LCB3ICk7IC8vIGJsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGRldmljZSBOREMgY29ycmVjdGlvblxyXG4gICAgICAgIGNvbnN0IHlTaWduID0gdGhpcy5fZGV2aWNlIS5zY3JlZW5TcGFjZVNpZ25ZO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmVydGV4UG9zLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIHZlcnRleFBvc1tpXSAqPSB5U2lnbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGVsQ29tID0gbWFuYWdlck5vZGUuYWRkQ29tcG9uZW50KE1lc2hSZW5kZXJlcik7XHJcbiAgICAgICAgbW9kZWxDb20ubWVzaCA9IGNyZWF0ZU1lc2goe1xyXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHZlcnRleFBvcyxcclxuICAgICAgICAgICAgaW5kaWNlczogdmVydGV4aW5kaWNlcyxcclxuICAgICAgICAgICAgY29sb3JzOiB2ZXJ0ZXhVViwgLy8gcGFjayBhbGwgdGhlIG5lY2Vzc2FyeSBpbmZvIGluIGFfY29sb3I6IHsgeDogdSwgeTogdiwgejogaWQueCwgdzogaWQueSB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IF9tYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCgpO1xyXG4gICAgICAgIF9tYXRlcmlhbC5pbml0aWFsaXplKHsgZWZmZWN0TmFtZTogJ3V0aWwvcHJvZmlsZXInIH0pO1xyXG4gICAgICAgIF9tYXRlcmlhbC5zZXRQcm9wZXJ0eSgnb2Zmc2V0JywgbmV3IFZlYzQoLTAuOSwgLTAuOSAqIHlTaWduLCB0aGlzLl9lYWNoTnVtV2lkdGgsIDApKTtcclxuICAgICAgICBjb25zdCBwYXNzID0gdGhpcy5wYXNzID0gX21hdGVyaWFsLnBhc3Nlc1swXTtcclxuICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXNzLmdldEJpbmRpbmcoJ21haW5UZXh0dXJlJyk7XHJcbiAgICAgICAgY29uc3QgYmluZGluZyA9IHBhc3MuZ2V0QmluZGluZygnZGlnaXRzJyk7XHJcbiAgICAgICAgcGFzcy5iaW5kVGV4dHVyZShoYW5kbGUsIHRoaXMuX3RleHR1cmUhKTtcclxuICAgICAgICB0aGlzLmRpZ2l0c0RhdGEgPSBwYXNzLmJsb2Nrc1tiaW5kaW5nXTtcclxuICAgICAgICBtb2RlbENvbS5tYXRlcmlhbCA9IF9tYXRlcmlhbDtcclxuICAgICAgICBtb2RlbENvbS5ub2RlLmxheWVyID0gTGF5ZXJzLkVudW0uUFJPRklMRVI7XHJcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmVmb3JlVXBkYXRlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N0YXRzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgICh0aGlzLl9zdGF0cy5mcmFtZS5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS5lbmQobm93KTtcclxuICAgICAgICAodGhpcy5fc3RhdHMuZnJhbWUuY291bnRlciBhcyBQZXJmQ291bnRlcikuc3RhcnQobm93KTtcclxuICAgICAgICAodGhpcy5fc3RhdHMubG9naWMuY291bnRlciBhcyBQZXJmQ291bnRlcikuc3RhcnQobm93KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWZ0ZXJVcGRhdGUgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RhdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLmRpcmVjdG9yLmlzUGF1c2VkKCkpIHtcclxuICAgICAgICAgICAgKHRoaXMuX3N0YXRzLmZyYW1lLmNvdW50ZXIgYXMgUGVyZkNvdW50ZXIpLnN0YXJ0KG5vdyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKHRoaXMuX3N0YXRzLmxvZ2ljLmNvdW50ZXIgYXMgUGVyZkNvdW50ZXIpLmVuZChub3cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmVmb3JlUGh5c2ljcyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zdGF0cykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAodGhpcy5fc3RhdHMucGh5c2ljcy5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS5zdGFydChub3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZnRlclBoeXNpY3MgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RhdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgKHRoaXMuX3N0YXRzLnBoeXNpY3MuY291bnRlciBhcyBQZXJmQ291bnRlcikuZW5kKG5vdyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJlZm9yZURyYXcgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RhdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgKHRoaXMuX3N0YXRzLnJlbmRlci5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS5zdGFydChub3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZnRlckRyYXcgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RhdHMgfHwgIXRoaXMuX2luaXRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICAodGhpcy5fc3RhdHMuZnBzLmNvdW50ZXIgYXMgUGVyZkNvdW50ZXIpLmZyYW1lKG5vdyk7XHJcbiAgICAgICAgKHRoaXMuX3N0YXRzLnJlbmRlci5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS5lbmQobm93KTtcclxuXHJcbiAgICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFRpbWUgPCA1MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gbm93O1xyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLl9kZXZpY2UhO1xyXG4gICAgICAgICh0aGlzLl9zdGF0cy5kcmF3cy5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS52YWx1ZSA9IGRldmljZS5udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgKHRoaXMuX3N0YXRzLmluc3RhbmNlcy5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS52YWx1ZSA9IGRldmljZS5udW1JbnN0YW5jZXM7XHJcbiAgICAgICAgKHRoaXMuX3N0YXRzLmJ1ZmZlck1lbW9yeS5jb3VudGVyIGFzIFBlcmZDb3VudGVyKS52YWx1ZSA9IGRldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSAvICgxMDI0ICogMTAyNCk7XHJcbiAgICAgICAgKHRoaXMuX3N0YXRzLnRleHR1cmVNZW1vcnkuY291bnRlciBhcyBQZXJmQ291bnRlcikudmFsdWUgPSBkZXZpY2UubWVtb3J5U3RhdHVzLnRleHR1cmVTaXplIC8gKDEwMjQgKiAxMDI0KTtcclxuICAgICAgICAodGhpcy5fc3RhdHMudHJpY291bnQuY291bnRlciBhcyBQZXJmQ291bnRlcikudmFsdWUgPSBkZXZpY2UubnVtVHJpcztcclxuXHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmRpZ2l0c0RhdGE7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBpbiB0aGlzLl9zdGF0cykge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gdGhpcy5fc3RhdHNbaWRdIGFzIElDb3VudGVyT3B0aW9uO1xyXG4gICAgICAgICAgICBzdGF0LmNvdW50ZXIuc2FtcGxlKG5vdyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXQuY291bnRlci5odW1hbigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBfY29uc3RhbnRzLnNlZ21lbnRzUGVyTGluZSAtIDE7IGogPj0gMDsgai0tKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGkgKiBfY29uc3RhbnRzLnNlZ21lbnRzUGVyTGluZSArIGo7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIChfY29uc3RhbnRzLnNlZ21lbnRzUGVyTGluZSAtIGopXTtcclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBfc3RyaW5nMm9mZnNldFtjaGFyYWN0ZXJdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7IG9mZnNldCA9IDExOyB9XHJcbiAgICAgICAgICAgICAgICB2aWV3W2luZGV4XSA9IG9mZnNldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5wYXNzLl9yb290QnVmZmVyRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJvZmlsZXIgPSBuZXcgUHJvZmlsZXIoKTtcclxubGVnYWN5Q0MucHJvZmlsZXIgPSBwcm9maWxlcjtcclxuIl19