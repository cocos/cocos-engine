/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const js = require('../../platform/js');
const assembler = require('./assembler');
const ParticleSystem = require('../../../particle/CCParticleSystem');
const renderEngine = require('../render-engine');
const RenderData = renderEngine.RenderData;

var particleSystemAssembler = js.addon({
    useModel: true,

    updateUVs (comp) {
        let effect = comp.getEffect();
        let renderData = comp._renderData;
        if (effect && renderData) {
            let data = renderData._data;
            let texture = effect.getProperty('texture');
            let texw = texture._width,
                texh = texture._height;
            let frame = comp.spriteFrame;
            let rect = frame._rect;
            
            comp._uv.l = texw === 0 ? 0 : (rect.x / texw);
            comp._uv.t = texh === 0 ? 0 : (rect.y / texh);
            comp._uv.r = texw === 0 ? 0 : (rect.x + rect.width / texw);
            comp._uv.b = texh === 0 ? 0 : (rect.y + rect.height / texh);
            
            comp._material.uv = comp._uv;
            renderData.uvDirty = false;
        }
    },

    updateRenderData (comp) {
        if (!comp._renderData) {
            comp._renderData = RenderData.alloc();
            comp._renderData.dataLength = 0;
        }

        let renderData = comp._renderData;
        if (renderData.uvDirty) {
            this.updateUVs(comp);
        }

        let vfx = comp._vfx;
        // Update particle configs
        if (comp._maxParticleDirty) {
            vfx.updateMaxParticle(comp);
            comp._updateMaterialSize();
            comp._maxParticleDirty = false;
        }
        if (comp._sizeScaleDirty) {
            vfx.updateSizeScale(comp);
            comp._sizeScaleDirty = false;
        }
        if (comp._accelScaleDirty) {
            vfx.updateAccelScale(comp);
            comp._accelScaleDirty = false;
        }
        if (comp._radiusScaleDirty) {
            vfx.updateRadiusScale(comp);
            comp._radiusScaleDirty = false;
        }

        // Process to generate vertex buffer and index buffer
        // TODO: Update vfx parameters, check whether to update other material configs, z etc
        let running = !vfx.stopped;
        vfx.step(cc.director.getDeltaTime());
        // check finish
        if (running && vfx.stopped) {
            comp._finishedSimulation();
        }

        renderData.vertexCount = vfx.buffers.indexes.length;
        renderData.indiceCount = renderData.vertexCount / 2 * 3;
        renderData.effect = comp.getEffect();
        this.datas.length = 0;
        this.datas.push(renderData);
        return this.datas;
    },

    fillBuffers (comp, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let offset = batchData.byteOffset / 4,
            verts = comp._vfx.buffers.indexes;
        
        // vertex buffer
        for (let i = 0; i < verts.length; i++) {
            vbuf[offset] = verts[i];
            offset++;
        }

        // index buffer
        let quads = comp._vfx.buffers.indexes.length / 4;
        let quadsize = comp._vfx.quadsize;
        let w = quadsize[0], h = quadsize[1];
        offset = batchData.indiceOffset;
        for (let y = 0; y < h; y+=2) {
            for (let x = 0; x < w; x+=2) {
                let i = vertexId + y * w + x;
                ibuf[offset + 0] = i;
                ibuf[offset + 1] = i + 1;
                ibuf[offset + 2] = i + w;
                ibuf[offset + 3] = i + 1;
                ibuf[offset + 4] = i + w + 1;
                ibuf[offset + 5] = i + w;
                offset += 6;
            }
        }
    }
}, assembler);

ParticleSystem._assembler = particleSystemAssembler;

module.exports = particleSystemAssembler;