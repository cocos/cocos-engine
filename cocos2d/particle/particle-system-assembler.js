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

const js = require('../core/platform/js');
const ParticleSystem = require('./CCParticleSystem');
const renderEngine = require('../core/renderer/render-engine');
const RenderFlow = require('../core/renderer/render-flow');

var particleSystemAssembler = {
    useModel: true,

    updateUVs (comp) {
        let material = comp.getMaterial();
        let renderData = comp._renderData;
        if (material && renderData) {
            let data = renderData._data;
            let texture = material.effect.getProperty('texture');
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
            comp._renderData = comp.requestRenderData();
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
            comp.scheduleOnce(comp._finishedSimulation, 0);
        }

        renderData.vertexCount = vfx.buffers.indexes.length;
        renderData.indiceCount = renderData.vertexCount / 2 * 3;
        renderData.material = comp.getMaterial();
    },

    fillBuffers (comp, renderer) {
        let verts = comp._vfx.buffers.indexes;
        

        let buffer = renderer.getBuffer('mesh', comp._vertexFormat),
            vertexOffset = buffer.byteOffset >> 2,
            vbuf = buffer._vData;
        
        let ibuf = buffer._iData,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;

        let quads = verts.length / 4;
        let quadsize = comp._vfx.quadsize;
        let w = quadsize[0], h = quadsize[1];

        buffer.request(verts.length, w/2 * h/2 * 6);

        // vertex buffer
        for (let i = 0; i < verts.length; i++) {
            vbuf[vertexOffset] = verts[i];
            vertexOffset++;
        }

        // index buffer
        
        for (let y = 0; y < h; y+=2) {
            for (let x = 0; x < w; x+=2) {
                let i = vertexId + y * w + x;
                ibuf[indiceOffset + 0] = i;
                ibuf[indiceOffset + 1] = i + 1;
                ibuf[indiceOffset + 2] = i + w;
                ibuf[indiceOffset + 3] = i + 1;
                ibuf[indiceOffset + 4] = i + w + 1;
                ibuf[indiceOffset + 5] = i + w;
                indiceOffset += 6;
            }
        }

        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

ParticleSystem._assembler = particleSystemAssembler;

module.exports = particleSystemAssembler;