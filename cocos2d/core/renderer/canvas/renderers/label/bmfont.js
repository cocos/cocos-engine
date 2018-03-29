const bmfontUtils = require('../../../utils/label/bmfont')
const js = require('../../../../platform/js');
const utils = require('../utils');

module.exports = js.addon({
    createData (comp) {
        return comp.requestRenderData();
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
        let dataOffset = renderData.dataLength;
        
        renderData.dataLength += 2;

        let data = renderData._data;
        let texw = texture.width,
            texh = texture.height;

        let rectWidth = rect.width,
            rectHeight = rect.height;

        let l, b, r, t;
        if (!rotated) {
            l = rect.x;
            r = rect.x + rectWidth;
            b = rect.y;
            t = rect.y + rectHeight;

            data[dataOffset].u = l;
            data[dataOffset].v = b;
            data[dataOffset+1].u = r;
            data[dataOffset+1].v = t;
        } else {
            l = rect.x;
            r = rect.x + rectHeight;
            b = rect.y;
            t = rect.y + rectWidth;

            data[dataOffset].u = l;
            data[dataOffset].v = t;
            data[dataOffset+1].u = l;
            data[dataOffset+1].v = b;
        }

        data[dataOffset].x = x;
        data[dataOffset].y = y - rectHeight * scale;
        data[dataOffset+1].x = x + rectWidth * scale;
        data[dataOffset+1].y = y;
    },

    draw (ctx, comp) {
        let node = comp.node;
        // Transform
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        ctx.transform(a, b, c, d, tx, -ty);

        // TODO: handle blend function

        // opacity
        ctx.glphaAlpha = node.opacity / 255;

        let tex = comp._texture,
            data = comp._renderData._data;

        let image = utils.getColorizedImage(tex, node.color);

        for (let i = 0, l = data.length; i < l; i+=2) {
            let x = data[i].x;
            let y = data[i].y;
            let w = data[i+1].x - x;
            let h = data[i+1].y - y;
            y = - y - h;

            let sx = data[i].u;
            let sy = data[i].v;
            let sw = data[i+1].u - sx;
            let sh = data[i+1].v - sy;

            ctx.drawImage(image, 
                sx, sy, sw, sh,
                x, y, w, h);
        }
        
        return 1;
    }
}, bmfontUtils);
