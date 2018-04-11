const Armature = require('./ArmatureDisplay');
const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const math = renderEngine.math;

const utils = require('../../cocos2d/core/renderer/canvas/renderers/utils');

let _color = cc.color();

let _matrix = math.mat4.create();
let _matrix2 = math.mat4.create();

let armatureAssembler = {
    draw (ctx, comp) {
        let armature = comp._armature;
        if (!armature || comp._isChildArmature) return 0;

        ctx.save();

        let node = comp.node;
        let matrix = node._worldMatrix;

        let texture = comp.dragonAtlasAsset.texture;
        this.drawArmature(ctx, armature, texture, matrix);

        ctx.restore();

        return 1;
    },

    drawArmature (ctx, armature, texture, matrix) {
        let slots = armature._slots;
        
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            if (slot.childArmature) {
                math.mat4.mul(_matrix, matrix, slot._matrix);
                this.drawArmature(ctx, slot.childArmature, texture, _matrix);
                continue;
            }

            let localVertices = slot._localVertices;

            if (localVertices.length !== 4) {
                continue;
            }

            ctx.save();
            
            math.mat4.mul(_matrix2, matrix, slot._matrix);

            let m = _matrix2;
            ctx.transform(m.m00, -m.m01, -m.m04, m.m05, m.m12, -m.m13);
            
            let vertices = slot._vertices;
            let sx = vertices[0].u * texture.width;
            let sy = vertices[3].v * texture.height;
            let sw = vertices[3].u * texture.width - sx;
            let sh = vertices[0].v * texture.height - sy;

            let x = localVertices[0].x;
            let y = localVertices[0].y;
            let w = localVertices[3].x - x;
            let h = localVertices[3].y - y;
            y = -y-h;

            _color._val = slot._color;
            let image = utils.getFrameCache(texture, _color, sx, sy, sw, sh);

            ctx.drawImage(image, x, y, w, h);

            ctx.restore();
        }
    }
};

module.exports = Armature._assembler = armatureAssembler;
