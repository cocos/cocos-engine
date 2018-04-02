const ttfUtils = require('../../../utils/label/ttf')
const js = require('../../../../platform/js');
const utils = require('../utils');

module.exports = js.addon({
    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 0 for bottom left, 1 for top right
        renderData.dataLength = 2;
        return renderData;
    },

    _updateVerts (comp) {
        let renderData = comp._renderData;

        let node = comp.node,
            width = node.width,
            height = node.height,
            appx = node.anchorX * width,
            appy = node.anchorY * height;

        let data = renderData._data;
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = width - appx;
        data[1].y = height - appy;
    },

    _updateTexture (comp) {
        ttfUtils._updateTexture(comp);
        utils.dropColorizedImage(comp._texture, comp.node.color);
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

        let x = data[0].x;
        let y = data[0].y;
        let w = data[1].x - x;
        let h = data[1].y - y;
        y = - y - h;

        ctx.drawImage(image, x, y, w, h);
        return 1;
    }
}, ttfUtils);
