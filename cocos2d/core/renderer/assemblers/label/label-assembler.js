const Label = require('../../../components/CCLabel');
const ttfAssembler = require('./ttf-assembler');
const bmfontAssembler = require('./bmfont-assembler');

var labelAssembler = {
    updateRenderData (comp) {
        let assembler;
        if (comp.font instanceof cc.BitmapFont) {
            assembler = bmfontAssembler;
        }
        else {
            assembler = ttfAssembler;
        }

        let renderData = comp._renderData;
        if (!renderData) {
            renderData = comp._renderData = assembler.createData(comp);
        }

        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
        
        assembler.update(comp);
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
        if (comp.font instanceof cc.BitmapFont) {
            bmfontAssembler.fillVertexBuffer(comp, index, vbuf, uintbuf);
        }
        else {
            ttfAssembler.fillVertexBuffer(comp, index, vbuf, uintbuf);
        }
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        if (comp.font instanceof cc.BitmapFont) {
            bmfontAssembler.fillIndexBuffer(comp, offset, vertexId, ibuf);
        }
        else {
            ttfAssembler.fillIndexBuffer(comp, offset, vertexId, ibuf);
        }
    }
}

Label._assembler = labelAssembler;

module.exports = labelAssembler;