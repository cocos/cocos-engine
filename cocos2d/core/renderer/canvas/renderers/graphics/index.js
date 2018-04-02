const Impl = require('./impl');

module.exports = {
    createImpl () {
        return new Impl();
    },

    draw (ctx, comp) {
        let node = comp.node;
        // Transform
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        ctx.transform(a, b, c, d, tx, -ty);

        ctx.save();
        ctx.scale(1, -1);

        // TODO: handle blend function

        // opacity
        ctx.glphaAlpha = node.opacity / 255;

        let style = comp._impl.style;
        ctx.strokeStyle = style.strokeStyle;
        ctx.fillStyle = style.fillStyle;
        ctx.lineWidth = style.lineWidth;
        ctx.lineJoin = style.lineJoin;
        ctx.miterLimit = style.miterLimit;

        let endPath = true;
        let cmds = comp._impl.cmds;
        for (let i = 0, l = cmds.length; i < l; i++) {
            let cmd = cmds[i];
            let ctxCmd = cmd[0], args = cmd[1];

            if (ctxCmd === 'moveTo' && endPath) {
                ctx.beginPath();
                endPath = false;
            }
            else if (ctxCmd === 'fill' || ctxCmd === 'stroke' || ctxCmd === 'fillRect') {
                endPath = true;
            }

            if (typeof ctx[ctxCmd] === 'function') {
                ctx[ctxCmd].apply(ctx, args);
            }
            else {
                ctx[ctxCmd] = args;
            }
        }

        ctx.restore();

        return 1;
    },

    stroke (comp) {
        comp._impl.stroke();
    },

    fill (comp) {
        comp._impl.fill();
    }
}
