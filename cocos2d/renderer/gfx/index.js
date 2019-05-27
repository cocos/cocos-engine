import {
    enums,
    attrTypeBytes,
    glFilter,
    glTextureFmt,
} from './enums';

let gfx = null;

if (CC_JSB && CC_NATIVERENDERER) {
    gfx = window.gfx;
} else {
    let VertexFormat = require('./vertex-format');
    let IndexBuffer = require('./index-buffer');
    let VertexBuffer = require('./vertex-buffer');
    let Program = require('./program');
    let Texture = require('./texture');
    let Texture2D = require('./texture-2d');
    let TextureCube = require('./texture-cube');
    let RenderBuffer = require('./render-buffer');
    let FrameBuffer = require('./frame-buffer');
    let Device = require('./device');

    gfx = {
        // classes
        VertexFormat,
        IndexBuffer,
        VertexBuffer,
        Program,
        Texture,
        Texture2D,
        TextureCube,
        RenderBuffer,
        FrameBuffer,
        Device,

        // functions
        attrTypeBytes,
        glFilter,
        glTextureFmt,
    };
    Object.assign(gfx, enums);
}

export default gfx;
cc.gfx = gfx;
