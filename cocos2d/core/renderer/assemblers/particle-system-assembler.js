const ParticleSystem = require('../../../particle/CCParticleSystem');
const renderEngine = require('../render-engine');
const RenderData = renderEngine.RenderData;

var particleSystemAssembler = {
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
            
            let l = texw === 0 ? 0 : (rect.x / texw);
            let t = texh === 0 ? 0 : (rect.y / texh);
            let r = texw === 0 ? 0 : (rect.x + rect.width / texw);
            let b = texh === 0 ? 0 : (rect.y + rect.height / texh);
            
            if (frame._rotated) {
                data[0].u = l;
                data[0].v = t;
                data[1].u = l;
                data[1].v = b;
                data[2].u = r;
                data[2].v = t;
                data[3].u = r;
                data[3].v = b;
            }
            else {
                data[0].u = l;
                data[0].v = b;
                data[1].u = r;
                data[1].v = b;
                data[2].u = l;
                data[2].v = t;
                data[3].u = r;
                data[3].v = t;
            }
            
            renderData.uvDirty = false;
        }
    },

    updateRenderData (comp) {
        if (!comp._renderData) {
            comp._renderData = new RenderData();
            comp._renderData.dataLength = 4;
            // renderData.vertexCount = 4;
            // renderData.indiceCount = 6;
        }
        let renderData = comp._renderData;
        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);

        if (renderData.uvDirty) {
            this.updateUVs(comp);
        }

        // Process to generate vertex buffer and index buffer
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
    }
}

ParticleSystem._assembler = particleSystemAssembler;

module.exports = particleSystemAssembler;