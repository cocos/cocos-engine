// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../gfx';
import { vec3, mat4 } from '../../core/vmath';

import BaseRenderer from '../core/base-renderer';
import DynamicIAPool from '../core/dynamic-ia-pool';
import enums from '../enums';
import { PassStage } from '../core/constants';

// import GaussianBlur from './gaussian-blur';

let _camPos = vec3.create(0, 0, 0);
let _camFwd = vec3.create(0, 0, 0);

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);
let _a16_lightViewProj = new Float32Array(16);
let _a3_camPos = new Float32Array(3);

export default class ForwardRenderer extends BaseRenderer {
  constructor(device, builtin) {
    super(device, builtin);
    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._shadowLights = [];
    this._sceneAmbient = new Float32Array([0.5, 0.5, 0.5]);

    this._registerStage(PassStage.SHADOWCAST, this._shadowStage.bind(this));
    this._registerStage(PassStage.DEFAULT, this._defaultStage.bind(this));
    this._registerStage(PassStage.FORWARD, this._forwardStage.bind(this));

    this._registerModel('default', this._draw.bind(this));
    this._registerModel('line-batch', this._drawLineBatch.bind(this));
    this._registerModel('sprite-batch', this._drawSpriteBatch.bind(this));
    this._registerModel('particle-batch', this._drawParticleBatch.bind(this));
    this._registerModel('skinning', this._drawSkinning.bind(this));

    // this._blur = new GaussianBlur(device, this._programLib);

    // lineIAs
    this._lineIAs = new DynamicIAPool(
      device, 2,
      gfx.PT_LINES,
      new gfx.VertexFormat([
        { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
        { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }
      ]),
      2000
    );

    // spriteIAs
    this._spriteIAs = new DynamicIAPool(
      device, 2,
      gfx.PT_TRIANGLES,
      new gfx.VertexFormat([
        { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
        { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
        { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4 }
      ]),
      2000,
      gfx.INDEX_FMT_UINT16,
      2000
    );
  }

  updateLights(scene) {
    this._directionalLights.length = 0;
    this._pointLights.length = 0;
    this._spotLights.length = 0;
    this._shadowLights.length = 0;
    let lights = scene._lights;
    for (let i = 0; i < lights.length; ++i) {
      let light = lights.data[i];
      light.update(this._device);
      if (light.shadowType !== enums.SHADOW_NONE) {
        this._shadowLights.push(light);
        let view = this._requestView();
        light.extractView(view, PassStage.SHADOWCAST);
      }
      if (light._type === enums.LIGHT_DIRECTIONAL) {
        this._directionalLights.push(light);
      } else if (light._type === enums.LIGHT_POINT) {
        this._pointLights.push(light);
      } else {
        this._spotLights.push(light);
      }
    }
  }

  render(canvas, scene) {
    this._reset();

    // update lights, extract shadow view.
    this.updateLights(scene);

    // extract views from cameras, lights and so on
    if (scene._debugCamera) {
      let view = this._requestView();
      scene._debugCamera.extractView(view, canvas.width, canvas.height);
    } else {
      for (let i = 0; i < scene._cameras.length; ++i) {
        let view = this._requestView();
        scene._cameras.data[i].extractView(view, canvas.width, canvas.height);
      }
    }

    // render by cameras
    this._viewPools.sort((a, b) => {
      return (a._priority - b._priority);
    });
    scene._views.sort((a, b) => {
      return (a._priority - b._priority);
    });
    for (let i = 0; i < this._viewPools.length; ++i) {
      let view = this._viewPools.data[i];
      this._render(view, scene);
    }

    // render by views (ui)
    for (let i = 0; i < scene._views.length; ++i) {
      let view = scene._views[i];
      this._render(view, scene);
    }
  }

  _submitLightUniforms() {
    this._device.setUniform('_sceneAmbient', this._sceneAmbient);

    if (this._directionalLights.length > 0) {
      for (let index = 0; index < this._directionalLights.length; ++index) {
        let light = this._directionalLights[index];
        this._device.setUniform(`_dir_light${index}_direction`, light._directionUniform);
        this._device.setUniform(`_dir_light${index}_color`, light._colorUniform);
      }
    }
    if (this._pointLights.length > 0) {
      for (let index = 0; index < this._pointLights.length; ++index) {
        let light = this._pointLights[index];
        this._device.setUniform(`_point_light${index}_position`, light._positionUniform);
        this._device.setUniform(`_point_light${index}_color`, light._colorUniform);
        this._device.setUniform(`_point_light${index}_range`, light._range);
      }
    }

    if (this._spotLights.length > 0) {
      for (let index = 0; index < this._spotLights.length; ++index) {
        let light = this._spotLights[index];
        this._device.setUniform(`_spot_light${index}_position`, light._positionUniform);
        this._device.setUniform(`_spot_light${index}_direction`, light._directionUniform);
        this._device.setUniform(`_spot_light${index}_color`, light._colorUniform);
        this._device.setUniform(`_spot_light${index}_range`, light._range);
        this._device.setUniform(`_spot_light${index}_spot`, light._spotUniform);
      }
    }
  }

  _submitShadowStageUniforms(view) {
    let light = view._shadowLight;
    this._device.setUniform('_minDepth', light.shadowMinDepth);
    this._device.setUniform('_maxDepth', light.shadowMaxDepth);
    this._device.setUniform('_bias', light.shadowBias);
    this._device.setUniform('_depthScale', light.shadowDepthScale);
  }

  _submitOtherStagesUniforms() {
    for (let index = 0; index < this._shadowLights.length; ++index) {
      let light = this._shadowLights[index];
      this._device.setUniform(`_lightViewProjMatrix_${index}`, mat4.array(_a16_lightViewProj, light.viewProjMatrix));
      this._device.setUniform(`_minDepth_${index}`, light.shadowMinDepth);
      this._device.setUniform(`_maxDepth_${index}`, light.shadowMaxDepth);
      this._device.setUniform(`_bias_${index}`, light.shadowBias);
      this._device.setUniform(`_depthScale_${index}`, light.shadowDepthScale);
      this._device.setUniform(`_darkness_${index}`, light.shadowDarkness);
      this._device.setUniform(`_frustumEdgeFalloff_${index}`, light.frustumEdgeFalloff);
      this._device.setUniform(`_texelSize_${index}`, new Float32Array([1.0 / light.shadowResolution, 1.0 / light.shadowResolution]));
    }
  }

  _updateShaderDefines(item) {
    // for (let i = 0; i < items.length; ++i) {
    //   let item = items.data[i];
      let defines = item.defines;

      defines['_NUM_DIR_LIGHTS'] = Math.min(4, this._directionalLights.length);
      defines['_NUM_POINT_LIGHTS'] = Math.min(4, this._pointLights.length);
      defines['_NUM_SPOT_LIGHTS'] = Math.min(4, this._spotLights.length);

      defines['_NUM_SHADOW_LIGHTS'] = Math.min(4, this._shadowLights.length);
    // }
  }

    _shadowStage(item) {
        this._device.setUniform('_lightViewProjMatrix', mat4.array(_a16_viewProj, this._currentView._matViewProj));

        // update rendering
        // this._submitLightUniforms();
        this._submitShadowStageUniforms(this._currentView);
        this._updateShaderDefines(item);


        // draw it

        if (item.model._castShadow) {
            this._drawPass(item);
        }

    }

    _defaultStage(item) {
        this._drawPass(item);
    }

    _forwardStage(item) {

        // update rendering
        this._submitLightUniforms();
        this._submitOtherStagesUniforms();
        this._updateShaderDefines(item);


        for (let index = 0; index < this._shadowLights.length; ++index) {
            let light = this._shadowLights[index];
            this._device.setTexture(`_shadowMap_${index}`, light.shadowMap, this._allocTextureUnit());
        }

        this._drawPass(item);
    }



  _drawSkinning(item) {
    let { model, defines } = item;

    defines['_USE_SKINNING'] = true;
    if (model._jointsTexture != null) {
      defines['_USE_JOINTS_TEXTURE'] = true;
      this._device.setTexture('_u_jointsTexture', model._jointsTexture, this._allocTextureUnit());
      this._device.setUniform('_u_jointsTextureSize', model._jointsTexture._width);
    } else if (model._jointsMatrixArray != null) {
      defines['_USE_JOINTS_TEXTURE'] = false;
      this._device.setUniform("_u_jointMatrices", model._jointsMatrixArray);
    }

    this._draw(item);
  }

  _drawLineBatch(item) {
    let model = item.model;
    let curVertCount = 0;
    let vdata = this._lineIAs.requestVData(model.vertCount);
    let vdataF32 = vdata.float32View;

    for (let i = model.lineCount - 1; i >= 0; --i) {
      let line = model.getLine(i);

      // flush when verts exceeds
      if (curVertCount + 2 >= this._lineIAs.maxVerts) {
        let ia = this._lineIAs.requestIA();
        ia._vertexBuffer.update(0, vdataF32);
        ia._start = 0;
        ia._count = curVertCount;

        item.ia = ia;
        this._draw(item);
        curVertCount = 0;
      }

      //
      let idx = curVertCount * 6;
      vdataF32[idx] = line.start.x;
      vdataF32[idx + 1] = line.start.y;
      vdataF32[idx + 2] = line.start.z;
      vdataF32[idx + 3] = line.color.r;
      vdataF32[idx + 4] = line.color.g;
      vdataF32[idx + 5] = line.color.b;

      vdataF32[idx + 6] = line.end.x;
      vdataF32[idx + 7] = line.end.y;
      vdataF32[idx + 8] = line.end.z;
      vdataF32[idx + 9] = line.color.r;
      vdataF32[idx + 10] = line.color.g;
      vdataF32[idx + 11] = line.color.b;

      curVertCount += 2;
    }

    // flush rest verts
    if (curVertCount > 0) {
      let ia = this._lineIAs.requestIA();
      ia._vertexBuffer.update(0, vdataF32);
      ia._start = 0;
      ia._count = curVertCount;

      item.ia = ia;
      this._draw(item);
    }
  }

  _drawSpriteBatch(item) {
    let model = item.model;
    let curVertOffset = 0;
    let curVertCount = 0;
    let curIndexCount = 0;
    let vdata = this._spriteIAs.requestVData(model.vertCount);
    let idata = this._spriteIAs.requestIData(model.indexCount);
    let vdataF32 = vdata.float32View;
    let idataU16 = idata.uint16View;

    for (let i = 0; i < model.spriteCount; ++i) {
      let sprite = model.getSprite(i);
      let vcount = sprite.refPositions.length;
      let icount = sprite.refIndices.length;

      // flush when verts exceeds
      if (
        curVertCount + vcount >= this._spriteIAs.maxVerts ||
        curIndexCount + icount >= this._spriteIAs.maxIndices
      ) {
        let ia = this._spriteIAs.requestIA();
        ia._vertexBuffer.update(0, vdataF32);
        ia._indexBuffer.update(0, idataU16);

        ia._start = 0;
        ia._count = curIndexCount;

        item.ia = ia;
        this._draw(item);

        curVertOffset = 0;
        curVertCount = 0;
        curIndexCount = 0;
      }

      //
      for (let j = 0; j < vcount; ++j) {
        let idx = curVertCount * 9;

        vdataF32[idx] = sprite.refPositions[j].x;
        vdataF32[idx + 1] = sprite.refPositions[j].y;
        vdataF32[idx + 2] = sprite.refPositions[j].z;
        vdataF32[idx + 3] = sprite.refUVs[j].x;
        vdataF32[idx + 4] = sprite.refUVs[j].y;
        vdataF32[idx + 5] = sprite.refColor.r;
        vdataF32[idx + 6] = sprite.refColor.g;
        vdataF32[idx + 7] = sprite.refColor.b;
        vdataF32[idx + 8] = sprite.refColor.a;

        curVertCount += 1;
      }

      for (let j = 0; j < icount; ++j) {
        let idx = curIndexCount;

        idataU16[idx] = curVertOffset + sprite.refIndices[j];

        curIndexCount += 1;
      }

      curVertOffset += vcount;
    }

    // flush rest verts & indices
    if (curIndexCount > 0) {
      let ia = this._spriteIAs.requestIA();
      ia._vertexBuffer.update(0, vdataF32);
      ia._indexBuffer.update(0, idataU16);
      ia._start = 0;
      ia._count = curIndexCount;

      item.ia = ia;
      this._draw(item);
    }
  }

  _drawParticleBatch(item) {
    item.ia = item.model._ia;
    if (item.model._renderer) {
      item.model._renderer.updateShaderUniform();
    }
    this._draw(item);
  }
}
