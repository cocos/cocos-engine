

let instanceBuffer;
let vbuf;
let bufferIdx = 0;

export const vfmtInstance = new cc.gfx.VertexFormat([
    { name: 'a_uv_matrix', type: cc.gfx.ATTR_TYPE_FLOAT32, num: 4 },
    { name: 'a_pos_local', type: cc.gfx.ATTR_TYPE_FLOAT32, num: 4 },
    { name: 'a_pos_rotate_scale', type: cc.gfx.ATTR_TYPE_FLOAT32, num: 4 },
    { name: 'a_pos_translate', type: cc.gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: 'a_uv_rotate', type: cc.gfx.ATTR_TYPE_FLOAT32, num: 1 },
    { name: 'a_texture_id', type: cc.gfx.ATTR_TYPE_FLOAT32, num: 1 },
])

const FixedRequestCount = 1000;

export function getBuffer () {
    if (!instanceBuffer) {
        instanceBuffer = cc.renderer._handle.getBuffer('mesh', vfmtInstance);
        instanceBuffer.request(FixedRequestCount, 0);
        instanceBuffer.instanceOffset = 0;
        instanceBuffer.instanceStart = 0;
        
        let _originReset = instanceBuffer.reset;
        instanceBuffer.reset = function () {
            _originReset.call(this);

            this.request(FixedRequestCount, 0);
            
            this.instanceOffset = 0;
            this.instanceStart = 0;
        }
        instanceBuffer.isInstance = true;
        instanceBuffer.instanceCount = function () {
            return bufferIdx;
        }
        instanceBuffer.forwardIndiceStartToOffset = function () {
            this.uploadData();

            // this.instanceStart = this.instanceOffset;
            this.instanceStart = 0;
            this.instanceOffset = 0;

            this.switchBuffer();
            this.request(FixedRequestCount, 0);
        }

        vbuf = instanceBuffer._vData;
    }
    return instanceBuffer;
}

export function getVBuffer () {
    return instanceBuffer._vData;
}
