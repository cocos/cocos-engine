const ParticleSystem = require('../../../particle/CCParticleSystem');
const renderEngine = require('../render-engine');
const RenderData = renderEngine.RenderData;

var particleSystemAssembler = {
    useModel: true,

    updateUVs (comp) {
        let effect = comp.getEffect();
        let renderData = comp._renderData;
        if (effect && renderData) {
            let data = renderData._data;
            let texture = effect.getValue('texture');
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
        if (comp._particleCountDirty) {
            vfx.updateParticleCount(comp);
            comp._updateMaterialSize();
            comp._particleCountDirty = false;
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
        vfx.step(cc.director.getDeltaTime());

        renderData.vertexCount = vfx.buffers.indexes.length;
        renderData.indiceCount = renderData.vertexCount / 2 * 3;
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
        let off = index * comp._vertexFormat._bytes / 4;
        let verts = comp._vfx.buffers.indexes;
        for (let i = 0; i < verts.length; i++) {
            vbuf[off] = verts[i];
            off++;
        }
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        let quads = comp._vfx.buffers.indexes.length / 4;
        let quadsize = comp._vfx.quadsize;
        let w = quadsize[0], h = quadsize[1];
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
}

ParticleSystem._assembler = particleSystemAssembler;

module.exports = particleSystemAssembler;