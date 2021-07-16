/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


// __fastMQ__ in created in engine-native\cocos\bindings\manual\jsb_scene_manual_ext.cpp

const FN_TABLE = ns.DrawBatch2D.fnTable;

// @ts-check
let isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

function beginTrans(fn, minBytes) {
    let dataView = new DataView(__fastMQ__[__fastMQIdx__]);
    let startPos = dataView.getUint32(0, isLittleEndian);
    let commands = dataView.getUint32(4, isLittleEndian);
    if (dataView.byteLength <= startPos + minBytes + 12) {
        // allocation new ArrayBuffer, same size as __fastMQ__[0]
        if (!__fastMQ__[__fastMQIdx__ + 1]) {
            const buffer = new ArrayBuffer(dataView.byteLength);
            __fastMQ__.push(buffer);
            if(__fastMQIdx__ + 1 > 5) {
                console.warn(`Too many pending commands in __fastMQ__, forget to flush?`);
            }
        }
        __fastMQIdx__ += 1;
        dataView = new DataView(__fastMQ__[__fastMQIdx__]);
        startPos = 8;
        commands = 0;
    }

    let offset = 4;         // reserved for block total length
    dataView.setBigUint64(startPos + offset, fn, isLittleEndian);
    offset += 8;
    return {
        writeUint32: (value) => {
            dataView.setUint32(startPos + offset, value, isLittleEndian);
            offset += 4;
        },
        writeBigUint64: (value) => {
            dataView.setBigUint64(startPos + offset, value, isLittleEndian);
            offset += 8;
        },
        commit: () => {
            dataView.setUint32(startPos + 0, offset, isLittleEndian);   // fn length
            dataView.setUint32(0, startPos + offset, isLittleEndian);   // update offset
            dataView.setUint32(4, commands + 1, isLittleEndian);        // update cnt
        },
    };
}


Object.defineProperty(ns.DrawBatch2D.prototype, "visFlags", {
    set: function (v) {
        let trans = beginTrans(FN_TABLE['visFlags'], 12);
        trans.writeBigUint64(this.__native_ptr__);
        trans.writeUint32(v);
        trans.commit();
    },
    enumerable: true,
    configurable: true
});


Object.defineProperty(ns.DrawBatch2D.prototype, "descriptorSet", {
    set: function (v) {
        if (!v) return;
        let trans = beginTrans(FN_TABLE['descriptorSet'], 16);
        trans.writeBigUint64(this.__native_ptr__);
        trans.writeBigUint64(v.__native_ptr__);
        trans.commit();
    },
    enumerable: true,
    configurable: true
});


Object.defineProperty(ns.DrawBatch2D.prototype, "inputAssembler", {
    set: function (v) {
        if (!v) return;
        let trans = beginTrans(FN_TABLE['inputAssembler'], 16);
        trans.writeBigUint64(this.__native_ptr__);
        trans.writeBigUint64(v.__native_ptr__);
        trans.commit();
    },
    enumerable: true,
    configurable: true
});


Object.defineProperty(ns.DrawBatch2D.prototype, "passes", {
    set: function (passes) {
        if (!passes) return;

        let trans = beginTrans(FN_TABLE['passes'], 8 + 4 + passes.length * 8);
        trans.writeBigUint64(this.__native_ptr__);
        trans.writeUint32(passes.length); // arg
        for (let p of passes) {
            trans.writeBigUint64(p.__native_ptr__);
        }
        trans.commit();
    },
    enumerable: true,
    configurable: true
});


Object.defineProperty(ns.DrawBatch2D.prototype, "shaders", {
    set: function (shaders) {
        if (!shaders) return;
        let trans = beginTrans(FN_TABLE['shaders'], 8 + 4 + shaders.length * 8);
        trans.writeBigUint64(this.__native_ptr__);
        trans.writeUint32(shaders.length); // arg
        for (let p of shaders) {
            trans.writeBigUint64(p.__native_ptr__);
        }
        trans.commit();
    },
    enumerable: true,
    configurable: true
});